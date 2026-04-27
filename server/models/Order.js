const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    name: String,
    price: Number,
    isCustom: { type: Boolean, default: false },
    config: {
      base: String,
      sauce: String,
      cheese: String,
      veggies: [String],
      meat: String
    },
    quantity: { type: Number, default: 1 }
  }],
  totalAmount: { type: Number, required: true },
  deliveryAddress: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Order Received', 'In Kitchen', 'Sent for Delivery', 'Delivered'],
    default: 'Order Received'
  },
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  razorpayOrderId: String,
  razorpayPaymentId: String,
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
