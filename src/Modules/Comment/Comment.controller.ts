import { Router } from "express"
import { Authenticate } from "../../Middleware/Authentecation"
import { SchemaValidator } from "../../Middleware/SchemaValidator"
import { ErrorCatcher } from "../../Middleware/ErrorCacher"
import commentServicesices from "./Comment.Services"
import { createCommentValidation, GetComments } from "./Comment.validation"


const CommentRoute = Router({mergeParams: true })
const commentServices = new commentServicesices()
CommentRoute.post("/AddComment/:PostID",Authenticate,SchemaValidator(createCommentValidation),ErrorCatcher(commentServices.CreateComment.bind(commentServices)))
CommentRoute.post("/ToggleReactioncomment/:PostID/:commentID",Authenticate,ErrorCatcher(commentServices.ToggleReactionc.bind(commentServices)))
CommentRoute.post("/ReplyTocomment/:PostID/:CommentID",Authenticate,SchemaValidator(createCommentValidation),ErrorCatcher(commentServices.ReplyComment.bind(commentServices)))
CommentRoute.get("/GetPostComments/:PostId/:limit",Authenticate,SchemaValidator(GetComments),ErrorCatcher(commentServices.GetPostComments.bind(commentServices)))
export default CommentRoute