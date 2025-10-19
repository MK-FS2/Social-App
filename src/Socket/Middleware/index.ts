// src/Socket/Middleware/AuthenticateSocket.ts
import { VerifyToken } from "../../Utils/Token";
import { UserRepo } from "../../DB/Models/User/UserRepo";
import { TokenRepo } from "../../DB/Models/Tokens/TokenRepo";
import { Socket } from "socket.io";

export const AuthenticateSocket = async (socket: Socket, next: (err?: Error) => void) => 
{
  try {
    const token = socket.handshake.auth?.accessToken;
    if (!token) 
    {
      return next(new Error("Authentication token is required"));
    }

    const verifiedToken = VerifyToken(token);
    if (!verifiedToken) 
    {
      return next(new Error("Invalid token"));
    }

    const userRepo = new UserRepo();
    const tokenRepo = new TokenRepo();

    const userExist = await userRepo.FindOneDocument({ _id: verifiedToken.id });
    if (!userExist) 
    {
      return next(new Error("User not found"));
    }

    const isDeprecated = await tokenRepo.CheckDeprecatedAccessToken(token, verifiedToken.id);
    if (isDeprecated) 
    {
      return next(new Error("Expired token"));
    }

    if (new Date(userExist.lastModefication) > new Date(verifiedToken.iat! * 1000)) 
    {
      return next(new Error("Expired token, please login again"));
    }

    socket.data.User = userExist; 
    next(); 
  } catch (err) {
    console.error("Socket authentication error:", err);
    next(new Error("Authentication failed"));
  }
};
