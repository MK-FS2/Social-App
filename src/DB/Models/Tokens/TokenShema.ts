import {Schema} from "mongoose";
import { IToken } from "../../../Utils/Common/Interfaces";



export const TokenSchema = new Schema<IToken>(
  {
    AccessToken: {
      type: String,
      required: true,
    },
    RefreshToken: {
      type: String,
      required: true,
    },
    TokenOwner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);
