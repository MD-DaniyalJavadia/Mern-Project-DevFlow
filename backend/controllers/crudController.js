export function makeCrud(Model,name){
 return {
  list:async(req,res,next)=>{try{const data=await Model.find({userId:req.user._id}).sort({createdAt:-1});res.json({success:true,message:`${name} fetched successfully`,data});}catch(e){next(e)}},
  get:async(req,res,next)=>{try{const data=await Model.findOne({_id:req.params.id,userId:req.user._id});if(!data)return res.status(404).json({success:false,message:`${name} not found`});res.json({success:true,message:`${name} fetched successfully`,data});}catch(e){next(e)}},
  create:async(req,res,next)=>{try{const {userId,...payload}=req.body;const data=await Model.create({...payload,userId:req.user._id});res.status(201).json({success:true,message:`${name} created successfully`,data});}catch(e){next(e)}},
  update:async(req,res,next)=>{try{const {userId,...payload}=req.body;const data=await Model.findOneAndUpdate({_id:req.params.id,userId:req.user._id},payload,{new:true,runValidators:true});if(!data)return res.status(404).json({success:false,message:`${name} not found`});res.json({success:true,message:`${name} updated successfully`,data});}catch(e){next(e)}},
  remove:async(req,res,next)=>{try{const data=await Model.findOneAndDelete({_id:req.params.id,userId:req.user._id});if(!data)return res.status(404).json({success:false,message:`${name} not found`});res.json({success:true,message:`${name} deleted successfully`,data});}catch(e){next(e)}}
 };
}
