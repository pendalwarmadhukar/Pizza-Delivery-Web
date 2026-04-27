const Product = require('../models/Product');

exports.getPizzas = async (req, res) => {
  try {
    const pizzas = await Product.find({ category: 'Pizza' });
    res.status(200).json(pizzas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addPizza = async (req, res) => {
  try {
    const pizza = await Product.create(req.body);
    res.status(201).json(pizza);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
