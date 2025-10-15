import { Router } from "express";
import { Authenticate } from "../../Middleware/Authentecation";
import FileUpload from "../../Middleware/FileUplode";
import { FileTypes } from "../../Middleware/FileUplode/filetypes";
import { SchemaValidator } from "../../Middleware/SchemaValidator";
import { CreatePostValidation, DeletePostValidation, EditPostValidation } from "./Post.validation";
import { ErrorCatcher } from "../../Middleware/ErrorCacher";
import Post_Comment_Services from "./Post.service";
import CommentRoute from "../Comment/Comment.controller";
const PostRout =  Router()
const postServices = new Post_Comment_Services()

PostRout.use("/comment",CommentRoute)
PostRout.post("/CreatePost",Authenticate,FileUpload(3*1024*1024,FileTypes.Image).array('Attachments',3),SchemaValidator(CreatePostValidation),ErrorCatcher(postServices.CreatePost.bind(postServices)))
// send 0 to delete 
PostRout.post("/ToggleReaction/:PostID",Authenticate,ErrorCatcher(postServices.ToggleReactionp.bind(postServices)))
PostRout.get("/GetPosts",Authenticate,ErrorCatcher(postServices.GetPosts.bind(postServices)))
PostRout.get("/GetSpecificPost/:PostID",Authenticate,ErrorCatcher(postServices.GetSpecificPost.bind(postServices)))
PostRout.delete("/DeletePost/:PostID",Authenticate,SchemaValidator(DeletePostValidation),ErrorCatcher(postServices.DeleteApost.bind(postServices)))
PostRout.put("/EditePost/:PostID",Authenticate,FileUpload(3*1024*1024,FileTypes.Image).array('Attachments',3),SchemaValidator(EditPostValidation),ErrorCatcher(postServices.EditPost.bind(postServices)))
PostRout.put("/Tooglefrezee/:PostID",Authenticate,SchemaValidator(DeletePostValidation),ErrorCatcher(postServices.ToogleFreezPost.bind(postServices)))
export default PostRout