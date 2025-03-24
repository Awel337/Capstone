// controllers/recipeController.js
const Recipe = require('../models/recipeModel');

// @desc    Create a new recipe
// @route   POST /api/recipes
// @access  Private
const createRecipe = async (req, res) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      createdBy: req.user._id,
    });

    const createdRecipe = await recipe.save();
    res.status(201).json(createdRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Private
const getRecipes = async (req, res) => {
  try {
    // Find recipes created by user or public recipes
    const recipes = await Recipe.find({
      $or: [
        { createdBy: req.user._id },
        { isPublic: true }
      ]
    });
    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user recipes
// @route   GET /api/recipes/myrecipes
// @access  Private
const getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.user._id });
    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get recipe by ID
// @route   GET /api/recipes/:id
// @access  Private
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (recipe) {
      // Check if recipe is public or belongs to the user
      if (recipe.isPublic || recipe.createdBy.equals(req.user._id)) {
        return res.json(recipe);
      } else {
        return res.status(403).json({ message: 'Not authorized to access this recipe' });
      }
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Private
const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (recipe) {
      // Check if user owns the recipe
      if (recipe.createdBy.equals(req.user._id)) {
        const updatedRecipe = await Recipe.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );
        return res.json(updatedRecipe);
      } else {
        return res.status(403).json({ message: 'Not authorized to update this recipe' });
      }
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (recipe) {
      // Check if user owns the recipe
      if (recipe.createdBy.equals(req.user._id)) {
        await Recipe.findByIdAndDelete(req.params.id);
        return res.json({ message: 'Recipe removed' });
      } else {
        return res.status(403).json({ message: 'Not authorized to delete this recipe' });
      }
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createRecipe,
  getRecipes,
  getMyRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe
};