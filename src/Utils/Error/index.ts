type ErrorReturn = {
  message: string;
  statusCode: number;
};

export class AppError {
  constructor(private message: string, private statusCode: number) {}

  // Static helpers
  static NotFound(message: string = "Resource not found"): ErrorReturn {
    return { message, statusCode: 404 };
  }

  static Unauthorized(message: string = "Unauthorized"): ErrorReturn {
    return { message, statusCode: 401 };
  }

  static TooManyRequests(message: string = "Too many requests"): ErrorReturn {
    return { message, statusCode: 403 };
  }
  static ServerError()
  {
    return {message:"Server Error",statusCode: 500 }
  }

  static InvalidInput(message: string = "Invalid input")
  {
    return {message,statusCode: 400 }
  }
}

export interface IError 
{
    message?:string,
    statusCode?:number
}