import { Server ,Socket } from "socket.io";
import type { Server as HttpServer } from "http";
import { SocketConnection } from "./Services/Connection.service";
import mongoose from "mongoose";
import { AuthenticateSocket } from "./Middleware";
import { ChatServices } from "./Services/Chat.service";

const socketConnectionServices = new SocketConnection()
const socketChatServices = new ChatServices()
export default function InitiateSocket(mainServer: HttpServer) {
  const io = new Server(mainServer, { cors: { origin: "*" } });

    io.use(AuthenticateSocket) 
    io.on("connection", (socket:Socket) => {
    console.log(`🟢 User connected: ${socket.id}`);      
    socketConnectionServices.ConnectUser(socket)
    socketChatServices.JoinChatRoom(socket)
    socketChatServices.LeaveChatRoom(socket)
    socketChatServices.Typing(socket)
    socketChatServices.SendingMessages(socket)
   socket.on("ReadyToDisconnect",async()=>
   {
    const UserID = socket.data.User
     socket.on("disconnect",()=>
    {
     console.log(`🔴 User disconnected: ${socket.id}`);
    })
    await socketConnectionServices.DisconnectUser(UserID._id)
   })
    
  });
  return io;
}
