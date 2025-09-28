import { PostRepo } from './../../DB/Models/Posts/Post.Repo';
import {  Request, Response } from 'express';
import { CreatePostDTO } from './Post.DTO';
import { PostFactory } from './Post.factory';
import { UploadMany } from '../../Utils/cloud/CloudServcies';
import { IFile } from '../../Utils/Common/Interfaces';
import { fileformat } from '../../Utils/Common/types';
import { AppError } from '../../Utils/Error';
import { Reactions } from '../../Utils/Common/enums';
import { ToggleReaction } from '../../Providers/Reactions/Reaction.provider';


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

    if(files)
    {
    const Files_Paths = files.map((file: IFile) =>
    {
     return file.path;
     });
     UplodResult = await UploadMany(Files_Paths,`social/users/photos/posts`)
     if(!UplodResult)
     {
        throw new  AppError ("Error uploading photos",500)
     }
    }
    const PostObject = this.PostFactory.CreatePost(creatPostDTO,User._id,UplodResult)
    const CreateResult = await this.postRepo.createDocument(PostObject)
    if(!CreateResult)
    {
        throw  AppError.ServerError()
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

}


export default PostServices 