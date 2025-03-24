// controllers/shoppingListController.js
const ShoppingList = require('../models/shoppingListModel');
const MealPlan = require('../models/mealPlanModel');
const Recipe = require('../models/recipeModel');

// @desc    Create a new shopping list
// @route   POST /api/shoppinglists
// @access  Private
const createShoppingList = async (req, res) => {
  try {
    const shoppingList = new ShoppingList({
      ...req.body,
      user: req.user._id,
    });

    const createdList = await shoppingList.save();
    res.status(201).json(createdList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Generate shopping list from meal plan
// @route   POST /api/shoppinglists/generate
// @access  Private
const generateShoppingList = async (req, res) => {
  try {
    const { mealPlanId, name } = req.body;

    // Find meal plan and check if it belongs to user
    const mealPlan = await MealPlan.findById(mealPlanId);
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    
    if (!mealPlan.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get all recipe IDs from meal plan
    const recipeIds = mealPlan.meals.map(meal => meal.recipe);
    
    // Get recipes with ingredients
    const recipes = await Recipe.find({ _id: { $in: recipeIds } });
    
    // Combine ingredients
    const combinedItems = [];
    
    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        // Check if this ingredient is already in our list
        const existingItem = combinedItems.find(item => 
          item.name.toLowerCase() === ingredient.name.toLowerCase()
        );
        
        if (existingItem) {
          // For simplicity, we're just noting there are multiple entries
          // In a real app, you'd want to combine quantities intelligently
          existingItem.amount = `${existingItem.amount} + ${ingredient.amount}`;
        } else {
          combinedItems.push({
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit,
            isChecked: false,
            // Basic categorization - could be improved with a categorization service
            category: categorizeIngredient(ingredient.name)
          });
        }
      });
    });
    
    // Create new shopping list
    const shoppingList = new ShoppingList({
      name: name || `Shopping List for ${mealPlan.name}`,
      user: req.user._id,
      items: combinedItems,
      mealPlanId: mealPlanId
    });
    
    const createdList = await shoppingList.save();
    res.status(201).json(createdList);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Simple categorization helper function
function categorizeIngredient(name) {
  name = name.toLowerCase();
  
  // Very basic categorization - in a real app, this would be more sophisticated
  if (/milk|cheese|yogurt|cream|butter/.test(name)) return 'dairy';
  if (/apple|banana|lettuce|carrot|onion|potato|tomato|pepper/.test(name)) return 'produce';
  if (/chicken|beef|pork|fish|turkey|lamb/.test(name)) return 'meat';
  if (/frozen|ice cream|pizza/.test(name)) return 'frozen';
  
  return 'pantry';
}

// @desc    Get all user shopping lists
// @route   GET /api/shoppinglists
// @access  Private
const getShoppingLists = async (req, res) => {
  try {
    const shoppingLists = await ShoppingList.find({ user: req.user._id });
    res.json(shoppingLists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get shopping list by ID
// @route   GET /api/shoppinglists/:id
// @access  Private
const getShoppingListById = async (req, res) => {
  try {
    const shoppingList = await ShoppingList.findById(req.params.id);

    if (shoppingList) {
      // Check if shopping list belongs to the user
      if (shoppingList.user.equals(req.user._id)) {
        return res.json(shoppingList);
      } else {
        return res.status(403).json({ message: 'Not authorized to access this shopping list' });
      }
    } else {
      res.status(404).json({ message: 'Shopping list not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a shopping list
// @route   PUT /api/shoppinglists/:id
// @access  Private
const updateShoppingList = async (req, res) => {
  try {
    const shoppingList = await ShoppingList.findById(req.params.id);

    if (shoppingList) {
      // Check if user owns the shopping list
      if (shoppingList.user.equals(req.user._id)) {
        const updatedList = await ShoppingList.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );
        return res.json(updatedList);
      } else {
        return res.status(403).json({ message: 'Not authorized to update this shopping list' });
      }
    } else {
      res.status(404).json({ message: 'Shopping list not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a shopping list
// @route   DELETE /api/shoppinglists/:id
// @access  Private
const deleteShoppingList = async (req, res) => {
  try {
    const shoppingList = await ShoppingList.findById(req.params.id);

    if (shoppingList) {
      // Check if user owns the shopping list
      if (shoppingList.user.equals(req.user._id)) {
        await ShoppingList.findByIdAndDelete(req.params.id);
        return res.json({ message: 'Shopping list removed' });
      } else {
        return res.status(403).json({ message: 'Not authorized to delete this shopping list' });
      }
    } else {
      res.status(404).json({ message: 'Shopping list not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createShoppingList,
  generateShoppingList,
  getShoppingLists,
  getShoppingListById,
  updateShoppingList,
  deleteShoppingList
};