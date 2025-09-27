import {  Request, Response } from 'express';
import CommentRepo from "../../DB/Models/Comments/Comments.Repo"
import { CreateCommentDTO } from "./Comment.DTO"
import { CommentFactory } from "./Comment.factory"
import { PostRepo } from '../../DB/Models/Posts/Post.Repo';
import { AppError } from '../../Utils/Error';
import mongoose from 'mongoose';

class commentServicesices 
{
private readonly commentRepo = new CommentRepo()
private readonly commentFactory = new CommentFactory()
private readonly postRepo = new PostRepo()

async CreateComment(req:Request,res:Response)
{
    const createCommentDTO:CreateCommentDTO = req.body
    const User = req.User
    // add to zod validation later
    const {PostID} = req.params 
    const PostExist = await this.postRepo.FindOneDocument({_id:PostID})
    if(!PostExist)
    {
     throw AppError.NotFound("No post found")
    }

    if(!PostID)
    {
        throw new AppError("clint Error",401)
    }
   const comment = this.commentFactory.CreateComment(createCommentDTO,PostID as unknown as mongoose.Types.ObjectId,User._id )
   const Result = await this.commentRepo.createDocument(comment)
   if(!Result)
   {
    throw  AppError.ServerError()
   }
   res.sendStatus(204)
}
}

export default commentServicesices 