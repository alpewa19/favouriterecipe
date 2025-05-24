<<<<<<< HEAD
# Favorite Recipe Backend

This is the backend service for the Favorite Recipe application, which helps users find recipes based on their available ingredients.

## Features

- Image analysis using Google Gemini Pro Vision API
- Recipe search using Spoonacular API
- Missing ingredients detection
- Integration with Arbuz.kz for ingredient shopping

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   # API Keys
   GEMINI_API_KEY=your_gemini_api_key_here
   SPOONACULAR_API_KEY=your_spoonacular_api_key_here

   # Server Configuration
   PORT=3001
   NODE_ENV=development
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### POST /api/analyze-image
Analyzes an image to identify food ingredients.

**Request:**
- Content-Type: multipart/form-data
- Body: `image` (file)

**Response:**
```json
{
  "ingredients": "tomato, onion, garlic"
}
```

### GET /api/find-recipes
Searches for recipes based on ingredients.

**Query Parameters:**
- `ingredients` (required): Comma-separated list of ingredients
- `diet` (optional): Diet type (e.g., "vegan", "vegetarian")

**Response:**
```json
[
  {
    "id": 123,
    "title": "Recipe Title",
    "image": "image_url",
    "usedIngredientCount": 3,
    "missedIngredientCount": 2
  }
]
```

### GET /api/recipe-details/:id
Gets detailed information about a specific recipe.

**Query Parameters:**
- `userIngredients` (required): Comma-separated list of user's ingredients

**Response:**
```json
{
  "id": 123,
  "title": "Recipe Title",
  "imageUrl": "image_url",
  "recipeUrl": "source_url",
  "fullIngredients": [
    {
      "original": "1 cup chopped tomatoes",
      "name": "tomatoes"
    }
  ],
  "missingIngredients": ["garlic", "onion"]
}
```

## Error Handling

All endpoints return appropriate HTTP status codes and error messages in case of failure:

```json
{
  "error": "Error message"
}
``` 
=======
# nFactorial-Ai-Cup-2025
Fork this repository and build nFactorial Ai Cup 2025 projects 

## < Your Name >

## < Your App's Name >

## < Your App's description, technical considerations, etc. >


## Typeform to submit:
https://docs.google.com/forms/d/e/1FAIpQLSdjbTZXt-8P0OTyMEDTQDszE-YGI5KcLYsN6pwxHmX0Fa3tzg/viewform?usp=dialog

## DEADLINE: 25/05/2025 10:00
>>>>>>> 0b3cb795807cdef38574afc4cbf6687e0ed6b406
