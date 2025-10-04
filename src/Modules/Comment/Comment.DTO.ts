import mongoose from "mongoose"

export interface CreateCommentDTO 
{
CommentContent:string
}


export interface GetCommentDTO 
{
PostId:mongoose.Types.ObjectId
limit:number
}