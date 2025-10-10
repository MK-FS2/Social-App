import mongoose, { Model, RootFilterQuery, ProjectionType, QueryOptions,UpdateQuery ,HydratedDocument } from "mongoose";
import { AppError } from "../Utils/Error";

export abstract class Abstractrepo<Tdoc> {
  constructor(protected model: Model<Tdoc>) {}

  async IsExist(filter: RootFilterQuery<Tdoc>,projection?: ProjectionType<Tdoc>,options?: QueryOptions<Tdoc>): Promise<boolean | null> 
  {
    try 
    {
    const result = await  this.model.findOne(filter, projection, options);
    if(result)
    {
    return true
    }
    else 
    {
      return false
    }
    }
    catch(err:any)
    {
     throw new AppError(err.message || "server Error",500)
    }
  }

  async createDocument(document: Tdoc): Promise<HydratedDocument<Tdoc> | false> {
    try 
    {
      const doc = await this.model.create(document);
      return doc;
    } 
    catch (error) 
    {
      return false;
    }
  }

  async deleteDocument(filter: RootFilterQuery<Tdoc>): Promise<boolean> {
  try 
  {
    const result = await this.model.deleteOne(filter);
    return result.deletedCount > 0;
  } 
  catch (error) 
  {
    return false;
  }
}

async updateDocument(filter: RootFilterQuery<Tdoc>,update:UpdateQuery<Tdoc>):Promise<HydratedDocument<Tdoc> | null> 
{
  try 
  {
    const updatedDoc = await this.model.findOneAndUpdate(filter,update,{new: true})
    return updatedDoc
  } 
  catch (error) 
  {
    return null
  }
}

async FindDocument(filter:RootFilterQuery<Tdoc>,projection?: ProjectionType<Tdoc>,options?: QueryOptions<Tdoc>):Promise<false | HydratedDocument<Tdoc> []>
{
try 
{
const Result = await this.model.find(filter,projection,options)
if(Result.length == 0)
{
return false
}
else 
{
  return Result
}
}
catch(err)
{
   throw AppError.ServerError()
}
}

async FindOneDocument(filter:RootFilterQuery<Tdoc>,projection?: ProjectionType<Tdoc>,options?: QueryOptions<Tdoc>):Promise<false | HydratedDocument<Tdoc>>
{
try 
{
const Result = await this.model.findOne(filter,projection,options)
if(!Result)
{
return false
}
else 
{
  return Result
}
}
catch(err)
{
   throw AppError.ServerError()
}
}
}
