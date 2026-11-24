import mongoose from "mongoose";
const schema=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,index:true},title:{type:String,required:true,trim:true,maxlength:160},description:{type:String,trim:true,maxlength:1000},language:{type:String,required:true,enum:["JavaScript","React","Node.js","C#","SQL","HTML","CSS","PHP","Python"]},code:{type:String,required:true,maxlength:20000},tags:[{type:String,trim:true,maxlength:30}]},{timestamps:true});
export default mongoose.model("Snippet",schema);
