import { Userservices } from './User.service';
import { Router } from "express";
import { Authenticate } from "../../Middleware/Authentecation";
import { SchemaValidator } from "../../Middleware/SchemaValidator";
import { SendFrindRequestValidation } from "./User.Validation";
import { ErrorCatcher } from "../../Middleware/ErrorCacher";

const UserRout  = Router()
const userservices = new  Userservices()


UserRout.post("/SendFrindRequst/:To",Authenticate,SchemaValidator(SendFrindRequestValidation),ErrorCatcher(userservices.SendFrindRequest.bind(userservices)))

export default UserRout