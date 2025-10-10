import mongoose from "mongoose";
import { z ,ZodType } from "zod";


export const SendFrindRequestValidation = z.object({
  To: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  }),
});