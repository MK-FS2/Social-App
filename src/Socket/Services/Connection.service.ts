import { UserRepo } from '../../DB/Models/User/UserRepo';
import mongoose, { HydratedDocument } from "mongoose";
import { Socket } from "socket.io";
import { AppError } from '../../Utils/Error';
import { IUser } from '../../Utils/Common/Interfaces';

export class SocketConnection
{

 private readonly userRepo = new UserRepo()

 async ConnectUser(socket:Socket)
 {
    try 
    {
     socket.on("UserOnline",async()=>
     {
     const UserID:HydratedDocument<IUser> = socket.data.User
     await this.userRepo.SocketConnect(UserID._id,socket.id)
      })
    }
    catch(err)
    {
        console.log(` Coonncet issue${err}`)
    }
 }

 async DisconnectUser(UserID:mongoose.Types.ObjectId)
 {
    try 
    {
    const Result = await this.userRepo.SocketDisconnect(UserID._id)
    if(!Result)
    {
        throw new AppError("Server Error disconect",500)
    }
    }
    catch(err)
    {
        console.log(`Discconnect issue ${err}`)
    }
  
 }

}
