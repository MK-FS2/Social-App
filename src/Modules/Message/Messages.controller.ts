import { Router } from "express";
import { Authenticate } from "../../Middleware/Authentecation";
import { SchemaValidator } from "../../Middleware/SchemaValidator";
import { AddMessagevalidation, CreateConversationvalidation } from "./Message.validation";
import { ErrorCatcher } from "../../Middleware/ErrorCacher";
import { MessageServices } from "./Messages.service";
import FileUpload from "../../Middleware/FileUplode";
import { FileTypes } from "../../Middleware/FileUplode/filetypes";

const MessageRoute = Router()
const messageService = new MessageServices()


MessageRoute.post("/CreatConversation/:To",Authenticate,SchemaValidator(CreateConversationvalidation),ErrorCatcher(messageService.StartConversation.bind(messageService)))
MessageRoute.post("/AddMessageConversation/:ConversationID",Authenticate,FileUpload(1*1024*1024,FileTypes.Image).single("Attachment"),SchemaValidator(AddMessagevalidation),ErrorCatcher(messageService.AddMessageToconversation.bind(messageService)))

export default MessageRoute