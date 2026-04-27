const express = require('express');
const { getPizzas, addPizza } = require('../controllers/pizzaController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getPizzas);
router.post('/', protect, admin, addPizza);

module.exports = router;
