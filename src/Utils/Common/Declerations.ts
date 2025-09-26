import { Request } from 'express';
import { HydratedDocument } from "mongoose";
import { IUser } from "./Interfaces";


declare module "express-serve-static-core" 
{
  interface Request 
  {
    User: HydratedDocument<IUser>;
  }
}