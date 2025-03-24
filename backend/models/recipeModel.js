// models/recipeModel.js
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  ingredients: [{
    name: { type: String, required: true },
    amount: { type: String, required: true },
    unit: { type: String }
  }],
  instructions: [{
    step: Number,
    text: String
  }],
  cookTime: {
    type: Number,
    min: 0
  },
  prepTime: {
    type: Number,
    min: 0
  },
  servings: {
    type: Number,
    min: 1
  },
  imageUrl: {
    type: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Indexes for search efficiency
recipeSchema.index({ title: 'text', tags: 'text' });
recipeSchema.index({ createdBy: 1 });

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;