import express from 'express';
const router = express.Router();

//controller  ../controllers/usersController.js
import userController from '../controllers/usersController.js';


//session store in DB || POST
router.post('/sessionStore',userController.sessionSave)


//session update in DB ||POST
router.patch('/sessionUpdate',userController.sessionUpdate)




export default router;