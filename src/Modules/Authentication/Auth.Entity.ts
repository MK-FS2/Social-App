import mongoose from "mongoose"
import { userAgent, UserTypes } from "../../Utils/Common/enums"
import { fileformat } from "../../Utils/Common/types"
import { IFrindRequest, ISentRequests } from "../../Utils/Common/Interfaces"

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
    FrindList?:mongoose.Types.ObjectId[]
    BlockedList?:mongoose.Types.ObjectId[]
    PendingFrindingRequests?:IFrindRequest[]
    SentRequests?:ISentRequests[]
}