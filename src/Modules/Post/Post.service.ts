import { PostRepo } from './../../DB/Models/Posts/Post.Repo';
import {  Request, Response } from 'express';
import { CreatePostDTO } from './Post.DTO';
import { PostFactory } from './Post.factory';
import { DeleteFolder, UploadMany } from '../../Utils/cloud/CloudServcies';
import { IFile } from '../../Utils/Common/Interfaces';
import { fileformat } from '../../Utils/Common/types';
import { AppError } from '../../Utils/Error';
import { ToggleReaction } from '../../Providers/Reactions/Reaction.provider';
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';


class PostServices 
{
constructor(){}
private readonly postRepo = new PostRepo()
private readonly PostFactory  = new PostFactory()


async CreatePost(req:Request,res:Response)
{
    const files = req.files as Express.Multer.File[];
    const creatPostDTO:CreatePostDTO = req.body
    const User = req.User 
    let UplodResult:fileformat[] | null | [] = []
    
    const PostObject = this.PostFactory.CreatePost(creatPostDTO,User._id,UplodResult)
    const CreateResult = await this.postRepo.createDocument(PostObject)

    if(!CreateResult)
    {
        throw  AppError.ServerError()
    }

     if(files)
    {
    const Files_Paths = files.map((file: IFile) =>
    {
     return file.path;
     });
     UplodResult = await UploadMany(Files_Paths,`social/users/${User._id}/photos/posts/${CreateResult._id}`)
     if(!UplodResult)
     {
      const RolebackPost = await this.postRepo.deleteDocument({_id:CreateResult._id})
      throw new  AppError ("Error uploading photos",500)
     }
     const UpdateRoleback = await this.postRepo.updateDocument({_id:CreateResult._id},{$set:{Attachments:UplodResult}})
      if(!UpdateRoleback)
      {
         const RolebackPost = await this.postRepo.deleteDocument({_id:CreateResult._id})
         throw new  AppError ("Error uploading photos",500)
      }
    }
    res.sendStatus(204)
}

async ToggleReactionp(req:Request,res:Response)
{
    const User = req.User
    const {PostID} = req.params
    const {Reaction} = req.body 
    const PostExist = await this.postRepo.FindOneDocument({_id:PostID})
    if(!PostExist)
    {
        throw AppError.NotFound("No post found")
    }
    const Result = await ToggleReaction({UserID: User._id,ItemID: PostExist._id,TheReaction:Reaction,Repo: this.postRepo,});
   return res.status(200).json({message: `Reaction ${Result} successfully`,status:"Succsess",});
}

async GetPosts(req: Request, res: Response) {
  const User = req.User;
  const { page, limit } = req.query;

  if (!page || !limit) 
 {
    throw AppError.Unauthorized("Invalid input");
  }

  const pageNum = Number(page);
  const limitNum = Number(limit);

  if (isNaN(pageNum) || isNaN(limitNum))
  {
    throw AppError.Unauthorized("Invalid input");
  }
  const posts = await this.postRepo.GetPost(User._id, limitNum, pageNum);
  if (posts?.length == 0) 
  {
   res.status(200).json({Data: [],status: "success",});
  }
  res.status(200).json({Data: posts,status: "success",});
}

 async GetSpecificPost(req: Request, res: Response)
 {
  const {PostID} = req.params
  let User = req.User
  const Post = await this.postRepo.GetSpecificPost(User._id,PostID as unknown as mongoose.Types.ObjectId)

   if(!Post)
   {
    throw AppError.NotFound("No post found")
   }

   res.json({Data:Post ,status: "success"})
 }

 async DeleteApost(req: Request, res: Response)
 {
  const User = req.User
  const {PostID} = req.params

   const PostExist = await this.postRepo.FindOneDocument({_id:PostID})
    if(!PostExist)
    {
      throw AppError.NotFound("Post dont exist")
    }

     const AttachmentsCount = PostExist.Attachments as unknown as fileformat[]

    if(AttachmentsCount.length > 0)
    {
     const Deleteresult = await DeleteFolder(`social/users/${User._id}/photos/posts/${PostExist._id}`)
     console.log(Deleteresult )
     if(!Deleteresult)
     {
      await DeleteFolder(`social/users/${User._id}/photos/posts/${PostExist._id}`)
     }
    }

  const DeleteResult = await this.postRepo.DeletePost(User._id!,PostID as unknown as mongoose.Types.ObjectId)
  if(DeleteResult)
  {
    res.json({message:"Deleted succsessfully"})
  }
  else 
  {
    throw new AppError("Server Error Deleteing post",500)
  }
 }

 async UpdatePost(req: Request, res: Response)
 {
  const User = req.User
  const {PostID} = req.params
  
  const PostExist = await this.postRepo.FindOneDocument({_id:PostID})
  if(!PostExist)
  {
    throw  AppError.NotFound("No post found")
  }
  
  if(!User._id.equals(PostExist.CreatorID))
  {
    throw AppError.Unauthorized("Only the owner can update")
  }



 }

}
export default PostServices 