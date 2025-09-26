import { Router } from "express";
import { Authenticate } from "../../Middleware/Authentecation";
import FileUpload from "../../Middleware/FileUplode";
import { FileTypes } from "../../Middleware/FileUplode/filetypes";
import { SchemaValidator } from "../../Middleware/SchemaValidator";
import { CreatePostValidation } from "./Post.validation";
import { ErrorCatcher } from "../../Middleware/ErrorCacher";
import PostServices from "./Post.service";

const PostRout =  Router()
const postServices = new PostServices()
PostRout.post("/CreatePost",Authenticate,FileUpload(3*1024*1024,FileTypes.Image).array('Attachments',3),SchemaValidator(CreatePostValidation),ErrorCatcher(postServices.CreatePost.bind(postServices)))


export default PostRout