const mongoose = require('mongoose');


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
module.exports = mongoose.model('User',userSchema)