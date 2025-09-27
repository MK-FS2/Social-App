import mongoose from "mongoose";
import CommentSchema from "./Comments.Schema";


const CommentModel =  mongoose.model("Comment",CommentSchema)

export default CommentModel