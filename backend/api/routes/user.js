const express = require('express');
const router = express.Router();

//controller
const userController = require('../controllers/usersController');


//session store in DB || POST
router.post('/sessionStore',userController.sessionSave)


//session update in DB ||POST
router.patch('/sessionUpdate',userController.sessionUpdate)


//user  Authentication  || GET
router.post('/checkUser',userController.userAuthentication)

module.exports = router;