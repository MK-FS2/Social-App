import { userAgent, UserTypes } from "../../Utils/Common/enums";
import { IUser } from "../../Utils/Common/Interfaces";
import { RegisterDTO } from "./AuthDTO";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt"
import { UserEntity } from "./Auth.Entity";

export class AuthFactory 
{
  
 CreateUser(Data: RegisterDTO): IUser 
  {
    const User = new UserEntity()
    User.Fullname = `${Data.FName}-${Data.Lname}`
    User.Email = Data.Email
    User.UserType = UserTypes.User
    User.Phone = Data.Phone
    User.UserAgent = userAgent.Normal
    User.Otp = nanoid(5)
    User.OtpExpire = new Date(Date.now() + 5 * 60 * 1000)
    User.lastModefication = new Date()
    User.ProfilePicture = { public_id: "1", secure_url: "1" }
    User.IsVerifiyed = false
    User.Password = bcrypt.hashSync(Data.Password, 10)
    return User
  }
}
