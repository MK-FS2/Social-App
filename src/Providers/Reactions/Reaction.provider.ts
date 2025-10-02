import mongoose from "mongoose";
import { ReactioningCodes, Reactions } from "../../Utils/Common/enums";
import { AppError } from "../../Utils/Error";
import { IReaction } from "../../Utils/Common/Interfaces";
import { PostRepo } from '../../DB/Models/Posts/Post.Repo';
import CommentRepo from '../../DB/Models/Comments/Comments.Repo';


function FindUserIndex(UserID: mongoose.Types.ObjectId, ReactionsArray: IReaction[]): boolean {
  return ReactionsArray.some((reaction) => reaction.UserID.equals(UserID));
}


async function AddReaction(ItemID:mongoose.Types.ObjectId,TheReaction:Reactions,UserId:mongoose.Types.ObjectId,Repo:PostRepo | CommentRepo):Promise<boolean>
{
   console.log("TheReaction being saved:", TheReaction, typeof TheReaction);
  const AddingResult = await Repo.updateDocument(
  { _id: ItemID },
  { $push:{ Reactions: { UserID: UserId, Reaction: TheReaction } } }
);
if(!AddingResult)
{
  return false
}
else 
{
   return true
}
}

async function UpdateReaction(ItemID:mongoose.Types.ObjectId,TheReaction:Reactions,UserId:mongoose.Types.ObjectId,Repo:PostRepo | CommentRepo):Promise<boolean>
{
const updatingResult = await Repo.updateDocument({_id:ItemID,"Reactions.UserID":UserId},{$set:{"Reactions.$.Reaction":TheReaction}})
if(!updatingResult)
{
   return false
}
else 
{
   return true
}
}


async function RemoveReaction(ItemID: mongoose.Types.ObjectId,UserId: mongoose.Types.ObjectId,Repo: PostRepo | CommentRepo): Promise<boolean> 
{
  const removingResult = await Repo.updateDocument({ _id: ItemID ,"Reactions.UserID":UserId},{$pull:{Reactions:{UserID: UserId }}});

  if(! removingResult)
  {
   return false
  }
  else 
  {
   return true
  }
}

export async function ToggleReaction(params: {UserID: mongoose.Types.ObjectId;ItemID: mongoose.Types.ObjectId;TheReaction?: Reactions;Repo:PostRepo | CommentRepo;}) 
{
 const ItemExist = await params.Repo.FindOneDocument({_id:params.ItemID})
 if(!ItemExist)
 {
    throw AppError.NotFound("Item not found")
 }
 const ReactionsArray:IReaction[]|[] = ItemExist.Reactions as unknown as IReaction[]|[]
 const UserIndex = FindUserIndex(params.UserID,ReactionsArray)
 if(!UserIndex)
 {
   if(!params.TheReaction)
   {
      throw new AppError("The reaction is requried",400)
   }
   const AddingResult = await AddReaction(params.ItemID,params.TheReaction,params.UserID,params.Repo)
   if(!AddingResult)
   {
      throw new AppError("Error adding reaction",500)
   }
   else 
   {
      return ReactioningCodes.Add
   }
 }
 else if(UserIndex && params.TheReaction)
 {
    if(!params.TheReaction)
   {
      throw new AppError("The reaction is requried",400)
   }
   const Updateresult = await UpdateReaction(params.ItemID,params.TheReaction,params.UserID,params.Repo)
   if(!Updateresult)
   {
      throw new AppError("Error updating reaction",500)
   }
   else 
   {
      return ReactioningCodes.Change
   }

 }
 else 
 {
  const RemovingResult = await RemoveReaction(params.ItemID,params.UserID,params.Repo)
  if(!RemovingResult)
  {
   throw new AppError("Error deleting reaction",500)
  }
  else 
  {
   return ReactioningCodes.Delete
  }
 }
 
}