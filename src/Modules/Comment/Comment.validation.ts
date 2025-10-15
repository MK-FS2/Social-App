import { z ,ZodType } from "zod";
import { CreateCommentDTO} from "./Comment.DTO";

const ObjectIDRej=/^[0-9a-fA-F]{24}$/

export const createCommentValidation:ZodType<CreateCommentDTO> = z.object({
CommentContent:z.string().min(3,"minimum 3 characters").max(200,"maximum of 200 characters"),
PostID:z.string().regex(ObjectIDRej, "Invalid ObjectId")
})

export const GetComments = z.object({
  PostID: z.string().regex(ObjectIDRej, "Invalid PostId"),
  limit: z.string().regex(/^\d+$/, "Limit must be a number").transform(Number).refine((val) => val >= 5 && val <= 20, {message: "Limit must be between 5 and 20",}),
});


export const DeleteComment = z.object({
  PostID: z.string().regex(ObjectIDRej, "Invalid PostId"),
  CommentID: z.string().regex(ObjectIDRej, "Invalid Comment id"),
});


export const EditCommentValidation = z.object({
   PostID: z.string().regex(ObjectIDRej, "Invalid PostId"),
   CommentID: z.string().regex(ObjectIDRej, "Invalid Comment id"),
   CommentContent:z.string().min(3,"minimum 3 characters").max(200,"maximum of 200 characters")
})