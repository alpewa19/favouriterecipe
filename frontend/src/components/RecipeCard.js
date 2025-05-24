import React from 'react';

const RecipeCard = ({ recipe, onClick }) => {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        margin: '8px',
        cursor: 'pointer',
        width: 250
      }}
      onClick={() => onClick(recipe.id)}
    >
      <h3>{recipe.title}</h3>
      <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: 'auto' }} />
      <p>Использовано ингредиентов: {recipe.usedIngredientCount}</p>
      <p>Не хватает ингредиентов: {recipe.missedIngredientCount}</p>
    </div>
  );
};

export default RecipeCard; 