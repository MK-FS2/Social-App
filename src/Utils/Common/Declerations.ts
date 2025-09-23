import { HydratedDocument } from "mongoose";
import { IUser } from "./Interfaces";


declare module "express-serve-static-core" 
{
  interface Response 
  {
    User: HydratedDocument<IUser>;
  }
}