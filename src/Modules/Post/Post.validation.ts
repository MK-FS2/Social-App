import { z ,ZodType } from "zod";
import {CreatePostDTO, EditPostDTO } from "./Post.DTO";
import mongoose from "mongoose";

const ObjectIDRej=/^[0-9a-fA-F]{24}$/

export const CreatePostValidation:ZodType<CreatePostDTO> = z.object({
Content:z.string().min(1,"Post cant be empty").max(300,"Post cant exide 300 characters"),
Header:z.string().min(1,"Header is requried").max(50,"Header can be only 50 characters long")
})


export const DeletePostValidation = z.object({
  PostID: z.string().regex(ObjectIDRej, "Invalid PostId"),
});


export const EditPostValidation = z.object({
  PostID: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), { message: "Invalid PostID format" }),
  Content: z.string().min(1, "Post cant be empty").max(300, "Post cant exide 300 characters").optional(),
  Header: z.string().min(1, "Header is requried").max(50, "Header can be only 50 characters long").optional()
}).refine(
  (data) => data.Content || data.Header, 
  { message: "At least one field (Content or Header) must be provided" }
);