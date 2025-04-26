const mongoose = require('mongoose');

const comparisonSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  features: mongoose.Schema.Types.Mixed
}, { timestamps: true ,collection: 'product' });

module.exports = mongoose.model('ComparisonProduct', comparisonSchema);