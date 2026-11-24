import mongoose from "mongoose";
const schema=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,index:true},title:{type:String,required:true,trim:true,maxlength:160},description:{type:String,trim:true,maxlength:2000},priority:{type:String,enum:["Low","Medium","High"],default:"Medium"},status:{type:String,enum:["Todo","In Progress","Completed"],default:"Todo"},dueDate:{type:Date},category:{type:String,trim:true,maxlength:80}},{timestamps:true});
export default mongoose.model("Task",schema);
