import { UserRepo } from './../../DB/Models/User/UserRepo';
import { Request,Response,NextFunction } from "express";
import { VerifyToken } from "../../Utils/Token";
import { AppError } from '../../Utils/Error';
import { TokenRepo } from '../../DB/Models/Tokens/TokenRepo';

async function Authenticate(req:Request,res:Response,next:NextFunction)
{
    try
    {
    let { authorization } = req.headers;
    if(!authorization || !authorization.startsWith("Bearer "))
    {
        throw AppError.InvalidInput("Authorization header must start with 'Bearer <token>'")
    }

    let Raw_Token = authorization.split(" ")[1] 
    const Token = VerifyToken(Raw_Token as string)
    const userRepo = new UserRepo();
    const tokenrepo = new TokenRepo()

    if(!Token)
    {
        throw AppError.Unauthorized("Invalid or expired token")
    }

    const userExist = await userRepo.IsExist({_id:Token.id})
    if(!userExist)
    {
        throw  AppError.NotFound("User not found")
    }

    const Isdeprecated = await tokenrepo.CheckDeprecatedAccesToken(Raw_Token as string,Token.id)
    if(Isdeprecated)
    {
        throw new AppError("Deprecated token, login again",401)
    }
    if(userExist.lastModefication > new Date(Token.iat! * 1000))
    {
     throw new AppError("Expired Token login again",401)
    }

    if(req.headers["refresh-token"]) 
    {
        const refreshToken = req.headers["refresh-token"] as string
        const refreshDeprecated = await tokenrepo.CheckDeprecatedRefreshToken(refreshToken,Token.id)
        if(refreshDeprecated)
        {
            throw new AppError("Deprecated refresh token, login again",401)
        }
        const VerifiyedRefreshToken = VerifyToken(Raw_Token as string)
        if(!VerifiyedRefreshToken)
        {
            throw new AppError("Invalid refresh token login again",401)
        }
        if(userExist.lastModefication > new Date(VerifiyedRefreshToken.iat!*1000))
        {
          throw new AppError("Invalid refresh token login again",401)
        }
    }

    (req as any).User = userExist;
    next()
    }
    catch(err)
    {
        next(err)
    }
}
