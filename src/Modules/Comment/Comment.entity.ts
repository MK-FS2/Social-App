import mongoose from "mongoose";

export class CommentEntity 
{
  PostID!: mongoose.Types.ObjectId;            
  UserID!: mongoose.Types.ObjectId;              
  CommentContent!: string;                                     
}
export class ReplyEntity 
{
  PostID!: mongoose.Types.ObjectId;            
  UserID!: mongoose.Types.ObjectId;              
  CommentContent!: string; 
  ParentID!:mongoose.Types.ObjectId                                  
}