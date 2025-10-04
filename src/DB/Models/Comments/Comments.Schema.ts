import mongoose, { HydratedDocument } from "mongoose";
import ReactionSchema from "../Common/Reaction/Reaction.Schema";
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
ParentID:
{
type:mongoose.Schema.Types.ObjectId,
required:false,
ref:"Comment"
},
Reactions:[ReactionSchema]
},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}})



CommentSchema.post("find", function (docs: HydratedDocument<IComment>[], next) {
  const userId = this.getOptions().UserID;

  for (const doc of docs) 
    {
    const reactions = doc.Reactions || [];
    const userReaction = reactions.find((r) => r.UserID.equals(userId));

    if (userReaction) 
      {
      (doc as any)._doc.ReactedBefore = 
      {
        reaction: userReaction.Reaction, 
        reactedBefore: true,
      };
    } 
    else 
      {
      (doc as any)._doc.ReactedBefore = 
      {
        reaction: null,
        reactedBefore: false,
      };
    }
  }
  next();
});


CommentSchema.post("findOne", function (doc: HydratedDocument<IComment>, next) {
  if (!doc) return next();

  const userId = this.getOptions().UserID;
  const reactions = doc.Reactions || [];
  const userReaction = reactions.find((r) => r.UserID.equals(userId));

  if (userReaction) 
    {
    (doc as any)._doc.ReactedBefore = 
    {
      reaction: userReaction.Reaction, 
      reactedBefore: true,
    };
   } 
   else 
    {
    (doc as any)._doc.ReactedBefore = 
    {
      reaction: null,
      reactedBefore: false,
    };
  }
  next();
});


CommentSchema.virtual("Replies", 
  {
  ref: "Comment",
  localField: "_id",
  foreignField: "ParentID"
});

export default CommentSchema