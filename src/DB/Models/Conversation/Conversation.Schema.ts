import mongoose from "mongoose";
import { MessageSchema } from "../Common/Message/MessageSchema.js"; // ✅ add .js if using ES modules
import { IConversation } from "../../../Utils/Common/Interfaces.js";

export const ConversationSchema = new mongoose.Schema<IConversation>(
  {
    CreatorID:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
    ReceiverID: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
    dialog: [MessageSchema], 
    latestActivity: 
    {
      type: Date,
      default: Date.now, 
    },
  },
  { timestamps: true }
);


