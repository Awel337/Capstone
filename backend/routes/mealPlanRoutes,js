// routes/mealPlanRoutes.js
const express = require('express');
const {
  createMealPlan,
  getMealPlans,
  getMealPlanById,
  updateMealPlan,
  deleteMealPlan
} = require('../controllers/mealPlanController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createMealPlan)
  .get(protect, getMealPlans);

router.route('/:id')
  .get(protect, getMealPlanById)
  .put(protect, updateMealPlan)
  .delete(protect, deleteMealPlan);

module.exports = router;