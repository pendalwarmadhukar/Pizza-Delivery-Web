const express = require('express');
const { getPizzas, addPizza, updatePizza, deletePizza } = require('../controllers/pizzaController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getPizzas);
router.post('/', protect, admin, addPizza);
router.put('/:id', protect, admin, updatePizza);
router.delete('/:id', protect, admin, deletePizza);

module.exports = router;
