import mongoose, { ObjectId } from "mongoose";
import { userAgent, UserTypes } from "./enums";
import { fileformat } from "./types";

export interface IUser {
    Fullname:string,
    Email:string,
    UserType:UserTypes,
    Phone:string,
    UserAgent:userAgent,
    Otp:number|string;
    OtpExpire:Date,
    lastModefication:Date,
    ProfilePicture:fileformat,
    IsVerifiyed:boolean,
    Password:string,
    ExpireAt?:Date
    PasswordResetCode?:string,
    PasswordResetExpire?:Date
}



export interface IFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  filename: string;
  destination: string;
  path: string;
  buffer: Buffer;
}


export interface IToken {
  AccessToken: string;
  RefreshToken: string;
  TokenOwner: mongoose.Types.ObjectId;
}


export interface IPost 
{
CreatorID:ObjectId,
Content:string,
Attachments?:fileformat[]|null[]
}