import mongoose, { HydratedDocument } from "mongoose";
import { IPost } from "../../../Utils/Common/Interfaces";
import ReactionSchema from "../Common/Reaction/Reaction.Schema";
import FileSchema from "../Common/File/File.Schema";
import CommentModel from "../Comments/comments.Model";

const PostSchema = new mongoose.Schema<IPost>(
  {
    Content: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 200,
    },
    CreatorID: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    Header: { type: String, required: true },
    Attachments: [FileSchema],
    Reactions: [ReactionSchema],
    freez:
    {
      type:Boolean,
      default:false
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);


PostSchema.post("find", function (docs: HydratedDocument<IPost>[], next) {
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


PostSchema.post("findOne", function (doc: HydratedDocument<IPost>, next) {
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


PostSchema.pre("deleteOne",async function(next)
{
  const PostID = this.getFilter()
  console.log(PostID)
 await CommentModel.deleteMany({PostID:PostID._id})
})

export default PostSchema;
