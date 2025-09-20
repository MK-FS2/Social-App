import multer ,{FileFilterCallback}from "multer";
import {Request}from "express"



function FileUpload(size:number,FilType:string[])
{
const storage = multer.diskStorage({})
 const fileFilter = (req:Request,file:Express.Multer.File,cb:FileFilterCallback)=>
 {
  if(!FilType.includes(file.mimetype))
  {
    cb(new Error("Invalid format"))
  }
  else 
  {
    cb(null,true)
  }
 }
 return multer({fileFilter,limits:{fileSize:size},storage});
}


export default FileUpload

