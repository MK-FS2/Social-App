import { UserTypes } from "./enums"

export type fileformat = 
{
    ID:string,
    URL:string
}


export type TPayload = 
{
  id: string;               
  Email: string;            
  Fullname: string;          
  UserType: UserTypes;       
};

