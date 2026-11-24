import mongoose from "mongoose";
const schema=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,index:true},startedAt:{type:Date,required:true},endedAt:{type:Date,required:true},durationSeconds:{type:Number,required:true,min:0}},{timestamps:true});
export default mongoose.model("CodingSession",schema);
