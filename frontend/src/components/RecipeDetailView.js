import React from 'react';

const RecipeDetailView = ({ recipe, userIngredients, missingIngredients = [] }) => {
  if (!recipe) return null;

  return (
    <div style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px', margin: '16px 0' }}>
      <h2>{recipe.title}</h2>
      <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: 'auto' }} />
      <p>
        <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
          Ссылка на оригинальный рецепт
        </a>
      </p>
      <h3>Ингредиенты:</h3>
      <ul>
        {recipe.extendedIngredients?.map((ing, index) => (
          <li key={index}>{ing.original}</li>
        ))}
      </ul>
      <h3>Недостающие ингредиенты:</h3>
      {missingIngredients.length > 0 ? (
        <ul>
          {missingIngredients.map((ing, index) => (
            <li key={index}>
              {ing}{' '}
              <a
                href={`https://arbuz.kz/ru/almaty/catalog/search?q=${encodeURIComponent(ing)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Найти на Arbuz.kz
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>Все ингредиенты в наличии!</p>
      )}
    </div>
  );
};

export default RecipeDetailView; 