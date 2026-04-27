const cron = require('node-cron');
const Inventory = require('../models/Inventory');
const { sendEmail } = require('./emailService');

const initCron = () => {
  // Run every 10 minutes
  cron.schedule('*/10 * * * *', async () => {
    try {
      const lowStockItems = await Inventory.find({ 
        quantity: { $lt: 20 }, 
        alertSent: false 
      });

      if (lowStockItems.length > 0) {
        const itemNames = lowStockItems.map(item => item.name).join(', ');
        const message = `<h1>Low Stock Alert</h1><p>The following items are below 20 units: <b>${itemNames}</b>. Please restock soon.</p>`;
        
        const mailSent = await sendEmail(process.env.ADMIN_EMAIL, 'Low Stock Alert - Pizza Hub', 'Low stock alert', message);
        
        if (mailSent) {
          // Mark as alert sent so we don't spam
          await Inventory.updateMany(
            { _id: { $in: lowStockItems.map(i => i._id) } },
            { $set: { alertSent: true } }
          );
          console.log('Low stock email alert sent to admin');
        }
      }
    } catch (error) {
      console.error('Cron Error:', error);
    }
  });
};

module.exports = initCron;
