const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const dropIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pizzadb');
    console.log('Connected to MongoDB');
    
    const collection = mongoose.connection.collection('users');
    await collection.dropIndex('phone_1');
    console.log('Successfully dropped phone_1 index');
    
    process.exit(0);
  } catch (err) {
    console.error('Error dropping index:', err.message);
    process.exit(1);
  }
};

dropIndex();
