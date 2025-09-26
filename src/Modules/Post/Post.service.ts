import { NextFunction, Request, Response } from 'express';
import { CreatePostDTO } from './Post.DTO';
import { PostRepo } from '../../DB/Models/Posts/Post.Repo';
import { CreatePostFactory } from './Post.factory';
import { UploadMany } from '../../Utils/cloud/CloudServcies';
import { IFile } from '../../Utils/Common/Interfaces';
import { fileformat } from '../../Utils/Common/types';
import { AppError } from '../../Utils/Error';



class PostServices 
{
constructor(){}
private readonly postRepo = new PostRepo()
private readonly createPostFactory = new CreatePostFactory()
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
    const PostObject = this.createPostFactory.CreatePost(creatPostDTO,User._id,UplodResult)
    const CreateResult = await this.postRepo.createDocument(PostObject)
    res.sendStatus(204)
}

}


export default PostServices