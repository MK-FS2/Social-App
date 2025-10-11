import {  Request, Response } from 'express';
import { UserRepo } from '../../DB/Models/User/UserRepo';
import { AppError } from '../../Utils/Error';
import { UserFactory } from './User.Factory';
import mongoose from 'mongoose';
import { RequestStatuses } from '../../Utils/Common/enums';

export class Userservices 
{
private readonly userRepo = new UserRepo()
private readonly userFactory = new UserFactory()


async SendFrindRequest(req: Request,res: Response)
{
let {To} = req.params
const User = req.User

if(User._id.equals(To))
{
  throw new AppError("You cannot send a request to yourself",400)
}
console.log(To)
const UserExist = await this.userRepo.FindOneDocument({ _id:To},{ Email: 1, Fullname: 1, BlockedList: 1, FrindList: 1, PendingFrindingRequests: 1 });
if(!UserExist)
{
    throw AppError.NotFound("User Not found")
}
if(UserExist.BlockedList?.some(id => id.equals(User._id)))
{
  throw new AppError("You are Bloked",403)
}
if(UserExist.FrindList?.some(id => id.equals(User._id)))
{
  throw new AppError("You are alredy a frind",400)
}
if(UserExist.PendingFrindingRequests?.some((sender)=>(sender.From.equals(User._id))))
{
    throw  new AppError("You alredy sent a request",400)
}

const Request = this.userFactory.SendFrindRequest(User._id)
const SendingRequestResult = await this.userRepo.updateDocument({_id:To},{$addToSet:{ PendingFrindingRequests:Request}})
if(!SendingRequestResult)
{
    throw AppError.ServerError()
}
const SentRequest = this.userFactory.SentRequest(To as unknown as mongoose.Types.ObjectId)
const statusUpdateResult = await this.userRepo.updateDocument({_id:User._id},{$addToSet:{SentRequests:SentRequest}})
if(!statusUpdateResult)
{
    throw AppError.ServerError()
}
res.json({message:"Requsest sent"})
}


async AnswerFrindRequest(req: Request,res: Response)
{
  const {RequestID,Flag} = req.params
  const User = req.User


  const ReqID = new mongoose.Types.ObjectId(RequestID)
  const RequestExist = await this.userRepo.FindOneDocument({_id:User._id,"PendingFrindingRequests._id":ReqID},{PendingFrindingRequests:1 ,_id:0})

  if(!RequestExist || !RequestExist.PendingFrindingRequests || RequestExist.PendingFrindingRequests.length === 0)
  {
    throw AppError.NotFound("Request dont exist")
  }

  const PendingRequest = RequestExist.PendingFrindingRequests[0]
  const RequesterID = PendingRequest?.From

  if(!RequesterID)
  {
    throw new AppError("Invalid request data: missing requester ID",400)
  }

  if(Number(Flag) == 0)
  {
    const RejectionResult = await this.userRepo.updateDocument({_id:User._id},{$pull:{PendingFrindingRequests:{_id:ReqID}}})
    if(!RejectionResult)
    {
      throw AppError.ServerError()
    }
    const RequesterExist = await this.userRepo.IsExist({_id:RequesterID})
    if(RequesterExist)
    {
      await this.userRepo.updateDocument({_id:RequesterID,"SentRequests.To":User._id},{$set:{"SentRequests.$.RequestStatus":RequestStatuses.Rejected}})
    }
    else
    {
      console.warn(`Requester with ID ${RequesterID} no longer exists`)
    }
  }
  else if(Number(Flag) == 1)
  {
    const RequesterExist = await this.userRepo.IsExist({_id:RequesterID})
    if(!RequesterExist)
    {
      throw AppError.NotFound("Requester no longer exists")
    }
    await this.userRepo.updateDocument({_id:User._id},{$addToSet:{FrindList:RequesterID}})
    await this.userRepo.updateDocument({_id:User._id},{$pull:{PendingFrindingRequests:{_id:ReqID}}})
    await this.userRepo.updateDocument({_id:RequesterID},{$addToSet:{FrindList:User._id}})
    await this.userRepo.updateDocument({ _id: RequesterID, "SentRequests.To": User._id },{ $set: { "SentRequests.$.ReqestStatus": RequestStatuses.Accepted } });
  }
  else
  {
    throw new AppError("Invalied flag",400)
  }

  res.json({message:"Request Answered"})
}
}
