import mongoose from "mongoose";
const schema=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,index:true},title:{type:String,required:true,trim:true,maxlength:160},description:{type:String,trim:true,maxlength:3000},priority:{type:String,enum:["Low","Medium","High","Critical"],default:"Medium"},status:{type:String,enum:["Open","In Progress","Resolved","Closed"],default:"Open"},project:{type:String,trim:true,maxlength:100},assignedTo:{type:String,trim:true,maxlength:100}},{timestamps:true});
export default mongoose.model("Bug",schema);
