import { z ,ZodType } from "zod";
import { CreateCommentDTO } from "./Comment.DTO";


export const createCommentValidation:ZodType<CreateCommentDTO> = z.object({
CommentContent:z.string().min(3,"minimum 3 characters").max(200,"maximum of 200 characters"),
PostID:z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId")
})
