
import mongoose, { HydratedDocument } from "mongoose";
import { IComment } from "../../../Utils/Common/Interfaces";
import { Abstractrepo } from "../../AbstractRepo";
import CommentModel from "./comments.Model";



 class CommentRepo extends Abstractrepo<IComment> 
{
    constructor()
    {
        super(CommentModel)
    }

  async GetComments(UserID:mongoose.Types.ObjectId,PostID:mongoose.Types.ObjectId,limit:number):Promise<HydratedDocument<IComment>[]|[]>
  {
   const Comments = await CommentModel.find({ PostID, ParentID: null }).limit(limit).setOptions({ UserID }).populate({ path: "Replies", populate: { path: "Replies", populate: { path: "Replies" } } });
    if(Comments.length == 0)
    {
        return []
    }
    else 
    {
        return Comments
    }
  }


}


export default CommentRepo