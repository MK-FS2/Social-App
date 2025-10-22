import mongoose from "mongoose";
import { RequestStatuses } from "../../Utils/Common/enums";

export class RequstEntity 
{
From!:mongoose.Types.ObjectId
SentAT!:Date
}

export class SentRequestEntity 
{
To!:mongoose.Types.ObjectId
SentAT!:Date
ReqestStatus!:RequestStatuses
}


export class UpdateUserEntity 
{
  Password?:string
  FName?:string
  LName?:string
  Phone?:string
}