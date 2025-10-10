import mongoose from "mongoose";
import { ConversationEntity, ConversationMessageEntity } from './Message.Entity';
import { fileformat } from "../../Utils/Common/types";




export class MessageFactory
{

CreateConversation(CreatorID:mongoose.Types.ObjectId,ReceiverID:mongoose.Types.ObjectId)
{
const Conversation = new ConversationEntity()
Conversation.CreatorID = CreatorID
Conversation.ReceiverID = ReceiverID
return Conversation
}

CraeteConversationMessage(content:string,senderID:mongoose.Types.ObjectId,Attachment?:fileformat)
{
    const Message = new ConversationMessageEntity()
    Message.senderID = senderID
    Message.content = content
    if(Attachment)
    {
        Message.Attachment = Attachment
    }
    return Message 
}

}