import mongoose, { HydratedDocument } from "mongoose";
import ReactionSchema from "../Common/Reaction/Reaction.Schema";
import { IComment } from "../../../Utils/Common/Interfaces";
import CommentModel from "./comments.Model";



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

CommentSchema.virtual("DirectedTo",{
ref:"User",
localField:"UserID",
foreignField:"_id"
})

CommentSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  const commentId = this._id;
  const replies = await CommentModel.find({ ParentID: commentId });
  for (const reply of replies) 
  {
    await reply.deleteOne();
  }
  next();
});

 CommentSchema.pre("deleteMany", { query: true, document: false }, async function (next) {
  const filter = this.getFilter();
  const comments = await CommentModel.find(filter, { _id: 1 });
  for (const c of comments) 
  {
    await c.deleteOne(); 
  }
  next();
});

export default CommentSchema