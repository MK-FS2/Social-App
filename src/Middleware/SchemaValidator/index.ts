import { ZodType} from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../Utils/Error";

export const SchemaValidator=(Schema:ZodType) => 
    {
     return (req: Request, res: Response, next: NextFunction) => 
     {
        try 
        {
        const body = { ...req.body,...req.params,...req.query };
        const result = Schema.safeParse(body);
        if (!result.success) 
        {
         const ErrorsArray = result.error.issues.map(problem => ({
         path: problem.path[0],
         message: problem.message
         }));
        throw new AppError(JSON.stringify(ErrorsArray), 400);
        } 
        next();
        }
        catch(err)
        {
        next(err)
        }
  };
};
