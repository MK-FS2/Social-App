import mongoose from "mongoose";
import ReactionSchema from "../Reaction/Reaction.Schema";

export const ReplySchema = new mongoose.Schema(
  {
    PostID: 
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Post",
    },
    UserID: 
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    ReplyContent: 
    {
      type: String,
      required: true,
    },
      RepliedTo:
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Comment", 
    },
    CommnetReaction:[ReactionSchema]
  },
  { timestamps: true }
);

export const ReplyModel = mongoose.model("Reply", ReplySchema);
