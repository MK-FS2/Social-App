import mongoose from "mongoose";
import ReactionSchema from "../Common/Reaction/Reaction.Schema";
import { ReplySchema } from "../Common/Comments/Replay";
import { IComment } from "../../../Utils/Common/Interfaces";



export const CommentSchema = new mongoose.Schema<IComment>({
PostID:
{
type:mongoose.Schema.Types.ObjectId,
required:true,
ref:"Post"
},
UserID:
{
type:mongoose.Schema.Types.ObjectId,
required:true,
ref:"User" 
},
CommentContent:
{
 type:String,
 required:true
},
Replays:
{
type:[ReplySchema],
required:false
},
Reactions:[ReactionSchema]
},{timestamps:true})


export default CommentSchema