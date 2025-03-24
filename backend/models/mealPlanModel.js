// models/mealPlanModel.js
const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  meals: [{
    date: {
      type: Date,
      required: true
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      required: true
    },
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    },
    servings: {
      type: Number,
      default: 1
    }
  }]
}, { timestamps: true });

// Create index for user-based searches
mealPlanSchema.index({ user: 1 });
mealPlanSchema.index({ startDate: 1, endDate: 1 });

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);
module.exports = MealPlan;