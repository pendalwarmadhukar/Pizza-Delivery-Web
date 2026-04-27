const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  ingredients: [String],
  category: { type: String, default: 'Pizza' },
  type: { type: String, enum: ['Veg', 'Non-Veg'], default: 'Veg' }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
