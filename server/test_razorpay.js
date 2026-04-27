const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: 'rzp_test_Si6cRpvkUFHmy8',
  key_secret: 'sL9l6z38YaacDBCWd3fg0z57',
});

razorpay.orders.create({
  amount: 50000,
  currency: 'INR',
  receipt: 'receipt_123',
}).then(res => console.log("Success:", res)).catch(err => console.error("Error:", err));
