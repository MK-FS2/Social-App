import {  Request, Response } from 'express';
import { UserRepo } from '../../DB/Models/User/UserRepo';
import { AppError } from '../../Utils/Error';
import { UserFactory } from './User.Factory';
import mongoose from 'mongoose';

export class Userservices 
{
private readonly userRepo = new UserRepo()
private readonly userFactory = new UserFactory()
async SendFrindRequest(req: Request,res: Response)
{
const {To} = req.params
const User = req.User

if(User._id.equals(To))
{
  throw new AppError("You cannot send a request to yourself",400)
}

const UserExist = await this.userRepo.FindOneDocument({ _id: To },{ Email: 1, Fullname: 1, BlockedList: 1, FrindList: 1, PendingFrindingRequests: 1 });
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
}
