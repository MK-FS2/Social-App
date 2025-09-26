import mongoose, { ObjectId } from "mongoose";
import { CreatePostDTO } from "./Post.DTO";
import { CreatePostEntity } from "./Post.entity";
import { fileformat } from "../../Utils/Common/types";



export  class CreatePostFactory 
{
   CreatePost(Data:CreatePostDTO,CreatorID:mongoose.Types.ObjectId,Attachments:fileformat[])
   {
    const post  = new CreatePostEntity()
    post.Content = Data.Content
    post.CreatorID = CreatorID 
    post.Attachments = Attachments
    post.Header = Data.Header
    return post
   }
}