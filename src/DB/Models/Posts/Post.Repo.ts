import mongoose, { HydratedDocument } from "mongoose";
import { IPost } from "../../../Utils/Common/Interfaces";
import { Abstractrepo } from "../../AbstractRepo";
import PostModel from "./Post.Model";
import { AppError } from "../../../Utils/Error";


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
        return [] 
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

   async DeletePost(UserID:mongoose.Types.ObjectId,PostID:mongoose.Types.ObjectId):Promise<boolean>
   {
     const PostExist = await PostModel.findById(PostID)
     if(!PostExist)
     {
        throw AppError.NotFound("No post found")
     }
     if(!PostExist.CreatorID.equals(UserID))
     {
     throw AppError.Unauthorized("You are not the Owner of the post")
     }
     const DeleteResult = await PostModel.deleteOne({_id:PostID})
     if(DeleteResult.deletedCount > 0)
     {
        return true
     }
     else 
     {
        return false
     }
   }
   
}