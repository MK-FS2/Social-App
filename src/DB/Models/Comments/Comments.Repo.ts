
import { IComment } from "../../../Utils/Common/Interfaces";
import { Abstractrepo } from "../../AbstractRepo";
import CommentModel from "./comments.Model";



 class CommentRepo extends Abstractrepo<IComment> 
{
    constructor()
    {
        super(CommentModel)
    }
}


export default CommentRepo