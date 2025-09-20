import mongoose from 'mongoose';
import { fileformat } from './../Common/types';
import cloudinary from "./CloudConfig";

export async function UploadOne(file:string,specifiedFolder:string):Promise<fileformat | null>
{
try 
{
    let Uploded:fileformat
    Uploded = await cloudinary.uploader.upload(file,{folder:specifiedFolder})
    return Uploded
}
catch(err)
{
    console.error("Cloudinary upload failed:", err);
    return null
}
}

export async function UploadMany(files:string[],specifiedFolder:string):Promise<fileformat[] | null >
{
    try
    {
     let Uploaded:fileformat[]=[]

       for(let file of files)
       {
        const currentfile:fileformat = await cloudinary.uploader.upload(file,{folder:specifiedFolder})
        Uploaded.push(currentfile)
       }
      return Uploaded
    }
    catch(err)
    {
     return null
    }
}

export async function DeleteOne(public_id:string):Promise<boolean>
{
    try 
    {
    await cloudinary.uploader.destroy(public_id)
    return true
    }
    catch(err)
    {
        return false
    }
}



export async function DeletFolder(folder:string):Promise<boolean>
{
    try 
    {
    await cloudinary.api.delete_resources_by_prefix(folder,{resource_type:"image"})
    return true
    }
    catch(err)
    {
        return false
    }
   
}


export async function ReplaceFile(public_id:string,NewFile:string,specifiedFolder:string):Promise<fileformat | null>
{
 try 
 {
   let UplodedNewFile:fileformat
   UplodedNewFile = await cloudinary.uploader.upload(NewFile,{folder:specifiedFolder})
   await cloudinary.uploader.destroy(public_id)
   return UplodedNewFile
 }
 catch(err)
 {
    return null
 }
}