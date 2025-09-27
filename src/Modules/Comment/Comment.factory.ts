import mongoose from "mongoose"
import { CreateCommentDTO } from "./Comment.DTO"
import { CommentEntity } from "./Comment.entity"



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
}