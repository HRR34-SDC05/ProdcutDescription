const mongoose = require('mongoose');
// const mongoUri = 'mongodb+srv://Spencer:Spencer@cluster0-0okak.mongodb.net/trailblazer'
const mongoUri = 'mongodb://localhost/trailblazer';

mongoose.connect(mongoUri, {useNewUrlParser:true});
const db = mongoose.connection;
module.exports = db;


//const db = mongoose.connect(mongoUri, {useNewUrlParser:true});
