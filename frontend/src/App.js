import React, { useState } from 'react';
import IngredientInput from './components/IngredientInput';
import Filters from './components/Filters';
import RecipeList from './components/RecipeList';
import RecipeDetailView from './components/RecipeDetailView';
import { findRecipes, getRecipeDetails } from './services/api';

function App() {
  const [ingredients, setIngredients] = useState('');
  const [diet, setDiet] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [missingIngredients, setMissingIngredients] = useState([]);

  const handleIngredientsChange = (newIngredients) => {
    setIngredients(newIngredients);
  };

  const handleDietChange = (newDiet) => {
    setDiet(newDiet);
  };

  const handleSearch = async () => {
    if (!ingredients) {
      setError('Введите ингредиенты');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSelectedRecipe(null);
    try {
      let res = await findRecipes(ingredients, diet);
      // Сортировка: сначала блюда без недостающих ингредиентов, затем 1-3, затем остальные
      res = res.sort((a, b) => {
        if (a.missedIngredientCount === 0 && b.missedIngredientCount !== 0) return -1;
        if (a.missedIngredientCount !== 0 && b.missedIngredientCount === 0) return 1;
        if (a.missedIngredientCount <= 3 && b.missedIngredientCount > 3) return -1;
        if (a.missedIngredientCount > 3 && b.missedIngredientCount <= 3) return 1;
        return a.missedIngredientCount - b.missedIngredientCount;
      });
      setRecipes(res);
    } catch (err) {
      setError('Ошибка при поиске рецептов');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipeClick = async (recipeId) => {
    setIsLoading(true);
    setError(null);
    try {
      const recipe = await getRecipeDetails(recipeId);
      let missing = [];
      if (ingredients) {
        const userList = ingredients
          .split(',')
          .map((i) => i.trim().toLowerCase())
          .filter(Boolean);
        missing = recipe.extendedIngredients
          .map((i) => i.name.toLowerCase())
          .filter((i) => !userList.includes(i));
      }
      setMissingIngredients(missing);
      setSelectedRecipe(recipe);
    } catch (err) {
      setError('Ошибка при получении деталей рецепта');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
      <h1>Favorite Recipe</h1>
      <IngredientInput onIngredientsChange={handleIngredientsChange} />
      <Filters diet={diet} onDietChange={handleDietChange} />
      <button onClick={handleSearch} disabled={isLoading}>
        Найти рецепты
      </button>
      {isLoading && <p>Загрузка...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <RecipeList recipes={recipes} onRecipeClick={handleRecipeClick} />
      <RecipeDetailView
        recipe={selectedRecipe}
        userIngredients={ingredients}
        missingIngredients={missingIngredients}
      />
    </div>
  );
}

export default App;
