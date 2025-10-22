import mongoose from "mongoose";
import { RequstEntity, SentRequestEntity, UpdateUserEntity } from "./User.Entities";
import { IUser } from "../../Utils/Common/Interfaces";
import CryptoJS from "crypto-js"
import  bcrypt  from 'bcrypt';;
export class UserFactory
{

    SendFrindRequest(From:mongoose.Types.ObjectId)
    {
    const Request = new RequstEntity()

     Request.From = From 
     return Request
    }

    SentRequest(To:mongoose.Types.ObjectId)
    {
        const sentRequest = new SentRequestEntity()
        sentRequest.To = To
        return sentRequest 
    }
   
  UpdateUser(Fullname:string,Body:UpdateUserEntity)
  {
   const User:Partial<IUser> ={}
   const OldFullname = Fullname
   const OldFname = OldFullname.split("-")[0]
   const OLdLname = OldFullname.split("-")[1]
   if(Body.FName)
   {
    const NewFullname = `${Body.FName}-${OLdLname}`
    User.Fullname = NewFullname
   }
   if(Body.LName)
   {
     const NewFullname = `${OldFname}-Body.Lname`
      User.Fullname = NewFullname
   }
   if(Body.Password)
   {
    User.Password = bcrypt.hashSync(Body.Password,10)
   }
   if(Body.Phone)
   {
    User.Phone = CryptoJS.AES.encrypt(Body.Phone,process.env.secretkey as string).toString()
   }
   return User
  }


}