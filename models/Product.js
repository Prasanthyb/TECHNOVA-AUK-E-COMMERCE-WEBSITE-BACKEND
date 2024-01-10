const mongoose = require('mongoose');

// Define the schema
const productSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  company: { type: String, required: true },
  colors: { type: [String], required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  featured: { type: Boolean },
  stock: { type: Number, required: true },
  reviews: { type: Number, required: true },
  stars: { type: Number, required: true },
  image: [
    {
      id: { type: String, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      url: { type: String, required: true },
      filename: { type: String, required: true },
      size: { type: Number, required: true },
      type: { type: String, required: true },
    },
  ],
});

// Create a Mongoose model
const Product= mongoose.model('Product', productSchema);
module.exports = Product;