import mongoose from "mongoose";
import { CreatePostDTO, EditPostDTO } from "./Post.DTO";
import {CreatePostEntity, EditPostEntity} from "./Post.entity";
import { fileformat } from "../../Utils/Common/types";



export  class PostFactory 
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
  
   EditPost(Data:EditPostDTO,Attachments:fileformat[])
   {
    const Post = new EditPostEntity()
    if(Data.Content)
    {
      Post.Content=Data.Content
    }
    if(Data.Header)
    {
      Post.Header=Data.Header
    }
    Post.Attachments = Attachments
    return Post
   }

}