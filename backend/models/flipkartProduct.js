const mongoose = require('mongoose');

const flipkartProductSchema = new mongoose.Schema({
  fkid:    { type: String, required: true, unique: true },
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
}, { timestamps: true ,collection: 'flipkart'});

module.exports = mongoose.models.FlipkartProduct ||
  mongoose.model('FlipkartProduct', flipkartProductSchema);
