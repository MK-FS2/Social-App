import { UserModel } from './UserModel';
import { Abstractrepo } from "../../AbstractRepo";
import { IUser } from '../../../Utils/Common/Interfaces';
import mongoose from 'mongoose';
import { AppError } from '../../../Utils/Error';



export class UserRepo extends Abstractrepo<IUser>
{
constructor()
{
    super(UserModel)
}

async GetUserProfile_Public(id:mongoose.Types.ObjectId)
{
    this.IsExist({_id:id}, { password: 0, updatedAt: 0, __v: 0})
}

async SocketConnect(UserID: mongoose.Types.ObjectId, SocketID: string): Promise<boolean> {
  try {
    const UserStatus = await UserModel.findById(UserID, { OnlineStatus: 1 });
    if (!UserStatus) throw AppError.ServerError();

    if (UserStatus.OnlineStatus?.Status == true) 
    {
      await UserModel.findOneAndUpdate({ _id: UserID },{ $set: { "OnlineStatus.WebID": SocketID }});
    } else 
    {
      await UserModel.findOneAndUpdate({ _id: UserID },{ $set: { "OnlineStatus.WebID": SocketID, "OnlineStatus.Status": true } }
      );
    }
    return true;
  } catch (err) {
    console.log(`WepID allocation error ${err}`);
    return false;
  }
}

async SocketDisconnect(UserID:mongoose.Types.ObjectId):Promise<boolean>
{
try
{
const User = await UserModel.findById(UserID,{OnlineStatus:1})
if(!User)
{
    throw AppError.ServerError()
}

if(User.OnlineStatus?.Status == true)
{
 await UserModel.findOneAndUpdate({_id:UserID},{$set:{"OnlineStatus.Status":false},$unset:{"OnlineStatus.WebID":""}})
}
return true
}
catch(err)
{
console.log(`Disconnect Error ${err}`)
return false
}
}

}