const mongoose = require('mongoose');

const connectToDatabase = async()=>{
  try {
    await mongoose.connect('mongodb://localhost:27017/offline-payment');
    console.log('Connected to database!');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }



}
module.exports = connectToDatabase;