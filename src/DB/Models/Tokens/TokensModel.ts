import mongoose from "mongoose";
import { TokenSchema } from "./TokenShema";



const TokenModel = mongoose.model("Token",TokenSchema)


export default TokenModel