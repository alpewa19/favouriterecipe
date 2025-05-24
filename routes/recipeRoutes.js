const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  analyzeImageController,
  findRecipesController,
  getRecipeDetailsController
} = require('../controllers/recipeController');

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/analyze-image
router.post('/analyze-image', upload.single('image'), analyzeImageController);

// GET /api/find-recipes
router.get('/find-recipes', findRecipesController);

// GET /api/recipe-details/:id
router.get('/recipe-details/:id', getRecipeDetailsController);

module.exports = router; 