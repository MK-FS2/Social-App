import { GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { UserType } from "../User/UserType";


export const AttachmentsType = new GraphQLObjectType(
{
name:"Photos",
fields:
{
ID:{type:GraphQLString},
URL:{type:GraphQLString}
}
})

export const ReactionType  = new GraphQLObjectType(
{
name:"Reactions",
fields:
{
_id:{type:GraphQLID},
Reaction:{type:GraphQLInt},
createdAt:{type:GraphQLString},
updatedAt:{type:GraphQLString},
Reactor:{type:UserType},
}
})
