import mongoose from "mongoose";
import { IToken } from "../../../Utils/Common/Interfaces";
import { AppError } from "../../../Utils/Error";
import { Abstractrepo } from "../../AbstractRepo";
import TokenModel from "./TokensModel";
import { UserModel } from "../User/UserModel";



export class TokenRepo extends Abstractrepo<IToken>
{
    constructor()
    {
        super(TokenModel)
    }


    async BlackListToken(AccessToken:string,RefreshToken:string,TokenOwner: mongoose.Types.ObjectId):Promise<boolean>
    {
    try 
    {
     let IsUserExist = await UserModel.findById(TokenOwner)
     if(!IsUserExist)
     {
        throw  AppError.NotFound("User not found ")
     }

     this.createDocument({AccessToken,RefreshToken,TokenOwner})
     return true
    }
    catch(err)
    {
      return false
    }
    }


   async CheckDeprecatedAccesToken(Token:string,TokenOwner: mongoose.Types.ObjectId):Promise<boolean>
    {
     try 
     {
      const result = await this.IsExist({AccessToken:Token,TokenOwner})
      if(result)
      {
        return true
      }
      else 
      {
        return false
      }
     }
     catch(err)
     {
        throw AppError.ServerError()
     }
    }


  async CheckDeprecatedRefreshToken(Token: string,TokenOwner: mongoose.Types.ObjectId): Promise<boolean> 
  {
   try 
   {
    const result = await this.IsExist({ RefreshToken: Token, TokenOwner });
    if(result)
    {
        return true
    }
    else 
    {
        return false
    }
  } 
  catch (err) 
  {
    throw AppError.ServerError();
  }
}

}