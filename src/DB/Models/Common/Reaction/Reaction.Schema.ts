import mongoose from "mongoose";
import { IReaction } from "../../../../Utils/Common/Interfaces";
import { Reactions } from "../../../../Utils/Common/enums";


const ReactionSchema = new mongoose.Schema<IReaction>({
UserID:
{
type:mongoose.Types.ObjectId,
required:true,
Reaction:
{
type:String,
enum:Reactions
}
}
},{timestamps:true})

export default ReactionSchema