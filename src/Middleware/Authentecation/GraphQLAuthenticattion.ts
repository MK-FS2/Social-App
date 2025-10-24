import { HydratedDocument } from "mongoose";
import { TokenRepo } from "../../DB/Models/Tokens/TokenRepo";
import { UserRepo } from "../../DB/Models/User/UserRepo";
import { AppError } from "../../Utils/Error";
import { VerifyToken } from "../../Utils/Token";
import { IUser } from "../../Utils/Common/Interfaces";
import { Request} from "express";


export async function AuthenticateUser(headers)
{
  try
  {
    const { authorization } = headers;
    if (!authorization || !authorization.startsWith('Bearer '))
    {
      throw AppError.InvalidInput("Authorization header must start with 'Bearer <token>'");
    }

    const rawToken = authorization.split(' ')[1];
    if(!rawToken)
    {
     throw new AppError("No Token revived",400)
    }
    const decodedToken = VerifyToken(rawToken);
    if (!decodedToken)
    {
      throw AppError.Unauthorized('Invalid or expired token');
    }

    const userRepo = new UserRepo();
    const tokenRepo = new TokenRepo();

    const user = await userRepo.FindOneDocument({ _id: decodedToken.id },{Password:0,UserAgent:0,IsVerifiyed:0,lastModefication:0});
    if (!user)
    {
      throw AppError.NotFound('User not found');
    }

    const isDeprecatedAccess = await tokenRepo.CheckDeprecatedAccessToken(rawToken, decodedToken.id);
    if (isDeprecatedAccess)
    {
      throw new AppError('Deprecated access token. Login again.', 401);
    }

    if (new Date(user.lastModefication) > new Date(decodedToken.iat! * 1000))
    {
      throw new AppError('Expired token. Login again.', 401);
    }

    // Refresh token check
    const refreshHeader = headers['refresh-token'];
    if (refreshHeader)
    {
      const refreshToken = refreshHeader as string;
      const isDeprecatedRefresh = await tokenRepo.CheckDeprecatedRefreshToken(refreshToken, decodedToken.id);
      if (isDeprecatedRefresh)
      {
        throw new AppError('Deprecated refresh token. Login again.', 401);
      }

      const verifiedRefreshToken = VerifyToken(refreshToken);
      if (!verifiedRefreshToken)
      {
        throw new AppError('Invalid refresh token. Login again.', 401);
      }

      if (new Date(user.lastModefication) > new Date(verifiedRefreshToken.iat! * 1000))
      {
        throw new AppError('Invalid refresh token. Login again.', 401);
      }
    }
    const User:Partial<HydratedDocument<IUser>> = user
    
    return User;
  }
  catch(err)
  {
    throw err;
  }
}
