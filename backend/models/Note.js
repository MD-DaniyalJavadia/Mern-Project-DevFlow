import mongoose from "mongoose";
const schema=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,index:true},title:{type:String,required:true,trim:true,maxlength:160},content:{type:String,required:true,maxlength:10000},tags:[{type:String,trim:true,maxlength:30}],pinned:{type:Boolean,default:false}},{timestamps:true});
export default mongoose.model("Note",schema);
