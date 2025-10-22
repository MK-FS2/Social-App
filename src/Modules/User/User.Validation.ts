import mongoose from "mongoose";
import { z } from "zod";
import { UpdateUserEntity } from "./User.Entities";
import { onlyLettersRegex, passwordRegex, phoneRegex } from "../../DB/Models/User/UserRejex";


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


export const UpdateUserValidation = z.object({
    "refresh-token": z.string().nonempty("Refresh token is required"),
    FName: z.string().min(2, "First name must be at least 2 characters long").max(10, "First name can't exceed 10 characters").regex(onlyLettersRegex, "Only letters are allowed").optional(),
    LName: z.string().min(2, "Last name must be at least 2 characters long").max(10, "Last name can't exceed 10 characters").regex(onlyLettersRegex, "Only letters are allowed").optional(),
    Phone: z.string().regex(phoneRegex, "Invalid phone number").optional(),
    Password: z.string().regex(passwordRegex, "Password is too weak").optional(),
  }).refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });
