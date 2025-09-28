import mongoose, { ObjectId } from "mongoose";
import { Reactions, userAgent, UserTypes } from "./enums";
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


export interface IToken 
{
  AccessToken: string;
  RefreshToken: string;
  TokenOwner: mongoose.Types.ObjectId | string; 
}

export interface IReaction 
{
  UserID:mongoose.Types.ObjectId,
  Reaction:Reactions
}

export interface IPost 
{
CreatorID:mongoose.Types.ObjectId,
Header:string
Content:string,
Reactions?:IReaction[]
Attachments?:fileformat[]
}

export interface IReply 
{
  CommentID: mongoose.Types.ObjectId;     
  UserID: mongoose.Types.ObjectId;        
  ReplyContent: string;           
  directedTo: mongoose.Types.ObjectId;        
  CommnetReaction?:IReaction[];         
}

export interface IComment 
{
  PostID: mongoose.Types.ObjectId;           
  UserID: mongoose.Types.ObjectId;           
  CommentContent: string;         
  Replays?:IReply[];               
 Reactions?: IReaction[];   
}