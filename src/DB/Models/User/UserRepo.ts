import { UserModel } from './UserModel';
import { Abstractrepo } from "../../AbstractRepo";
import { IUser } from '../../../Utils/Common/Interfaces';
import mongoose from 'mongoose';



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


}