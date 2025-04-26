const mongoose = require('mongoose');

const amazonProductSchema = new mongoose.Schema({
  asin:    { type: String, required: true, unique: true },
  title:   { type: String, required: true },
  price:   { type: Number, required: true }, // INR
  rating:  { type: Number },
  reviews: { type: String },
  image:   { type: String },
  url:     { type: String },
  category: {
      type: String,
      required: true,
    },
    features: mongoose.Schema.Types.Mixed
}, { timestamps: true ,collection: 'amazon'});

module.exports = mongoose.models.AmazonProduct ||
  mongoose.model('AmazonProduct', amazonProductSchema);
