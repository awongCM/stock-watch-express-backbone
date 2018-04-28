// StockSchema

const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const stockSchema = new Schema({
  name: String,
  description: String,
  units: Number,
  value: Number,
  profit_loss: Number,
  created_at: Date,
  updated_at: Date,
  currency: String
});


const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;