import mongoose, { ObjectId } from "mongoose"
import { UserTypes } from "./enums"


export type fileformat = 
{
    public_id:string,
    secure_url:string
}


export type TPayload = 
{
  id: string;               
  Email: string;            
  Fullname: string;          
  UserType: UserTypes;       
};
