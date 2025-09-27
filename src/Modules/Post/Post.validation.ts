import { z ,ZodType } from "zod";
import {CreatePostDTO } from "./Post.DTO";
import { CreateCommentDTO } from "../Comment/Comment.DTO";


export const CreatePostValidation:ZodType<CreatePostDTO> = z.object({
Content:z.string().min(1,"Post cant be empty").max(300,"Post cant exide 300 characters"),
Header:z.string().min(1,"Header is requried").max(50,"Header can be only 50 characters long")
})

export const createCommentValidation:ZodType<CreateCommentDTO> = z.object({
CommentContent:z.string().min(3,"minimum 3 characters").max(200,"maximum of 200 characters"),
PostID:z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId")
})
