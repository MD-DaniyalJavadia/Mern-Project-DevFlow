import mongoose from "mongoose";
const schema=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,index:true},title:{type:String,required:true,trim:true,maxlength:160},url:{type:String,required:true,trim:true},description:{type:String,trim:true,maxlength:1000},category:{type:String,enum:["Documentation","Tools","Tutorials","GitHub","APIs","Other"],default:"Other"}},{timestamps:true});
export default mongoose.model("Bookmark",schema);
