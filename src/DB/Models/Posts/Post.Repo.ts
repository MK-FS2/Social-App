import mongoose, { HydratedDocument } from "mongoose";
import { IPost } from "../../../Utils/Common/Interfaces";
import { Abstractrepo } from "../../AbstractRepo";
import PostModel from "./Post.Model";


export class PostRepo extends Abstractrepo<IPost>
{
    constructor()
    {
     super(PostModel)
    }


   async GetPost(UserID:mongoose.Types.ObjectId,limit:number=5,page:number=1):Promise<HydratedDocument<IPost>[]|null>
   {
    const Skip = (page - 1) * limit
    const Document =  await PostModel.find({}).skip(Skip).limit(limit).setOptions({UserID:UserID})
    if(Document.length == 0 )
    {
        return null 
    }
    else 
    {
        return Document 
    }
   }

   async GetSpecificPost(UserID:mongoose.Types.ObjectId,PostID:mongoose.Types.ObjectId):Promise<HydratedDocument<IPost>|null>
   {
    const Getonepost = await PostModel.findOne({_id:PostID}).setOptions({UserID:UserID})
    if(!Getonepost)
    {
        return null
    }
    else 
    {
        return Getonepost
    }
   }
}