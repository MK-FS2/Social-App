import mongoose from "mongoose"
import { CreateCommentDTO } from "./Comment.DTO"
import { CommentEntity,ReplyEntity } from "./Comment.entity"



export class CommentFactory 
{
      CreateComment(Data:CreateCommentDTO,PostID:mongoose.Types.ObjectId,UserID:mongoose.Types.ObjectId)
   {
     const comment = new CommentEntity()
     comment.PostID = PostID
     comment.UserID = UserID
     comment.CommentContent = Data.CommentContent
     return comment
   }

   createReply(Data:CreateCommentDTO,PostID:mongoose.Types.ObjectId,UserID:mongoose.Types.ObjectId,ParentID:mongoose.Types.ObjectId)
   {
    const Reply:ReplyEntity  = new ReplyEntity()
    Reply.CommentContent = Data.CommentContent
    Reply.ParentID = ParentID
    Reply.UserID = UserID
    Reply.PostID = PostID
    return Reply
   }
}