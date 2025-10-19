import mongoose from 'mongoose';
import { ConversationRepo } from './../../DB/Models/Conversation/Conversation.Repo';
import { Socket } from "socket.io";



export class ChatServices
{
private readonly conversationRepo = new ConversationRepo()
JoinChatRoom(socket:Socket)
{
   try 
   {
   socket.on("JoinChat", (ConversationID) => {
   socket.join(ConversationID);
   socket.to(ConversationID).emit("UserJoined", socket.id);
   socket.emit("JoinedRoom", ConversationID);
   });
    }
    catch(err)
    {
        console.log(err)
    }
  
}

LeaveChatRoom(socket:Socket)
{
    socket.on("LeaveRoom", (ConversationID) => {
        try 
        {
            socket.leave(ConversationID);
            socket.to(ConversationID).emit("UserLeft", socket.data.User.Fullname);
        }
        catch(err)
        {
            console.log(err);
        }
    });
}

Typing(socket:Socket)
{
    try 
    {
    socket.on("Typing",(ConversationID)=>{
    socket.to(ConversationID).emit("Typing...");
    })
    }
    catch(err)
    {
        console.log(err)
    }
}

SendingMessages(socket:Socket)
{
    socket.on("sendMessage", async (message, ConversationID) => {
        try 
        {
            const messageData = {content: message, senderID: new mongoose.Types.ObjectId(socket.data.User._id)};
            await this.conversationRepo.updateDocument({ _id: ConversationID }, {$push: { dialog: messageData }, $set: { latestActivity: new Date() }});
            socket.nsp.to(ConversationID).emit("message", message);
        }
        catch(err)
        {
            console.log(err);
        }
    });
}
}