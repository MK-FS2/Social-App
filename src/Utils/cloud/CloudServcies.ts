import { fileformat } from './../Common/types';
import cloudinary from "./CloudConfig";

function mapCloudinaryToFileFormat(result: any): fileformat 
{
  return {
    ID: result.public_id,
    URL: result.secure_url,
  };
}

export async function UploadOne(file: string, specifiedFolder: string): Promise<fileformat | null> {
  try 
  {
    const uploaded = await cloudinary.uploader.upload(file, { folder: specifiedFolder });
    return mapCloudinaryToFileFormat(uploaded);
  } 
  catch (err) 
  {
    console.error("Cloudinary upload failed:", err);
    return null;
  }
}

export async function UploadMany(files: string[], specifiedFolder: string): Promise<fileformat[] | null> {
  try 
  {
    const uploaded: fileformat[] = [];
    for (const file of files) 
    {
      const currentFile = await cloudinary.uploader.upload(file, { folder: specifiedFolder });
      uploaded.push(mapCloudinaryToFileFormat(currentFile));
    }
    return uploaded;
  } 
  catch (err) 
  {
    console.error("Cloudinary multi-upload failed:", err);
    return null;
  }
}

export async function DeleteOne(public_id: string): Promise<boolean> {
  try 
  {
    await cloudinary.uploader.destroy(public_id);
    return true;
  } 
  catch (err) 
  {
    console.error("Cloudinary delete failed:", err);
    return false;
  }
}

export async function DeleteFolder(folder: string): Promise<boolean> {
  try
 {
    await cloudinary.api.delete_resources_by_prefix(folder, { resource_type: "image" });
    return true;
  } 
  catch (err) 
  {
    console.error("Cloudinary folder delete failed:", err);
    return false;
  }
}

export async function ReplaceFile(public_id: string, newFile: string, specifiedFolder: string): Promise<fileformat | null> {
  try 
  {
    const uploadedNewFile = await cloudinary.uploader.upload(newFile, { folder: specifiedFolder });
    await cloudinary.uploader.destroy(public_id);
    return mapCloudinaryToFileFormat(uploadedNewFile);
  } 
  catch (err)
   {
    console.error("Cloudinary replace failed:", err);
    return null;
   }
}
