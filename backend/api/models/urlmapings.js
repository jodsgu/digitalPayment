import mongoose from 'mongoose';


const urlmapingSchema = mongoose.Schema({

  _id : mongoose.Schema.Types.ObjectId,
  path: {
    type:String,
    required:true,
    unique: true
  },
  action_url:{
    type:String,
    required:true,
    unique: true
  }

})
export default mongoose.model('Urlmaping',urlmapingSchema)