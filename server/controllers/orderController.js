const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const razorpay = require('../config/razorpay');
const crypto = require('crypto');
const mongoose = require('mongoose');

exports.createOrder = async (req, res, next) => {
  const { items, totalAmount } = req.body;
  try {
    // 1. Pre-Payment Stock Check
    for (const item of items) {
      if (item.isCustom) {
        const { base, sauce, cheese, veggies, meat } = item.config;
        const ingredients = [base, sauce, cheese, ...veggies, meat].filter(Boolean);
        for (const ingName of ingredients) {
          const invItem = await Inventory.findOne({ name: ingName });
          if (!invItem || invItem.quantity <= 0) {
            return res.status(400).json({ message: `Insufficient stock for ingredient: ${ingName}` });
          }
        }
      }
    }

    const options = {
      amount: totalAmount * 100, // amount in paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const rzpOrder = await razorpay.orders.create(options);
    
    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      razorpayOrderId: rzpOrder.id,
      status: 'Order Received',
    });

    res.status(201).json({
      success: true,
      rzpOrder,
      orderId: order._id,
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyPayment = async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generatedSignature = hmac.digest('hex');

  if (generatedSignature === razorpay_signature) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const order = await Order.findById(orderId).session(session);
      if (!order) throw new Error('Order not found');

      order.paymentStatus = 'Completed';
      order.razorpayPaymentId = razorpay_payment_id;
      await order.save({ session });

      // Deduct Stock with Atomic Updated
      for (const item of order.items) {
        if (item.isCustom) {
          const { base, sauce, cheese, veggies, meat } = item.config;
          const ingredients = [base, sauce, cheese, ...veggies, meat].filter(Boolean);
          for (const ingName of ingredients) {
            const result = await Inventory.findOneAndUpdate(
              { name: ingName, quantity: { $gt: 0 } },
              { $inc: { quantity: -1 } },
              { session, new: true }
            );
            if (!result) {
              throw new Error(`Item ${ingName} went out of stock during processing!`);
            }
          }
        }
      }

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ success: true, message: 'Payment verified and order placed' });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  } else {
    res.status(400).json({ success: false, message: 'Invalid signature' });
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    // Notify user via socket
    const io = req.app.get('socketio');
    io.to(order._id.toString()).emit('status_updated', status);

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

