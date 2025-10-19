import mongoose, { HydratedDocument } from "mongoose";
import { IUser } from './../../../Utils/Common/Interfaces';
import { emailRegex, fullNameRegex, passwordRegex, phoneRegex } from './UserRejex';
import { userAgent, UserTypes } from '../../../Utils/Common/enums';
import { SendMail } from "../../../Utils/mail";
import { nanoid } from "nanoid";
import CryptoJS from "crypto-js";
import { AppError } from "../../../Utils/Error";
import FileSchema from "../Common/File/File.Schema";
import { FrindRequest, SentRequest } from "../Common/User/User.CommonSchemas";


export type UserDocument = HydratedDocument<IUser>;

export const UserSchema = new mongoose.Schema<IUser>(
{
  Fullname:
  {
    type: String,
    required: true,
    validate:
    {
      validator: function(value: string)
      {
        return fullNameRegex.test(value);
      },
      message: "Fullname must be 2to10 letters, followed by a dash, then 2to10 letters (letters only)"
    }
  },
  Email:
  {
    type: String,
    required: true,
    unique: true,
    validate:
    {
      validator: function(value: string)
      {
        return emailRegex.test(value);
      },
      message: "Invalid email format"
    }
  },
  Password:
  {
    type: String,
    required: true
  },
  UserAgent:
  {
    type:Number,
    required: true,
    enum: userAgent
  },
  Otp:
  {
    type: String,
    required: true
  },
  OtpExpire:
  {
    type: Date,
    required: true
  },
  Phone:
  {
    type: String,
    required: true,
    validate:
    {
      validator: function(value: string)
      {
        return phoneRegex.test(value);
      },
      message: "Phone number must start with 0 and be 11 digits long"
    }
  },
  ProfilePicture:
  {
    type:FileSchema,
    required: true
  },
  IsVerifiyed:
  {
    type: Boolean,
    required: true,
    default: false
  },
  ExpireAt:
  {
    type: Date,
    required: false,
    default: () => new Date(Date.now() + 30*24*60*60*1000) // 30 days
  },
  PasswordResetCode:
  {
    type: String,
    required: false
  },
  PasswordResetExpire:
  {
    type: Date,
    required: false
  },
  lastModefication:
  {
    type: Date,
    required: true
  },
  UserType:
  {
    type:Number,
    enum: UserTypes,
    required: true,
    default: UserTypes.User
  },
  FrindList:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
  BlockedList:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
  PendingFrindingRequests:[FrindRequest],
  SentRequests:[SentRequest],
  OnlineStatus: 
  {
  Status: 
  {
    type: Boolean,
    default: false,
  },
  WebID: 
  {
    type: String,
    required: function (this: any) 
    {
      return this.Status === true;
    },
  },
}
},
{
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


UserSchema.post("findOne", function (doc) 
{
  try 
  {
    if (!doc || !doc.Phone) return;

    const decrypted = CryptoJS.AES.decrypt(
      doc.Phone,
      process.env.secretkey as string
    ).toString(CryptoJS.enc.Utf8);

    doc.Phone = decrypted;
  } catch (err) {
    console.error("Decryption failed:", err);
  }
});

UserSchema.pre("save",async function(next)
{
  try 
  {
  this.Phone = CryptoJS.AES.encrypt(this.Phone,process.env.secretkey as string).toString()
  const sendResult = await SendMail({toEmail:this.Email,content:nanoid(5)})
  if(!sendResult)
  {
    throw new AppError("Error sending OTP",500)
  }
  }
  catch(err)
  {
    next(err as Error)
  }

})