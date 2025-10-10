import mongoose from "mongoose";
import { Reactions, RequestStatuses, userAgent, UserTypes } from "./enums";
import { fileformat } from "./types";






export interface IFrindRequest 
{
  From:mongoose.Types.ObjectId,
  SentAt:Date
}


export interface IUser 
{
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
    PasswordResetExpire?:Date,
    FrindList?:mongoose.Types.ObjectId[],
    BlockedList?:mongoose.Types.ObjectId[]
    PendingFrindingRequests?:IFrindRequest[],
    SentRequests?:ISentRequests[]
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
Content:string
Reactions?:IReaction[]
Attachments?:fileformat[]
}


export interface IMessage 
{
  content: string;
  senderID:mongoose.Types.ObjectId; 
  Attachment?:fileformat
}


export interface IComment 
{
  PostID: mongoose.Types.ObjectId;           
  UserID: mongoose.Types.ObjectId;           
  CommentContent: string;     
  ParentID?: mongoose.Types.ObjectId                 
  Reactions?: IReaction[];   
}


export interface IConversation 
{
  CreatorID:mongoose.Types.ObjectId
  ReceiverID:mongoose.Types.ObjectId
  dialog?:IMessage[]
  latestActivity?:Date
}

export interface ISentRequests 
{
 To:mongoose.Types.ObjectId 
 SentAt:Date
 ReqestStatus:RequestStatuses
}