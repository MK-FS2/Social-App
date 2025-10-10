import express, * as exT from "express";
import { IError } from "./Utils/Error";
import connectDB from "./DB/connection";
import AuthRout from "./Modules/Authentication/Auth.controller";
import PostRout from "./Modules/Post/Post.controller";
import MessageRoute from "./Modules/Message/Messages.controller";

function Bootstrap(app: exT.Application): void 
{
  connectDB()
  app.use(express.json());
  app.use("/Auth", AuthRout);
  app.use("/Post",PostRout)
  app.use("/Conversation",MessageRoute)
  // Error handler
 app.use((err:IError, req: exT.Request, res: exT.Response, next: exT.NextFunction) => {
    const statusCode = err?.statusCode || 500; 
    const message = err?.message || "Something went wrong";
    res.status(statusCode).json({ error: message });
  }
);
}

export default Bootstrap;
