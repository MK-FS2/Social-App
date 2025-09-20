import { NextFunction ,Request,Response,RequestHandler} from "express"


export const ErrorCatcher = (Service:RequestHandler)=>
    {
    return async (req:Request,res:Response,next:NextFunction)=>
    {
     try 
     {
      await Service(req,res,next)
     }
     catch(err)
     {
      next(err)
     }
    }
}