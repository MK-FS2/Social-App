import { UserTypes } from "./enums"
import { HydratedDocument } from "mongoose";
import { IUser } from "./Interfaces";

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

