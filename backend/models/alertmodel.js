const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  currentPrice: { type: Number, required: true }
});

module.exports = mongoose.model('Alert', alertSchema);
