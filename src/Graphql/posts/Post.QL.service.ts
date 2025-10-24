import { PostRepo } from './../../DB/Models/Posts/Post.Repo';
import { GraphQLList } from "graphql";
import { PostType } from "./PostType";
import { IUser } from "../../Utils/Common/Interfaces";
import { HydratedDocument } from 'mongoose';

const postRepo = new PostRepo();

export const PostQLServices = 
{
  GetAllPersonalPosts: 
  {
    type: new GraphQLList(PostType),  
    resolve: async (parent, args, context: { User: Partial<HydratedDocument<IUser>> }) => {
      const user = context.User;
      const posts = await postRepo.FindDocument({ CreatorID: user._id },{},{ populate: {path:"CreatorID",select:"Fullname Email ProfilePicture OnlineStatus"}});
      return posts || [];
    }
 }
 
};
