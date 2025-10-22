import express, * as exT from "express";
import { IError } from "./Utils/Error";
import connectDB from "./DB/connection";
import AuthRout from "./Modules/Authentication/Auth.controller";
import PostRout from "./Modules/Post/Post.controller";
import MessageRoute from "./Modules/Message/Messages.controller";
import UserRout from "./Modules/User/User.controller";
import cors from "cors"


function Bootstrap(app: exT.Application): void 
{
  app.use(cors({origin:"*"}));
  
  app.use(express.json());
  
  connectDB()
  
  app.use("/Auth", AuthRout);
  app.use("/Post",PostRout)
  app.use("/Conversation",MessageRoute)
  app.use("/User",UserRout)
  
  // Error handler
  app.use((err:IError, req: exT.Request, res: exT.Response, next: exT.NextFunction) => {
    const statusCode = err?.statusCode || 500; 
    const message = err?.message || "Something went wrong";
    res.status(statusCode).json({ error: message });
  });
}

export default Bootstrap;