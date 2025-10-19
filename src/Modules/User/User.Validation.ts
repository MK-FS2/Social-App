import mongoose from "mongoose";
import { z } from "zod";


export const SendFrindRequestValidation = z.object({
  To: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  }),
});


export const AnswerRequest = z.object({
  RequestID: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  }),
  Flag: z.string().refine((val) => ["0", "1"].includes(val), {message: "Flag must be either '0' (reject) or '1' (accept)",})
});


export const BlockUserValidation = z.object({
  BadUserID: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  }),
});

export const RemoveSentListValidation = z.object({
 RequestID: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  }),
});



export const SpecficConversationValidation = z.object({
  ConversationID : z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  }),
});


export const GETprofilePublicValidation = z.object({
    UserID : z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  }),
});

