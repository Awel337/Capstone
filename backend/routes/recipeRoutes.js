// routes/recipeRoutes.js
const express = require('express');
const {
  createRecipe,
  getRecipes,
  getMyRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe
} = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createRecipe)
  .get(protect, getRecipes);

router.route('/myrecipes')
  .get(protect, getMyRecipes);

router.route('/:id')
  .get(protect, getRecipeById)
  .put(protect, updateRecipe)
  .delete(protect, deleteRecipe);

module.exports = router;