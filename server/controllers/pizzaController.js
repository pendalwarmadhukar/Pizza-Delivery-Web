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
    const pizza = await Product.create({ ...req.body, category: 'Pizza' });
    res.status(201).json(pizza);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePizza = async (req, res) => {
  try {
    const pizza = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, category: 'Pizza' },
      { new: true, runValidators: true }
    );
    if (!pizza) return res.status(404).json({ message: 'Pizza not found' });
    res.status(200).json(pizza);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePizza = async (req, res) => {
  try {
    const pizza = await Product.findByIdAndDelete(req.params.id);
    if (!pizza) return res.status(404).json({ message: 'Pizza not found' });
    res.status(200).json({ message: 'Pizza deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
