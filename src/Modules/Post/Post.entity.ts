import mongoose from 'mongoose';
import { fileformat } from '../../Utils/Common/types';


export class CreatePostEntity
{
 CreatorID!:mongoose.Types.ObjectId
 Content!:string
 Attachments?:fileformat[]
 Header!:string
}


