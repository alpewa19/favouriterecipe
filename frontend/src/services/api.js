import axios from 'axios';

// Анализ изображения через backend (Cloud Vision)
export const analyzeImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const res = await axios.post('/api/analyze-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.ingredients;
};

// Поиск рецептов через Spoonacular
export const findRecipes = async (ingredients, diet) => {
  const params = {
    ingredients,
    number: 10,
    apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
  };
  // Spoonacular поддерживает: vegetarian, vegan, gluten free, ketogenic
  if (diet && ["vegetarian","vegan","gluten free","ketogenic"].includes(diet)) {
    params.diet = diet;
  }
  const res = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', { params });
  return res.data;
};

// Получение деталей рецепта через Spoonacular
export const getRecipeDetails = async (recipeId) => {
  const params = { apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY };
  const res = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, { params });
  return res.data;
}; 