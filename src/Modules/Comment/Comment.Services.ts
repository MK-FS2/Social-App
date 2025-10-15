import {  Request, Response } from 'express';
import CommentRepo from "../../DB/Models/Comments/Comments.Repo"
import { CreateCommentDTO } from "./Comment.DTO"
import { CommentFactory } from "./Comment.factory"
import { PostRepo } from '../../DB/Models/Posts/Post.Repo';
import { AppError } from '../../Utils/Error';
import mongoose from 'mongoose';
import { ToggleReaction } from '../../Providers/Reactions/Reaction.provider';

class commentServicesices 
{
private readonly commentRepo = new CommentRepo()
private readonly commentFactory = new CommentFactory()
private readonly postRepo = new PostRepo()

async CreateComment(req:Request,res:Response)
{
    const createCommentDTO:CreateCommentDTO = req.body
    const User = req.User
    const {PostID} = req.params 
    const PostExist = await this.postRepo.FindOneDocument({_id:PostID})
    if(!PostExist)
    {
     throw AppError.NotFound("No post found")
    }
    if(PostExist.freez == true)
    {
      throw AppError.Unauthorized("The post is frozeen you cant comment")
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

async ToggleReactionc(req:Request,res:Response)
{
    const User = req.User
    const {PostID,commentID} = req.params
    const {Reaction} = req.body 
    const PostExist = await this.postRepo.FindOneDocument({_id:PostID})
    if(!PostExist)
    {
        throw AppError.NotFound("No post found")
    }
    const commentExist = await this.commentRepo.FindOneDocument({_id:commentID})
    if(!commentExist)
    {
         throw AppError.NotFound(" No comment found")
    }

    const Result = await ToggleReaction({UserID: User._id,ItemID: commentExist._id,TheReaction:Reaction,Repo: this.commentRepo,});
   return res.status(200).json({message: `Reaction ${Result} successfully`,status:"Succsess",});
}


async ReplyComment(req:Request,res:Response)
{
    let {PostID,CommentID} = req.params
    let User = req.User
    let Data:CreateCommentDTO = req.body

     
    const PostExist = await this.postRepo.IsExist({_id:PostID})
    if(!PostExist)
    {
     throw AppError.NotFound("No post Found")
    }
    console.log(CommentID)
    const commentExist = await this.commentRepo.FindOneDocument({_id:CommentID},{freez:1})
    if(!commentExist)
    {
        throw  AppError.NotFound("No comment Found")
    }

   if(commentExist.freez == true)
   {
     throw  AppError.Unauthorized("The comment is frozeen")
   }

    const Reply = this.commentFactory.createReply(Data,PostID as unknown as mongoose.Types.ObjectId,User._id,CommentID as unknown as mongoose.Types.ObjectId)

    const CraetionOtcome = await this.commentRepo.createDocument(Reply)
    if(!CraetionOtcome)
    {
        throw  AppError.ServerError()
    }

    res.sendStatus(204)
}

async GetPostComments(req:Request,res:Response)
{
    let {PostID,limit} = req.params
    const User = req.User

    const PostExist = await this.postRepo.FindOneDocument({_id:PostID})
    if(!PostExist)
    {
      throw AppError.NotFound("No post Found")
    }


    const Comments = await this.commentRepo.GetComments(User._id,PostID as unknown as mongoose.Types.ObjectId,limit as unknown as number)
    if(Comments.length == 0)
    {
        res.json({Data:[]})
    }
    else 
    {
     res.json({Data:Comments})
    }
}
 
async DeleteComment(req: Request, res: Response) {
  const user = req.User;
  const { PostID, CommentID } = req.params;

    const PostExist = await this.postRepo.FindOneDocument({_id:PostID})
    if(!PostExist)
    {
      throw AppError.NotFound("No post Found")
    }


  const comment = await this.commentRepo.FindOneDocument({ _id: CommentID });
  if (!comment) 
    {
    throw AppError.NotFound("No comment found");
  }

  if (!comment.UserID.equals(user._id)) {
    throw AppError.Unauthorized("Only the creator can delete this comment");
  }


  const isDeleted = await this.commentRepo.deleteDocument({ _id: CommentID, PostID });

  if (!isDeleted) {
    throw new AppError("Error deleting comment",500);
  }

  res.json({ message: "Deleted successfully" });
}

async ToggleFreezComment(req: Request, res: Response)
{
  const User = req.User
  const {PostID,CommentID} = req.params
  let Outcome:string =""

  const PostExist = await this.postRepo.IsExist({_id:PostID})
  
  if(!PostExist)
  {
    throw AppError.NotFound("Post dont exist")
  }
  const CommentExist = await this.commentRepo.FindOneDocument({_id:CommentID,PostID:PostID,UserID:User._id},{freez:1})
  if(!CommentExist)
  {
    throw AppError.Unauthorized("you are not the owner of the comment")
  }


   if(CommentExist.freez == true)
   {
    const UpdateResult = await this.commentRepo.updateDocument({_id:CommentID},{$set:{freez:false}})
    if(!UpdateResult)
    {
      throw AppError.ServerError()
    }
    Outcome = "UnFrozeen"
   }
   else 
   {
     const UpdateResult = await this.commentRepo.updateDocument({_id:CommentID},{$set:{freez:true}})
    if(!UpdateResult)
    {
      throw AppError.ServerError()
    }
    Outcome = "Frozeen"
   }
  res.json({message:`Comment ${Outcome}`})
}

}

export default commentServicesices 