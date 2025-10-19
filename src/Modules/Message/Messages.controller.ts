import { Router } from "express";
import { Authenticate } from "../../Middleware/Authentecation";
import { SchemaValidator } from "../../Middleware/SchemaValidator";
import { CreateConversationvalidation, GetCpnversationValidation } from "./Message.validation";
import { ErrorCatcher } from "../../Middleware/ErrorCacher";
import { MessageServices } from "./Messages.service";



const MessageRoute = Router()
const messageService = new MessageServices()


MessageRoute.post("/CreatConversation/:To",Authenticate,SchemaValidator(CreateConversationvalidation),ErrorCatcher(messageService.StartConversation.bind(messageService)))
MessageRoute.get("/GetConversationData/:ConversationID",Authenticate,SchemaValidator(GetCpnversationValidation),ErrorCatcher(messageService.GetConversationData.bind(messageService)))

export default MessageRoute