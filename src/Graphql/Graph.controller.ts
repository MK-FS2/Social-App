import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { PostQLServices } from './posts/Post.QL.service';

const query = new GraphQLObjectType(
{
name:"RootQuery",
fields:
{
...PostQLServices
}
})

export const schema = new GraphQLSchema(
{
query
})