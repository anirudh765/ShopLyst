const mongoose = require('mongoose');

const comparisonSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true, // So we don’t store multiple comparison entries for same product
  },
  category: {
    type: String,
    required: true,
  },
  features: {
    type: Map,
    of: String, // or `Mixed` if some values are numbers or nested structures
    required: true,
  },
  validKeys: {
    type: [String], // List of keys that make sense for this category
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('ComparisonProduct', comparisonSchema);
