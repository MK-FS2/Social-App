import { Userservices } from './User.service';
import { Router } from "express";
import { Authenticate } from "../../Middleware/Authentecation";
import { SchemaValidator } from "../../Middleware/SchemaValidator";
import { AnswerRequest, SendFrindRequestValidation } from "./User.Validation";
import { ErrorCatcher } from "../../Middleware/ErrorCacher";

const UserRout  = Router()
const userservices = new  Userservices()


UserRout.post("/SendFrindRequst/:To",Authenticate,SchemaValidator(SendFrindRequestValidation),ErrorCatcher(userservices.SendFrindRequest.bind(userservices)))
UserRout.post("/AnswerRequest/:RequestID/:Flag",Authenticate,SchemaValidator(AnswerRequest),ErrorCatcher(userservices.AnswerFrindRequest.bind(userservices)))
export default UserRout