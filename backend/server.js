import express from 'express';
import bodyParser from 'body-parser'
import dbConnection from './db.js';
import cors from 'cors';
//router
import userRouter from './api/routes/user.js';

import handleLogin from './api/middlewares/path-to-handle-login.js'


dbConnection();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mount the /users router
app.use('/users', userRouter);

app.all('*', async (req, res) => {
  try{
    const path = req.url; // Extract the path from the URL
    console.log("Requested path:", path);

    await handleLogin(req, res);
  }catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error11' });
  }



  
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
