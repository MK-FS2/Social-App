import mongoose from "mongoose";


const FileSchema = new mongoose.Schema
(
{
 ID:{type:String, required: true},
 URL:{type:String, required: true}
},{timestamps:false ,_id:false})

export default FileSchema