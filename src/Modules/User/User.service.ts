import { TokenRepo } from './../../DB/Models/Tokens/TokenRepo';
import { ConversationRepo } from './../../DB/Models/Conversation/Conversation.Repo';
import {  Request, Response } from 'express';
import { UserRepo } from '../../DB/Models/User/UserRepo';
import { AppError } from '../../Utils/Error';
import { UserFactory } from './User.Factory';
import mongoose from 'mongoose';
import { RequestStatuses } from '../../Utils/Common/enums';
import { ReplaceFile } from '../../Utils/cloud/CloudServcies';
import { UpdateUserEntity } from './User.Entities';

export class Userservices 
{
private readonly userRepo = new UserRepo()
private readonly userFactory = new UserFactory()
private readonly conversationRepo = new ConversationRepo()
private readonly tokenRepo = new TokenRepo()

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


async BlockingUser(req:Request,res:Response)
{
const User = req.User
const {BadUserID} = req.params
const UserExist = await this.userRepo.IsExist({_id:BadUserID})


if(User._id.equals(BadUserID))
{
 throw AppError.Unauthorized("You cant block your self")
}


const CurentUser = await this.userRepo.FindOneDocument({_id:User._id},{BlockedList:1,FrindList:1})


if(!CurentUser)
{
  // that will never happen any ways 
  throw AppError.ServerError()
}
 
if(CurentUser.BlockedList?.some(id => id.equals(BadUserID)))
{
  throw new AppError("User is already blocked",400)
}


if(CurentUser.FrindList?.some(id => id.equals(BadUserID)))
{
  throw new AppError("You cannot block a friend",400)
}

if(!UserExist)
{
  throw AppError.NotFound("No User Found")
}

const BlokedUserID = new mongoose.Types.ObjectId(BadUserID)
const BlokingResult = await this.userRepo.updateDocument({_id:User._id},{$addToSet:{BlockedList:BlokedUserID}})

if(!BlokingResult)
{
  throw AppError.ServerError()
}
// flag 
const OldConversations = await this.conversationRepo.deleteDocument({$or:[{CreatorID:User._id,ReceiverID:BlokedUserID},{CreatorID:BlokedUserID,ReceiverID:User._id}]})

res.json({message:"User Bloked"})
}

async UnFrind(req:Request,res:Response)
{
const {BadUserID} = req.params
const User = req.User

if(User._id.equals(BadUserID))
{
  throw new AppError("Unauthourised operation",401)
}
const UserExist = await this.userRepo.FindOneDocument({_id:BadUserID},{FrindList:1})
const CurrentUser = await this.userRepo.FindOneDocument({_id:User._id},{FrindList:1})

if(!CurrentUser)
{
  throw AppError.ServerError()
}

if(!UserExist)
{
throw AppError.NotFound("No User Found")
}

if(!UserExist.FrindList?.some((Frind)=>(Frind.equals(User._id))) && !CurrentUser.FrindList?.some((frind)=>(frind.equals(BadUserID))))
{
 throw new AppError("You and the user are not frinds",400)
}
const BadID = new mongoose.Types.ObjectId(BadUserID)
const UnfrindResult1 = await this.userRepo.updateDocument({_id:BadID},{$pull:{FrindList:User._id}})
const UnfrindResult2 = await this.userRepo.updateDocument({_id:User._id},{$pull:{FrindList:BadID}})
if(!UnfrindResult1 && !UnfrindResult2)
{
  throw AppError.ServerError()
}
res.json({message:"Unfrinded"})
}

async UnBlock(req:Request,res:Response)
{
  const User = req.User
  const {BadUserID} = req.params

  if(User._id.equals(BadUserID))
  {
    throw AppError.Unauthorized("Invalid operation")
  }

  const CurrentUser = await this.userRepo.FindOneDocument({_id:User._id},{BlockedList:1})
  const UserExist = await this.userRepo.FindOneDocument({_id:BadUserID},{BlockedList:1})

  if(!UserExist)
  {
    throw AppError.NotFound("No User Found")
  }

  if(!CurrentUser)
  {
    throw AppError.ServerError()
  }

  if(!CurrentUser.BlockedList?.some((Blocked)=>Blocked.equals(BadUserID)))
  {
    throw new AppError("User is not Blocked",401)
  }

  const UnBlockingResult = await this.userRepo.updateDocument({_id:User._id},{$pull:{BlockedList:BadUserID}})
  if(!UnBlockingResult)
  {
    throw AppError.ServerError()
  }

  res.json({message:"User Unblocked"})
}

async GetPendingRequests(req: Request, res: Response) 
{
  const User = req.User;
  const List = await this.userRepo.FindOneDocument({ _id: User._id },{ PendingFrindingRequests: 1 },
  {
    populate: 
    {
      path: "PendingFrindingRequests.From",
      select: "Fullname Email ProfilePicture.URL"
    }
  }
);
  if (!List) 
  {
    return res.json({ Data: [] });
  }
  const Cleaned = List.PendingFrindingRequests;
  res.json({ Data: Cleaned });
}

async GetSentRequests(req:Request,res:Response)
{
  const User = req.User
  const List = await this.userRepo.FindOneDocument({ _id: User._id },{ SentRequests: 1 },
  {
    populate: 
    {
      path: "SentRequests.To",
      select: "Fullname Email ProfilePicture.URL"
    }
  }
 );
  if(!List)
  {
    res.json({Data:[]})
  }
  else 
  {
    const Cleaned  = List.SentRequests
   res.json({Data:Cleaned})
  }
}

async RemoveAnsweredRequest(req: Request, res: Response)
{
  const User = req.User
  const { RequestID } = req.params

  const ListExist = await this.userRepo.FindOneDocument(
  { _id: User._id, "SentRequests._id": RequestID },
  { SentRequests: 1 }
  )

  if(!ListExist)
  {
    throw AppError.Unauthorized("Invalid ID")
  }

  const Target = ListExist.SentRequests?.find((r:any)=>r._id.equals(RequestID))

  if(!Target)
  {
    throw AppError.NotFound("Request not found")
  }

  if(Target.ReqestStatus == 0)
  {
    throw new AppError("Request isn't answered yet",401)
  }

  const Remove = await this.userRepo.updateDocument(
  { _id: User._id },
  { $pull: { SentRequests: { _id: new mongoose.Types.ObjectId(RequestID) } } }
  )

  if(!Remove)
  {
    throw AppError.ServerError()
  }
  else
  {
    res.json({ message: "Request Removed" })
  }
}

async GetAllFrinds(req: Request, res:Response)
{
  const User = req.User

  const List = await this.userRepo.FindOneDocument({ _id: User._id }, { FrindList: 1, }, { populate: { path: "FrindList", select: "Fullname Email ProfilePicture.URL" } });

   if(!List || !List.FrindList || List.FrindList.length == 0)
   {
    res.json({Data:[]})
   }
   else 
   {

    res.json({Data:List.FrindList})
   }
}

async GetProfilePublic(req: Request, res:Response)
{
  const CurrentUser = req.User
  const {UserID} = req.params

  const UserExist = await this.userRepo.FindOneDocument({_id:UserID},{BlockedList:1,Fullname:1,Email:1,"ProfilePicture.URL":1})
  if(!UserExist)
  {
    throw AppError.NotFound("User Dont exist")
  }
  if(UserExist.BlockedList?.includes(CurrentUser._id))
  {
    throw AppError.Unauthorized("You are Blocked")
  }

 const userData = UserExist.toObject();
 delete userData.BlockedList;
  res.json({Data:userData})
}

async GetProfilePrivate(req:Request,res:Response)
{
  const User = req.User

  const UserExist = await this.userRepo.FindOneDocument({_id:User._id},{Fullname:1,Email:1,Phone:1,ProfilePicture:1})
   
  if(!UserExist)
  {
    throw AppError.ServerError()
  }
 res.json({Data:UserExist})
}

async UpdateProfileImage(req:Request,res:Response)
{
  const User = req.User
  const {ID} = req.body
  const File = req.file
  const UserExist = await this.userRepo.FindOneDocument({_id:User._id},{ProfilePicture:1})
   
   if(!File)
   {
      throw new AppError("Image requried is requried",400)
   }

  if(!UserExist)
  {
    throw AppError.ServerError()
  }

  if(!ID)
  {
    throw new AppError("ID is requried",400)
  }
  if (UserExist.ProfilePicture.ID !== ID) 
  {
  throw new AppError(`Invalid ID`, 400);
  }
 
  const ReplacingResult  = await ReplaceFile(ID,File.path,`social/users/${User._id}/photos/profilepicture`)
  if(!ReplacingResult)
  {
    throw AppError.ServerError()
  }

 const Update = await this.userRepo.updateDocument({_id:User._id},{$set:{ProfilePicture:ReplacingResult }})
 if(!Update)
 {
  throw AppError.ServerError()
 }

 res.json({message:"Updated succsessfully"})
}

async UpdateUser(req:Request,res:Response)
{
  //  expire token and encrypt
  const User = req.User
  const Body:UpdateUserEntity = req.body
   let { authorization } = req.headers;
   if (!authorization || !authorization.startsWith("Bearer")) 
   {
    throw AppError.InvalidInput("Authorization header must start with 'Bearer <token>'");
   }
   const Raw_Token = authorization.split(" ")[1];
   const refreshToken = req.headers["refresh-token"]



  const NewUser = this.userFactory.UpdateUser(User.Fullname,Body)
  const UpdateResult =  await this.userRepo.updateDocument({_id:User._id},{$set:NewUser})
  if(!UpdateResult)
  {
    throw AppError.ServerError()
  }
  const Blacklistaccestoken = await this.tokenRepo.BlackListToken(Raw_Token as string,refreshToken as string,User._id)
  if(!Blacklistaccestoken)
  {
    throw AppError.ServerError()
  }
  res.json({message:"Updated"})
}
}
