import mongoose from "mongoose";
import { RequestStatuses } from "../../../../Utils/Common/enums";


export const FrindRequest = new mongoose.Schema(
{
From:
{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User"
},
SentAt:
{
type:Date,
required:true,
default: new Date(Date.now())
}
})


export const SentRequest = new mongoose.Schema(
{
To:
{
  type:mongoose.Schema.Types.ObjectId,
  required:true,
  ref:"User"
},
SentAt:
{
type:Date,
required:true,
default: new Date(Date.now())
},
ReqestStatus:
{
    type:String,
    enum:RequestStatuses,
    default:RequestStatuses.Pending
}
})