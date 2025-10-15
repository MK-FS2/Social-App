import mongoose from "mongoose";
import { IMessage } from "../../../../Utils/Common/Interfaces";
import FileSchema from "../File/File.Schema";

export const MessageSchema = new mongoose.Schema<IMessage>(
  {
    content:
    {
      type: String,
      required: true, 
      minlength: 1,   
      maxlength: 200, 
    },
    senderID: 
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
    },
    Attachment:FileSchema
  },
  { timestamps: true }
);


