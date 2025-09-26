import { Types } from "mongoose";
import { IToken } from "../../../Utils/Common/Interfaces";
import { AppError } from "../../../Utils/Error";
import { Abstractrepo } from "../../AbstractRepo";
import TokenModel from "./TokensModel";
import { UserModel } from "../User/UserModel";

export class TokenRepo extends Abstractrepo<IToken> {
  constructor() { super(TokenModel); }

  async BlackListToken(AccessToken: string, RefreshToken: string, TokenOwner: string | Types.ObjectId): Promise<boolean> {
    try {
      const user = await UserModel.findById(TokenOwner);
      if (!user) throw AppError.NotFound("User not found");
      await this.createDocument({ AccessToken, RefreshToken, TokenOwner });
      return true;
    } catch { return false; }
  }

  async CheckDeprecatedAccesToken(Token: string, TokenOwner: string | Types.ObjectId): Promise<boolean> {
    try { return !!(await this.IsExist({ AccessToken: Token, TokenOwner })); }
    catch { throw AppError.ServerError(); }
  }

  async CheckDeprecatedRefreshToken(Token: string, TokenOwner: string | Types.ObjectId): Promise<boolean> {
    try { return !!(await this.IsExist({ RefreshToken: Token, TokenOwner })); }
    catch { throw AppError.ServerError(); }
  }
}
