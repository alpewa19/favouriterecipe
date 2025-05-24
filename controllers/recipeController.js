const { analyzeImage } = require('../services/geminiService');
const {
  findRecipesByIngredients,
  getRecipeDetails,
  findMissingIngredients
} = require('../services/spoonacularService');

/**
 * Analyze image to identify ingredients
 */
async function analyzeImageController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const ingredients = await analyzeImage(req.file.buffer);
    res.json({ ingredients });
  } catch (error) {
    console.error('Error in analyzeImageController:', error);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
}

/**
 * Find recipes by ingredients
 */
async function findRecipesController(req, res) {
  try {
    const { ingredients, diet } = req.query;

    if (!ingredients) {
      return res.status(400).json({ error: 'Ingredients parameter is required' });
    }

    const recipes = await findRecipesByIngredients(ingredients, diet);
    res.json(recipes);
  } catch (error) {
    console.error('Error in findRecipesController:', error);
    res.status(500).json({ error: 'Failed to find recipes' });
  }
}

/**
 * Get recipe details and missing ingredients
 */
async function getRecipeDetailsController(req, res) {
  try {
    const { id } = req.params;
    const { userIngredients } = req.query;

    if (!userIngredients) {
      return res.status(400).json({ error: 'User ingredients parameter is required' });
    }

    const recipeDetails = await getRecipeDetails(id);
    const missingIngredients = findMissingIngredients(
      recipeDetails.extendedIngredients,
      userIngredients
    );

    const response = {
      id: recipeDetails.id,
      title: recipeDetails.title,
      imageUrl: recipeDetails.image,
      recipeUrl: recipeDetails.sourceUrl,
      fullIngredients: recipeDetails.extendedIngredients.map(ing => ({
        original: ing.original,
        name: ing.name
      })),
      missingIngredients
    };

    res.json(response);
  } catch (error) {
    console.error('Error in getRecipeDetailsController:', error);
    res.status(500).json({ error: 'Failed to get recipe details' });
  }
}

module.exports = {
  analyzeImageController,
  findRecipesController,
  getRecipeDetailsController
}; 