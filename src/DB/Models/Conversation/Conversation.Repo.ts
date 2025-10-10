import { IConversation } from "../../../Utils/Common/Interfaces";
import { Abstractrepo } from "../../AbstractRepo";
import ConversationModel from "./Conversation.Model";

 export class ConversationRepo extends Abstractrepo<IConversation>
 {
    constructor()
    {
        super(ConversationModel)
    }


    
 }