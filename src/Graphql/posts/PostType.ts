import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { AttachmentsType, ReactionType } from "../common/common";
import { UserType } from "../User/UserType";
import { IPost, IUser } from "../../Utils/Common/Interfaces";
import { UserRepo } from "../../DB/Models/User/UserRepo";


const userRepo = new UserRepo()


export const PostType = new GraphQLObjectType<Partial<IPost>>(
{
name:"Post",
fields:
{
_id:{type:GraphQLID},
Content:{type:GraphQLString},
Header:{type:GraphQLString},
Attachments:{type:new GraphQLList(AttachmentsType)},
freez:{type:GraphQLBoolean},
Creator: 
{
  type: UserType,
  resolve:async (post:Partial<IPost>)=>{ return await userRepo.FindOneDocument({_id:post.CreatorID})}
},
Reactions:{type:new GraphQLList(ReactionType)},
createdAt:{type:GraphQLString},
updatedAt:{type:GraphQLString}
}
})