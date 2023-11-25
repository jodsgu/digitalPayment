const mongoose = require('mongoose');

//import user model
const User = require('../models/users');





//user session save in DB 
exports.sessionSave = async (req, res, next) => {


  try {
    // console.log(">>>>",req)
    const userData = new User({
      _id: new mongoose.Types.ObjectId(),
      user_id: req.body.user_id,
      login_name: req.body.login_name,
      password: req.body.password,
      sessionId: req.body.sessionId,
    })

    const saveUserData = await userData.save();
    res.status(200).json({
      success: true,
      message: "Signup was sucessfull"
    })


  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Signup failed"
    })
  }


}

//user session update in DB
exports.sessionUpdate = async (req, res, next) => {
  try {
    
    const {user_id, sessionId } = req.body
    const user = await User.findOneAndUpdate({ user_id: user_id }, { $set: { sessionId: sessionId } }, { new: true });
    res.status(200).json({
      success: true,
      message: "Session updated successfully",
      user: user,
    });


  }catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Session update failed",
    });
  }
}




//user Authentication 
exports.userAuthentication = async (req, res, next) => {
}

