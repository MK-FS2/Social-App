import { Router } from "express"
import { Authenticate } from "../../Middleware/Authentecation"
import { SchemaValidator } from "../../Middleware/SchemaValidator"
import { createCommentValidation } from "../Post/Post.validation"
import { ErrorCatcher } from "../../Middleware/ErrorCacher"
import commentServicesices from "./Comment.Services"


const CommentRoute = Router({mergeParams: true })
const commentServices = new commentServicesices()
CommentRoute.post("/AddComment/:PostID",Authenticate,SchemaValidator(createCommentValidation),ErrorCatcher(commentServices.CreateComment.bind(commentServices)))

export default CommentRoute