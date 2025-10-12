import { Userservices } from './User.service';
import { Router } from "express";
import { Authenticate } from "../../Middleware/Authentecation";
import { SchemaValidator } from "../../Middleware/SchemaValidator";
import { AnswerRequest, BlockUserValidation, SendFrindRequestValidation } from "./User.Validation";
import { ErrorCatcher } from "../../Middleware/ErrorCacher";

const UserRout  = Router()
const userservices = new  Userservices()


UserRout.post("/SendFrindRequst/:To",Authenticate,SchemaValidator(SendFrindRequestValidation),ErrorCatcher(userservices.SendFrindRequest.bind(userservices)))
UserRout.post("/AnswerRequest/:RequestID/:Flag",Authenticate,SchemaValidator(AnswerRequest),ErrorCatcher(userservices.AnswerFrindRequest.bind(userservices)))
UserRout.post("/BlockUser/:BadUserID",Authenticate,SchemaValidator(BlockUserValidation),ErrorCatcher(userservices.BlockingUser.bind(userservices)))
UserRout.post("/Unfrind/:BadUserID",Authenticate,SchemaValidator(BlockUserValidation),ErrorCatcher(userservices.UnFrind.bind(userservices)))
UserRout.post("/UnBlock/:BadUserID",Authenticate,SchemaValidator(BlockUserValidation),ErrorCatcher(userservices.UnBlock.bind(userservices)))
export default UserRout