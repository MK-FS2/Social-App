import mongoose from "mongoose";

export class CommentEntity 
{
  PostID!: mongoose.Types.ObjectId;            
  UserID!: mongoose.Types.ObjectId;              
  CommentContent!: string;                                         
}