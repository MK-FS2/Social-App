import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { AttachmentsType } from "../common/common";


export const UserType = new GraphQLObjectType(
{
name:"User",
fields:
{
_id:{type:GraphQLID},
Fullname:{type:GraphQLString},
Email:{type:GraphQLString},
ProfilePicture:{type:AttachmentsType},
OnlineStatus:{type:new GraphQLObjectType({name:"Onlinestatus",fields:{Status:{type:GraphQLBoolean}}})}
}
})