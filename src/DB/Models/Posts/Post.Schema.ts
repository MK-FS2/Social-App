import mongoose from "mongoose";
import { IPost } from "../../../Utils/Common/Interfaces";

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
    Attachments: [
      {
        public_id: { type: String, required: true },
        secure_url: { type: String, required: true },
      },
    ],
  },
  { timestamps: true,toJSON:{virtuals:true},toObject:{virtuals:true}}
);

export default PostSchema
