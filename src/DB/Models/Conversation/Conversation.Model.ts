import mongoose from "mongoose";
import { ConversationSchema } from "./Conversation.Schema";


  const ConversationModel =  mongoose.model("Conversation", ConversationSchema);


  export default ConversationModel