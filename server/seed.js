const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Inventory = require('./models/Inventory');
const Product = require('./models/Product');

dotenv.config();

const items = [
  // Bases
  { category: 'Base', name: 'Thin Crust', quantity: 50, price: 100 },
  { category: 'Base', name: 'Thick Crust', quantity: 50, price: 120 },
  { category: 'Base', name: 'Cheese Burst', quantity: 30, price: 150 },
  { category: 'Base', name: 'Whole Wheat', quantity: 40, price: 110 },
  { category: 'Base', name: 'Gluten Free', quantity: 20, price: 140 },
  
  // Sauces
  { category: 'Sauce', name: 'Tomato', quantity: 100, price: 20 },
  { category: 'Sauce', name: 'Pesto', quantity: 50, price: 40 },
  { category: 'Sauce', name: 'Barbecue', quantity: 50, price: 30 },
  { category: 'Sauce', name: 'Alfredo', quantity: 40, price: 50 },
  { category: 'Sauce', name: 'Spicy Marinara', quantity: 60, price: 30 },

  // Cheeses
  { category: 'Cheese', name: 'Mozzarella', quantity: 100, price: 50 },
  { category: 'Cheese', name: 'Cheddar', quantity: 60, price: 60 },
  { category: 'Cheese', name: 'Parmesan', quantity: 40, price: 80 },

  // Veggies
  { category: 'Veggies', name: 'Mushroom', quantity: 80, price: 20 },
  { category: 'Veggies', name: 'Capsicum', quantity: 80, price: 15 },
  { category: 'Veggies', name: 'Olives', quantity: 60, price: 30 },
  { category: 'Veggies', name: 'Onion', quantity: 100, price: 10 },
  { category: 'Veggies', name: 'Corn', quantity: 70, price: 20 },
  { category: 'Veggies', name: 'Jalapeños', quantity: 50, price: 25 },
  { category: 'Veggies', name: 'Tomatoes', quantity: 90, price: 15 },
  { category: 'Veggies', name: 'Spinach', quantity: 40, price: 30 },
  { category: 'Veggies', name: 'Bell Pepper', quantity: 60, price: 20 },
  { category: 'Veggies', name: 'Pineapple', quantity: 40, price: 25 },

  // Meats
  { category: 'Meat', name: 'Pepperoni', quantity: 40, price: 100 },
  { category: 'Meat', name: 'Chicken', quantity: 60, price: 80 },
  { category: 'Meat', name: 'Bacon', quantity: 30, price: 120 },
];

const specialtyPizzas = [
  {
    name: 'Margherita Bliss',
    description: 'Fresh basil, bocconcini mozzarella, and our signature red sauce on a thin crust.',
    price: 299,
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Pepperoni Feast',
    description: 'Double layer of spicy pepperoni with extra mozzarella and oregano.',
    price: 449,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Rustic Paneer',
    description: 'Tandoori spices meets Italian dough. Topped with marinated paneer cubes.',
    price: 399,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'BBQ Chicken Supreme',
    description: 'Smoky BBQ sauce, grilled chicken, red onions, and cilantro drizzle.',
    price: 499,
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Veggie Garden',
    description: 'Loaded with mushrooms, bell peppers, olives, corn, and fresh tomatoes.',
    price: 349,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Hawaiian Bliss',
    description: 'Sweet pineapple chunks with ham, mozzarella, and a hint of jalapeño.',
    price: 429,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Mushroom Truffle',
    description: 'Wild mushroom medley with truffle oil, parmesan, and garlic cream base.',
    price: 549,
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Spicy Diavola',
    description: 'Fiery salami, chilli flakes, jalapeño, and spicy marinara sauce.',
    price: 479,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Four Cheese',
    description: 'A rich blend of mozzarella, cheddar, parmesan, and gorgonzola.',
    price: 529,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Seed Inventory
    await Inventory.deleteMany({});
    await Inventory.insertMany(items);
    console.log('--- Inventory Seeded ---');

    // Seed Specialty Products
    await Product.deleteMany({});
    await Product.insertMany(specialtyPizzas);
    console.log('--- 9 Specialty Pizzas Seeded ---');

    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
