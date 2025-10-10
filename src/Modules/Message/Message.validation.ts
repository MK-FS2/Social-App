import mongoose from "mongoose";
import { z ,ZodType } from "zod";




export const CreateConversationvalidation = z.object({
  To: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  }),
});


export const AddMessagevalidation = z.object({
  ConversationID: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  }),
  Content:z.string().min(1,"minimum of 1 cahracter").max(200,"maximum of 200 charcter")
});