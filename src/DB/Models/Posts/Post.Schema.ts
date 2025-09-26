import mongoose from "mongoose";
import { IPost } from "../../../Utils/Common/Interfaces";
import ReactionSchema from "../Common/Reaction/Reaction.Schema";
import FileSchema from "../Common/File/File.Schema";

const PostSchema = new mongoose.Schema<IPost>(
  {
    Content: 
    {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 200,
    },
    CreatorID: 
    {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    Header:{type:String,required:true},
    Attachments:[FileSchema],
    PostReactions:[ReactionSchema]
  },
  { timestamps: true,toJSON:{virtuals:true},toObject:{virtuals:true}}
);

export default PostSchema
