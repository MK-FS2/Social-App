import { IPost } from "../../../Utils/Common/Interfaces";
import { Abstractrepo } from "../../AbstractRepo";
import PostModel from "./Post.Model";


export class PostRepo extends Abstractrepo<IPost>
{
    constructor()
    {
     super(PostModel)
    }
}