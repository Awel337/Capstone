// routes/shoppingListRoutes.js
const express = require('express');
const {
  createShoppingList,
  generateShoppingList,
  getShoppingLists,
  getShoppingListById,
  updateShoppingList,
  deleteShoppingList
} = require('../controllers/shoppingListController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createShoppingList)
  .get(protect, getShoppingLists);

router.route('/generate')
  .post(protect, generateShoppingList);

router.route('/:id')
  .get(protect, getShoppingListById)
  .put(protect, updateShoppingList)
  .delete(protect, deleteShoppingList);

module.exports = router;