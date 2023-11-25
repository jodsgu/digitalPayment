const mongoose = require('mongoose');


const loginFieldMappingSchema = mongoose.Schema({

  _id : mongoose.Schema.Types.ObjectId,
  formField: {
    type:String,
    required:true
  },
  apiField:{
    type:String,
    required:true
  }

})
module.exports = mongoose.model('Login-field-mapping',loginFieldMappingSchema)