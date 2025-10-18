import { Server ,Socket } from "socket.io";
import type { Server as HttpServer } from "http";
import { SocketConnection } from "./Connection.service";
import mongoose from "mongoose";
import { AuthenticateSocket } from "./Middleware";

const socketConnectionServices = new SocketConnection()

export default function InitiateSocket(mainServer: HttpServer) {
  const io = new Server(mainServer, { cors: { origin: "*" } });

    io.use(AuthenticateSocket) 
    io.on("connection", (socket:Socket) => {
    console.log(`🟢 User connected: ${socket.id}`);      
    socketConnectionServices.ConnectUser(socket)
    


    socket.emit("s1", "man i love fried chicken");

   
    socket.on("typing", (data: boolean) => {
      io.emit("typing", data);
    });

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
