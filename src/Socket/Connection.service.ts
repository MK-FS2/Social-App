import { UserRepo } from './../DB/Models/User/UserRepo';
import mongoose from "mongoose";
import { Socket } from "socket.io";
import { AppError } from '../Utils/Error';

export class SocketConnection
{
 private readonly userRepo = new UserRepo()

 async ConnectUser(socket:Socket)
 {
 socket.on("UserOnline",async(UserID:mongoose.Types.ObjectId)=>
 {
 await this.userRepo.SocketConnect(UserID,socket.id)
 })
 }

 async DisconnectUser(UserID:mongoose.Types.ObjectId,socket:Socket)
 {
    const Result = await this.userRepo.SocketDisconnect(UserID)
    if(!Result)
    {
        throw new AppError("Server Error disconect",500)
    }
 }

}
