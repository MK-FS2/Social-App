import JWT, { SignOptions ,JwtPayload} from "jsonwebtoken";
import { TPayload } from "../Common/types";

export function SignToken(Payload:JwtPayload&TPayload,ExpireTime: SignOptions["expiresIn"] = "7d"): string | null 
{
  try {
    const secret = process.env.secretkey;
    if (!secret) {
      throw new Error("Missing JWT secret key");
    }
    const Token = JWT.sign(Payload, secret, { expiresIn: ExpireTime });
    return Token;
  } 
  catch (err) 
  {
    return null;
  }
}



export function VerifyToken(Token:string): TPayload&JwtPayload | null
{
try 
{
    const secret = process.env.secretkey;
    if (!secret) {
      throw new Error("Missing JWT secret key");
    }
    const Verifiyed = JWT.verify(Token,secret) as TPayload;
    return Verifiyed 
    
}
catch(err)
{
  console.log(err)
    return null
}
}


