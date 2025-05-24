const axios = require('axios');

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

/**
 * Search recipes by ingredients
 * @param {string} ingredients - Comma-separated list of ingredients
 * @param {string} [diet] - Optional diet type (e.g., 'vegan', 'vegetarian')
 * @returns {Promise<Array>} - Array of recipe objects
 */
async function findRecipesByIngredients(ingredients, diet = null) {
  try {
    const params = {
      apiKey: SPOONACULAR_API_KEY,
      ingredients,
      number: 10,
      ranking: 1,
      ignorePantry: true
    };

    if (diet) {
      params.diet = diet;
    }

    const response = await axios.get(`${BASE_URL}/findByIngredients`, { params });
    return response.data;
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw new Error('Failed to search recipes');
  }
}

/**
 * Get detailed recipe information
 * @param {number} recipeId - The ID of the recipe
 * @returns {Promise<Object>} - Detailed recipe information
 */
async function getRecipeDetails(recipeId) {
  try {
    const response = await axios.get(`${BASE_URL}/${recipeId}/information`, {
      params: {
        apiKey: SPOONACULAR_API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting recipe details:', error);
    throw new Error('Failed to get recipe details');
  }
}

/**
 * Find missing ingredients by comparing recipe ingredients with user's ingredients
 * @param {Array} recipeIngredients - Array of recipe ingredient objects
 * @param {string} userIngredientsString - Comma-separated list of user's ingredients
 * @returns {Array} - Array of missing ingredient names
 */
function findMissingIngredients(recipeIngredients, userIngredientsString) {
  const userIngredients = userIngredientsString
    .toLowerCase()
    .split(',')
    .map(ing => ing.trim());

  return recipeIngredients
    .filter(ingredient => {
      const ingredientName = ingredient.name.toLowerCase();
      return !userIngredients.some(userIng => ingredientName.includes(userIng));
    })
    .map(ingredient => ingredient.name);
}

module.exports = {
  findRecipesByIngredients,
  getRecipeDetails,
  findMissingIngredients
}; 