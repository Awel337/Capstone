// controllers/mealPlanController.js
const MealPlan = require('../models/mealPlanModel');

// @desc    Create a new meal plan
// @route   POST /api/mealplans
// @access  Private
const createMealPlan = async (req, res) => {
  try {
    const mealPlan = new MealPlan({
      ...req.body,
      user: req.user._id,
    });

    const createdMealPlan = await mealPlan.save();
    res.status(201).json(createdMealPlan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all user meal plans
// @route   GET /api/mealplans
// @access  Private
const getMealPlans = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ user: req.user._id });
    res.json(mealPlans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get meal plan by ID
// @route   GET /api/mealplans/:id
// @access  Private
const getMealPlanById = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id)
      .populate('meals.recipe');

    if (mealPlan) {
      // Check if meal plan belongs to the user
      if (mealPlan.user.equals(req.user._id)) {
        return res.json(mealPlan);
      } else {
        return res.status(403).json({ message: 'Not authorized to access this meal plan' });
      }
    } else {
      res.status(404).json({ message: 'Meal plan not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a meal plan
// @route   PUT /api/mealplans/:id
// @access  Private
const updateMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);

    if (mealPlan) {
      // Check if user owns the meal plan
      if (mealPlan.user.equals(req.user._id)) {
        const updatedMealPlan = await MealPlan.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );
        return res.json(updatedMealPlan);
      } else {
        return res.status(403).json({ message: 'Not authorized to update this meal plan' });
      }
    } else {
      res.status(404).json({ message: 'Meal plan not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a meal plan
// @route   DELETE /api/mealplans/:id
// @access  Private
const deleteMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);

    if (mealPlan) {
      // Check if user owns the meal plan
      if (mealPlan.user.equals(req.user._id)) {
        await MealPlan.findByIdAndDelete(req.params.id);
        return res.json({ message: 'Meal plan removed' });
      } else {
        return res.status(403).json({ message: 'Not authorized to delete this meal plan' });
      }
    } else {
      res.status(404).json({ message: 'Meal plan not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createMealPlan,
  getMealPlans,
  getMealPlanById,
  updateMealPlan,
  deleteMealPlan
};