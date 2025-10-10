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
required:true
}
},{_id:false})


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
},
ReqestStatus:
{
    type:String,
    enum:RequestStatuses,
    default:RequestStatuses.Pending
}
},{_id:false})