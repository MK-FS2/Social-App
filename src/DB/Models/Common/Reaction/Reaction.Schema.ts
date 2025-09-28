import mongoose from "mongoose";
import { IReaction } from "../../../../Utils/Common/Interfaces";
import { Reactions } from "../../../../Utils/Common/enums";


const ReactionSchema = new mongoose.Schema<IReaction>({
  UserID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  Reaction: {
    type: Number,          
    enum: Reactions, 
    required: true
  }
}, { timestamps: true });

export default ReactionSchema