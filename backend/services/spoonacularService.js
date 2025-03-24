// services/spoonacularService.js
const axios = require('axios');

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

// Search recipes from Spoonacular
const searchRecipes = async (query, diet, intolerances, number = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes/complexSearch`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        query,
        diet,
        intolerances,
        number,
        addRecipeInformation: true,
        instructionsRequired: true
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};

// Get recipe information by ID
const getRecipeInformation = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes/${id}/information`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        includeNutrition: true
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting recipe information:', error);
    throw error;
  }
};

// Extract recipe from URL
const extractRecipeFromUrl = async (url) => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes/extract`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        url,
        forceExtraction: true
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error extracting recipe:', error);
    throw error;
  }
};

module.exports = {
  searchRecipes,
  getRecipeInformation,
  extractRecipeFromUrl
};