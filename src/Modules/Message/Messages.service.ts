import { UserRepo } from '../../DB/Models/User/UserRepo';
import { AppError } from '../../Utils/Error';
import { ConversationRepo } from './../../DB/Models/Conversation/Conversation.Repo';
import {  Request, Response } from 'express';
import { MessageFactory } from './Message.Factory';
import mongoose from 'mongoose';
import { UploadOne } from '../../Utils/cloud/CloudServcies';
import { fileformat } from '../../Utils/Common/types';
import { ConversationMessageEntity } from './Message.Entity';

export class MessageServices 
{
// to add schadular auto delet if the last active was 1 moth ago delet the conversation
// ToAdd bolking feture
constructor(){}
private readonly conversationRepo = new ConversationRepo()
private readonly userRepo = new UserRepo()
private readonly messageFactory = new MessageFactory()

async StartConversation(req: Request, res: Response) {
  const { To } = req.params;
  const User = req.User;


  const userId = new mongoose.Types.ObjectId(User._id);
  const receiverId = new mongoose.Types.ObjectId(To);
  const CurrentUser = await this.userRepo.FindOneDocument({ _id: receiverId },{BlockedList:1});
  const userExist = await this.userRepo.FindOneDocument({ _id: receiverId },{BlockedList:1});
  
  if (!userExist) 
  {
    throw AppError.NotFound("User doesn't exist");
  }

  if(!CurrentUser)
  {
    throw AppError.ServerError()
  }

  if(userExist.BlockedList?.some((baduser)=>(baduser.equals(User._id))))
  {
    throw AppError.Unauthorized("You are Blocked")
  }

  if(CurrentUser.BlockedList?.some((baduser)=>(baduser.equals(receiverId))))
  {
    throw AppError.Unauthorized("You cant start conversation with a blocked User")
  }

  const conversationExist = await this.conversationRepo.FindOneDocument({
    $or: [
      { CreatorID: userId, ReceiverID: receiverId },
      { ReceiverID: userId, CreatorID: receiverId },
    ],
  });

  if (conversationExist) 
    {
    return res.json({ Data: conversationExist._id });
  }

  const conversation = this.messageFactory.CreateConversation(userId, receiverId);
  const newConversation = await this.conversationRepo.createDocument(conversation);

  if (!newConversation) {
    throw AppError.ServerError();
  }

  return res.json({ Data: newConversation._id });
}
async AddMessageToconversation(req: Request, res: Response) {
  const { ConversationID } = req.params;
  const User = req.User;
  const { Content } = req.body;
  const File = req.file;

  let Uploaded: fileformat | null = null;
  let Message: ConversationMessageEntity;

  const ConversationExist = await this.conversationRepo.FindOneDocument({ _id: ConversationID });
  if (!ConversationExist) 
 {
    throw AppError.NotFound("No conversation found");
  }


  if (!User._id.equals(ConversationExist.CreatorID) &&!User._id.equals(ConversationExist.ReceiverID)) 
  {
    throw AppError.Unauthorized("Unauthorized: You are not part of this conversation");
  }


  if (File) 
  {
  Uploaded = await UploadOne(File.path, `social/users/${User._id}/photos/Conversation/${ConversationExist._id}`);
  if (!Uploaded) throw AppError.ServerError();
  Message = this.messageFactory.CraeteConversationMessage(Content, User._id, Uploaded);
  } 
  else 
  {
  Message = this.messageFactory.CraeteConversationMessage(Content, User._id);
  }


 const AddingResult = await this.conversationRepo.updateDocument(
  { _id: ConversationID },
  {
    $push: { dialog: Message },
    $set: { latestActivity: new Date() },
  }
);

if(!AddingResult)
{
    throw AppError.ServerError()
}

  return res.sendStatus(204);
}
}