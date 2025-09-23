import mongoose from "mongoose";
import PostSchema from "./Post.Schema";
import { IPost } from "../../../Utils/Common/Interfaces";


const PostModel = mongoose.model<IPost>("Post",PostSchema)

 
export default PostModel