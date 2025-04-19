const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  image: { type: String },
  url: { type: String },
  lastUpdated: { type: Date, default: Date.now }
});

// Prevent model overwrite error in dev/hot reload
module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
