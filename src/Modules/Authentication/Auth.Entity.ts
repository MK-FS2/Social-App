import { userAgent, UserTypes } from "../../Utils/Common/enums"
import { fileformat } from "../../Utils/Common/types"

export class UserEntity
{
    Fullname!:string
    Email!:string
    UserType!:UserTypes
    Phone!:string
    UserAgent!:userAgent
    Otp!:number|string;
    OtpExpire!:Date
    lastModefication!:Date
    ProfilePicture!:fileformat
    IsVerifiyed!:boolean
    Password!:string
}