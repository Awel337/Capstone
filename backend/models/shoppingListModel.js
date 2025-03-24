// models/shoppingListModel.js
const mongoose = require('mongoose');

const shoppingListSchema = new mongoose.Schema({
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
  items: [{
    name: {
      type: String,
      required: true
    },
    amount: {
      type: String
    },
    unit: {
      type: String
    },
    isChecked: {
      type: Boolean,
      default: false
    },
    category: {
      type: String,
      enum: ['produce', 'dairy', 'meat', 'pantry', 'frozen', 'other'],
      default: 'other'
    }
  }],
  mealPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MealPlan'
  }
}, { timestamps: true });

// Create index for user-based lookups
shoppingListSchema.index({ user: 1 });

const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);
module.exports = ShoppingList;