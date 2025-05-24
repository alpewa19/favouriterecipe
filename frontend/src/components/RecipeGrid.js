import React from 'react';
import './RecipeGrid.css';

const RecipeGrid = ({ recipes, onRecipeSelect, onNewSearch }) => {
  return (
    <div className="recipe-grid-chat">
      <div className="recipes-container">
        {recipes.map(recipe => (
          <div 
            key={recipe.id} 
            className="recipe-card-chat"
            onClick={() => onRecipeSelect(recipe)}
          >
            <div className="recipe-image">
              <img src={recipe.image} alt={recipe.title} />
            </div>
            
            <div className="recipe-info">
              <h3 className="recipe-title">{recipe.title}</h3>
              
              <div className="recipe-stats">
                <div className="stat">
                  <span className="stat-icon">✅</span>
                  <span>{recipe.usedIngredientCount} have</span>
                </div>
                
                {recipe.missedIngredientCount > 0 ? (
                  <div className="stat missing">
                    <span className="stat-icon">❌</span>
                    <span>{recipe.missedIngredientCount} missing</span>
                  </div>
                ) : (
                  <div className="stat perfect">
                    <span className="stat-icon">🎯</span>
                    <span>Ready to cook!</span>
                  </div>
                )}
              </div>
              
              {recipe.missedIngredientCount === 0 && (
                <div className="perfect-match">🔥 Can cook right now!</div>
              )}
              
              {recipe.missedIngredientCount > 0 && recipe.missedIngredientCount <= 3 && (
                <div className="almost-perfect">💡 Only {recipe.missedIngredientCount} ingredient{recipe.missedIngredientCount > 1 ? 's' : ''} needed</div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <button 
        className="new-search-button"
        onClick={onNewSearch}
      >
        🔄 New search
      </button>
    </div>
  );
};

export default RecipeGrid; 