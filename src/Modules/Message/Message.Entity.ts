import { fileformat } from './../../Utils/Common/types';
import mongoose from "mongoose"
import { IMessage } from "../../Utils/Common/Interfaces"



export class ConversationEntity 
{
  CreatorID!:mongoose.Types.ObjectId
  ReceiverID!:mongoose.Types.ObjectId
}


