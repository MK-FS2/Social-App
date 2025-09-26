import { z ,ZodType } from "zod";
import { CreatePostDTO } from "./Post.DTO";


export const CreatePostValidation:ZodType<CreatePostDTO> = z.object({
Content:z.string().min(1,"Post cant be empty").max(300,"Post cant exide 300 characters"),
Header:z.string().min(1,"Header is requried").max(50,"Header can be only 50 characters long")
})
