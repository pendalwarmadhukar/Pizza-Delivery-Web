const express = require('express');
const { getInventory, updateInventory, addInventoryItem, deleteInventoryItem } = require('../controllers/inventoryController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getInventory);
router.post('/', protect, admin, addInventoryItem);
router.put('/:id', protect, admin, updateInventory);
router.delete('/:id', protect, admin, deleteInventoryItem);

module.exports = router;
