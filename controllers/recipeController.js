const { analyzeImage } = require('../services/moondreamService');
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
    res.status(500).json({ error: 'Failed to analyze image', details: error.message });
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
    
    // Log Spoonacular data for debugging
    console.log('Spoonacular recipe details:', {
      id: recipeDetails.id,
      title: recipeDetails.title,
      sourceUrl: recipeDetails.sourceUrl,
      spoonacularUrl: recipeDetails.spoonacularUrl,
      creditsText: recipeDetails.creditsText,
      sourceName: recipeDetails.sourceName,
      readyInMinutes: recipeDetails.readyInMinutes,
      servings: recipeDetails.servings
    });
    
    const missingIngredients = findMissingIngredients(
      recipeDetails.extendedIngredients,
      userIngredients
    );

    // Create Spoonacular recipe URL
    const spoonacularUrl = `https://spoonacular.com/recipes/${recipeDetails.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase()}-${recipeDetails.id}`;
    console.log('Created Spoonacular link:', spoonacularUrl);

    const response = {
      id: recipeDetails.id,
      title: recipeDetails.title,
      imageUrl: recipeDetails.image,
      spoonacularUrl: spoonacularUrl,
      creditsText: recipeDetails.creditsText,
      sourceName: recipeDetails.sourceName,
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