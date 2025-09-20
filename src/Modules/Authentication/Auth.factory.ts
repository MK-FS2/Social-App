import { userAgent, UserTypes } from "../../Utils/Common/enums";
import { IUser } from "../../Utils/Common/Interfaces";
import { RegisterDTO } from "./AuthDTO";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt"

export class AuthFactory 
{
  
  CreateUser(Data: RegisterDTO): IUser 
  {
    return {
      Fullname:`${Data.FName}-${Data.Lname}`,
      Email: Data.Email,
      UserType: UserTypes.User,
      Phone: Data.Phone,
      UserAgent: userAgent.Normal,
      Otp: nanoid(5),
      OtpExpire: new Date(Date.now() + 5 * 60 * 1000), 
      lastModefication: new Date(),
      ProfilePicture: {public_id:"1",secure_url:"1"}, 
      IsVerifiyed: false,
      Password: bcrypt.hashSync(Data.Password,10)
    };
  }
}
