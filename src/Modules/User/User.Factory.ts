import mongoose from "mongoose";
import { RequstEntity, SentRequestEntity } from "./User.Entities";


export class UserFactory
{

    SendFrindRequest(From:mongoose.Types.ObjectId)
    {
    const Request = new RequstEntity()

     Request.From = From 
     Request.SentAT = new Date(Date.now())
     return Request
    }

    SentRequest(To:mongoose.Types.ObjectId)
    {
        const sentRequest = new SentRequestEntity()
        sentRequest.To = To
        sentRequest.SentAT = new Date(Date.now())
        return sentRequest 
    }
}