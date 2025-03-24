// routes/externalApiRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const spoonacularService = require('../services/spoonacularService');

const router = express.Router();

// @desc    Search recipes from Spoonacular
// @route   GET /api/external/recipes/search
// @access  Private
router.get('/recipes/search', protect, async (req, res) => {
  try {
    const { query, diet, intolerances, number } = req.query;
    const result = await spoonacularService.searchRecipes(
      query, 
      diet, 
      intolerances, 
      number
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error searching recipes' });
  }
});

// @desc    Get recipe information from Spoonacular
// @route   GET /api/external/recipes/:id
// @access  Private
router.get('/recipes/:id', protect, async (req, res) => {
  try {
    const result = await spoonacularService.getRecipeInformation(req.params.id);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting recipe information' });
  }
});

// @desc    Extract recipe from URL
// @route   POST /api/external/recipes/extract
// @access  Private
router.post('/recipes/extract', protect, async (req, res) => {
  try {
    const { url } = req.body;
    const result = await spoonacularService.extractRecipeFromUrl(url);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error extracting recipe' });
  }
});

module.exports = router;