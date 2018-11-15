const mongoose = require('mongoose');
// const mongoUri = 'mongodb+srv://Spencer:Spencer@cluster0-0okak.mongodb.net/trailblazer'
const mongoUri = 'mongodb://localhost:27017/trailblazer';

mongoose.connect(mongoUri, {
  useNewUrlParser:true,
  keepAlive: true,
  poolSize: 10,
  connectTimeoutMS: 100000,
  socketTimeoutMS: 200000
});
const db = mongoose.connection;
module.exports = db;


//const db = mongoose.connect(mongoUri, {useNewUrlParser:true});
