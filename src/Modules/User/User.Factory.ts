import mongoose from "mongoose";
import { RequstEntity, SentRequestEntity } from "./User.Entities";


export class UserFactory
{

    SendFrindRequest(From:mongoose.Types.ObjectId)
    {
    const Request = new RequstEntity()

     Request.From = From 
     return Request
    }

    SentRequest(To:mongoose.Types.ObjectId)
    {
        const sentRequest = new SentRequestEntity()
        sentRequest.To = To
        return sentRequest 
    }
}