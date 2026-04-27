const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Base', 'Sauce', 'Cheese', 'Veggies', 'Meat'] 
  },
  quantity: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true, default: 0 },
  threshold: { type: Number, default: 20 },
  alertSent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', InventorySchema);
