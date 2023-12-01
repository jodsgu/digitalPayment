import mongoose from 'mongoose';


const userSchema = mongoose.Schema({

  _id : mongoose.Schema.Types.ObjectId,
  user_id: {
    type:Number,
    required:true,
  },
  login_name:{
    type:String,
    required:true,
    unique: true
  },
  password:{
    type:String,
    required:true
  },
  sessionId: {
    type:String,
    required:true,
    unique: true


  }

})
export default mongoose.model('User',userSchema)