// models/wishlist.js
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user:             { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amazonProduct:    { type: mongoose.Schema.Types.ObjectId, ref: 'AmazonProduct', default: null },
  flipkartProduct:  { type: mongoose.Schema.Types.ObjectId, ref: 'FlipkartProduct', default: null },
  watched:          { type: Boolean, default: false },
  targetPrice:      { type: Number },
  price:            { type: Number },
  dateAdded:        { type: Date, default: Date.now },
});

module.exports = mongoose.models.Wishlist ||
mongoose.model('Wishlist', wishlistSchema);