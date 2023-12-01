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
  },
  data_mapping : {
    type: Object,
    properties: {
      login_name: {
      type: String
      },
      password: {
        type: String
        
      }
    }
  }




})
export default mongoose.model('Url-maping',urlmapingSchema)


