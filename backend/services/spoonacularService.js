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
      ingredients,
      number: 20,
      apiKey: process.env.SPOONACULAR_API_KEY,
      ranking: 2,
      ignorePantry: true,
      limitLicense: false
    };

    if (diet) {
      params.diet = diet;
    }

    const response = await axios.get(`${BASE_URL}/findByIngredients`, { params });
    
    const filteredRecipes = response.data
      .filter(recipe => {
        return recipe.missedIngredientCount <= 5;
      })
      .sort((a, b) => {
        if (a.missedIngredientCount === 0 && b.missedIngredientCount !== 0) return -1;
        if (a.missedIngredientCount !== 0 && b.missedIngredientCount === 0) return 1;
        
        if (a.missedIngredientCount <= 3 && b.missedIngredientCount > 3) return -1;
        if (a.missedIngredientCount > 3 && b.missedIngredientCount <= 3) return 1;
        
        const missedDiff = a.missedIngredientCount - b.missedIngredientCount;
        if (missedDiff !== 0) return missedDiff;
        
        return b.usedIngredientCount - a.usedIngredientCount;
      })
      .slice(0, 10);

    return filteredRecipes;
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
        apiKey: process.env.SPOONACULAR_API_KEY
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