import  bcrypt  from 'bcrypt';
import { LoginDTO, RegisterDTO, ResetPasswordDTO, SendOTPDTO, VerfiyEmailDTO } from './AuthDTO';
import { NextFunction, Request, Response } from 'express';
import { UserRepo } from './../../DB/Models/User/UserRepo';
import { AuthFactory } from './Auth.factory';
import { AppError } from '../../Utils/Error';
import { DeleteOne, UploadOne } from '../../Utils/cloud/CloudServcies';
import { SendMail } from '../../Utils/mail';
import { nanoid } from 'nanoid';
import { SignToken } from '../../Utils/Token';




export class Authservices
{
  constructor(){}   

  // Initialize Repositories and Factories
  private userRepory = new UserRepo()
  private authFactory = new AuthFactory()

  // Create User Account
  async CreateUserAccount(req:Request,res:Response,next:NextFunction)
  {
    // Extract request body and file
    const registerDTO:RegisterDTO = req.body 
    const file = req.file

    // Check if file (profile picture) exists
    if(!file)
    {
      throw new AppError("photo error",400)
    }

    // Create user entity from DTO
    const User = this.authFactory.CreateUser(registerDTO)

    // Check if user already exists
    const userExist = await this.userRepory.IsExist({Email:User.Email})
    if(userExist)
    {
      throw new AppError("User alredy Exist",401)
    }

    // Create user in database
    const createduser = await this.userRepory.createDocument(User)
    if(!createduser)
    {
      throw new AppError("Server Error Cr-us",500)
    }

    // Upload profile picture to cloud storage
    const Uploadedpicture = await UploadOne(file.path,`social/users/${createduser._id}/photos/profilepicture`)
    // temp
    console.log(Uploadedpicture)
    if(!Uploadedpicture)
    {
      await this.userRepory.deleteDocument({_id:createduser._id})
      throw new AppError("Server Error upl-pho",500)
    }
    else 
    {
      // Update user with profile picture details
      let updateresult = await this.userRepory.updateDocument({_id:createduser._id},{$set:{ProfilePicture:{ID:Uploadedpicture.ID,URL:Uploadedpicture.URL}}}
      )
      if(!updateresult)
      {
        await DeleteOne(Uploadedpicture.ID)
        await this.userRepory.deleteDocument({_id:createduser._id})
        throw new AppError("server Error up-pho",500)
      }
    }

    // Send OTP email
    const SendOTPResult = await SendMail({toEmail:User.Email,content:User.Otp})
    if(!SendOTPResult)
    {
      throw new AppError("Server Error OTP ",500)
    }

    return res.json({message:"user created succsesfully",status:"success"})
  }
  
  async VerfiyEmail(req:Request,res:Response,next:NextFunction)
  {
  const verfiyEmailDTO:VerfiyEmailDTO = req.body
  const EmailExist = await this.userRepory.IsExist({Email:verfiyEmailDTO.Email})
  if(EmailExist == null)
  {
    throw  AppError.ServerError()
  }
  else if(EmailExist == false)
  {
  throw AppError.NotFound("Email dont exist")
  }
  const User = await this.userRepory.FindOneDocument({Email:verfiyEmailDTO.Email,Otp:verfiyEmailDTO.OTP})
   if(!User)
   {
    throw new AppError("Invalid OTP",400)
   }
   if(new Date(User.OtpExpire ) < new Date(Date.now()))
   {
    throw new AppError("OTP expired",400)
   }
   else 
   {
    const UpdateResult = await this.userRepory.updateDocument({Email:verfiyEmailDTO.Email},{$set:{IsVerifiyed:true},$unset:{OtpExpire:"",Otp:"",ExpireAt:""}})
    if(!UpdateResult)
    {
      throw AppError.ServerError()
    }
   }
   res.status(200).json({message:"Email verfiyed" ,status:"succsess"})
  }

  async SendOTP(req:Request,res:Response,next:NextFunction)
  {
   const sendOTPDTO:SendOTPDTO = req.body
   // to be refactored later into  provider
   const EmailExits = await this.userRepory.IsExist({Email:sendOTPDTO.Email})
   const User = await this.userRepory.FindOneDocument({Email:sendOTPDTO.Email})
   if(User != false)
   {
    if(User.IsVerifiyed == true)
    {
      throw new  AppError("User already verified",401)
    }
   }
    if(!EmailExits)
    {
      throw AppError.NotFound("Invalid Email")
    }
    const newOTP = nanoid(5)

    const UpdateResult = await this.userRepory.updateDocument({Email:sendOTPDTO.Email},{$set:{Otp:newOTP,OtpExpire:new Date(Date.now() + 5 * 60 * 1000)}})
     if(!UpdateResult)
     {
      throw AppError.ServerError()
     }
     const SendResult = await SendMail({toEmail:sendOTPDTO.Email,content:newOTP,expireTimeInMinutes:3*60*1000})
     if(!SendResult)
     {
      throw AppError.ServerError()
     }
     res.status(200).json({message:"OTP sent" ,status:"succsess"})
  }

  async SendOTPResetPassword(req:Request,res:Response,next:NextFunction)
  {
    const sendOTPDTO:SendOTPDTO = req.body
    const ResetOTP = nanoid(5)
    const UpdateResult = await  this.userRepory.updateDocument({Email:sendOTPDTO.Email},{$set:{PasswordResetCode:ResetOTP,PasswordResetExpire:Date.now()+5*60*1000}})
    if(!UpdateResult)
    {
      throw AppError.ServerError()
    }
   const sendresult = await SendMail({toEmail:sendOTPDTO.Email,content:ResetOTP,expireTimeInMinutes:Date.now()+5*60*1000})
   if(!sendresult )
   {
    throw new AppError("Error sending OTP",500)
   }
   res.status(200).json({message:"OTP sent",status:"succsess"})
  }

async ResetNewPassword(req:Request,res:Response,next:NextFunction)
  {
    const resetPasswordDTO:ResetPasswordDTO = req.body;

    // Check if passwords match
    if(resetPasswordDTO.NewPassword !== resetPasswordDTO.RePassword)
    {
      throw new AppError("Passwords do not match",400);
    }

    // Check if user exists
    const User = await this.userRepory.FindOneDocument({Email:resetPasswordDTO.Email});
    if(!User)
    {
      throw AppError.NotFound("User not found");
    }

    // Check if OTP matches
    if(User.PasswordResetCode !== resetPasswordDTO.OTP)
    {
      throw new AppError("Invalid OTP",400);
    }

    // Check if OTP expired
  if(!User.PasswordResetExpire || new Date(User.PasswordResetExpire).getTime() < Date.now())
  {
  throw new AppError("OTP expired",400);
  }

    // Update password and clear OTP fields
    const UpdateResult = await this.userRepory.updateDocument({Email:resetPasswordDTO.Email},
      {
        $set:{Password:resetPasswordDTO.NewPassword},
        $unset:{PasswordResetCode:"",PasswordResetExpire:""}
      }
    );

    if(!UpdateResult)
    {
      throw AppError.ServerError();
    }

    res.status(200).json({message:"Password reset successfully",status:"success"});
}

 async Login(req: Request,res: Response,next: NextFunction) {
  const loginDTO: LoginDTO = req.body
  const user = await this.userRepory.FindOneDocument({Email: loginDTO.Email})
  if(!user) { throw AppError.NotFound("Invalid email or password") }
  if(!user.IsVerifiyed) { throw new AppError("Please verify your email before logging in",401) }
  const isMatch = await bcrypt.compare(loginDTO.Password,user.Password)
  if(!isMatch) { throw new AppError("Invalid email or password",401) }

  const accessToken = SignToken({id: user._id.toString(),Email: user.Email,Fullname: user.Fullname,UserType: user.UserType},"15m")
  if(!accessToken) { throw AppError.ServerError() }

  const refreshToken = SignToken({id: user._id.toString(),Email: user.Email,Fullname: user.Fullname,UserType: user.UserType},"7d")
  if(!refreshToken) { throw AppError.ServerError() }

  return res.status(200).json({message:"Login successful",status:"success",accessToken,refreshToken})
}
}
  

