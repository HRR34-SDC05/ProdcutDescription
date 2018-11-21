const mongoose = require('mongoose');
const db = require('./connectMongo.js');
mongoose.Promise = global.Promise;

const descriptionSchema = new mongoose.Schema({
  productName: String,
  productId: Number,
  features: [String],
  techSpecs: [new mongoose.Schema ({
    types: String,
    description: String,
    measurement: Boolean
  }, {_id:false})],
});

const Description = mongoose.model('Description', descriptionSchema);

module.exports = Description;
