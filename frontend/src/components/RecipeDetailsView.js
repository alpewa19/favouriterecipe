import React, { useState, useEffect } from 'react';
import './RecipeDetailsView.css';

const RecipeDetailsView = ({ recipe, onNewSearch }) => {
  // Хуки должны быть вызваны в начале компонента перед любыми условными возвратами
  const [arbuzLinks, setArbuzLinks] = useState({});
  const [loadingLinks, setLoadingLinks] = useState(false);

  // Загружаем ссылки на товары при монтировании компонента
  useEffect(() => {
    if (recipe?.missingIngredients && recipe.missingIngredients.length > 0) {
      loadArbuzLinks();
    }
  }, [recipe?.missingIngredients]);

  // Условный возврат после вызова всех хуков
  if (!recipe) return null;

  // Дебаг информация для кнопки "Оригинальный рецепт"
  console.log('Recipe data:', {
    title: recipe.title,
    spoonacularUrl: recipe.spoonacularUrl,
    sourceUrl: recipe.sourceUrl,
    creditsText: recipe.creditsText
  });

  const loadArbuzLinks = async () => {
    if (!recipe.missingIngredients || recipe.missingIngredients.length === 0) return;
    
    setLoadingLinks(true);
    try {
      console.log('Loading links for ingredients:', recipe.missingIngredients);
      
      const response = await fetch('http://localhost:3001/api/arbuz-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: recipe.missingIngredients
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Got links:', data);
        
        // Convert results to object for quick access
        const linksMap = {};
        data.results.forEach(result => {
          linksMap[result.originalIngredient] = result;
        });
        
        setArbuzLinks(linksMap);
      } else {
        console.error('Error loading links:', response.statusText);
      }
    } catch (error) {
      console.error('Error loading links:', error);
    } finally {
      setLoadingLinks(false);
    }
  };

  // Dictionary for translating ingredients to Russian (fallback)
  const ingredientTranslations = {
    // Meat and poultry
    'chicken': 'курица',
    'beef': 'говядина',
    'pork': 'свинина',
    'turkey': 'индейка',
    'lamb': 'баранина',
    'fish': 'рыба',
    'salmon': 'лосось',
    'tuna': 'тунец',
    
    // Vegetables
    'onion': 'лук',
    'garlic': 'чеснок',
    'tomato': 'помидор',
    'potato': 'картофель',
    'carrot': 'морковь',
    'pepper': 'перец',
    'cucumber': 'огурец',
    'cabbage': 'капуста',
    'broccoli': 'брокколи',
    'spinach': 'шпинат',
    'lettuce': 'салат',
    'mushroom': 'грибы',
    'mushrooms': 'грибы',
    'corn': 'кукуруза',
    'peas': 'горох',
    
    // Fruits
    'apple': 'яблоко',
    'banana': 'банан',
    'orange': 'апельсин',
    'lemon': 'лимон',
    'lime': 'лайм',
    'strawberry': 'клубника',
    'grape': 'виноград',
    'grapes': 'виноград',
    
    // Dairy products
    'milk': 'молоко',
    'cheese': 'сыр',
    'butter': 'масло',
    'cream': 'сливки',
    'yogurt': 'йогурт',
    'egg': 'яйцо',
    'eggs': 'яйца',
    
    // Grains and cereals
    'rice': 'рис',
    'pasta': 'макароны',
    'bread': 'хлеб',
    'flour': 'мука',
    'oats': 'овсянка',
    'wheat': 'пшеница',
    
    // Spices and seasonings
    'salt': 'соль',
    'sugar': 'сахар',
    'cinnamon': 'корица',
    'paprika': 'паприка',
    'cumin': 'зира',
    'oregano': 'орегано',
    'basil': 'базилик',
    'thyme': 'тимьян',
    'rosemary': 'розмарин',
    'parsley': 'петрушка',
    'dill': 'укроп',
    
    // Oils and fats
    'oil': 'масло',
    'olive oil': 'оливковое масло',
    'vegetable oil': 'растительное масло',
    
    // Other
    'honey': 'мед',
    'vinegar': 'уксус',
    'wine': 'вино',
    'beer': 'пиво',
    'water': 'вода',
    'stock': 'бульон',
    'broth': 'бульон'
  };

  const translateIngredient = (ingredient) => {
    const lower = ingredient.toLowerCase();
    
    // Look for exact match
    if (ingredientTranslations[lower]) {
      return ingredientTranslations[lower];
    }
    
    // Look for partial match
    for (const [english, russian] of Object.entries(ingredientTranslations)) {
      if (lower.includes(english) || english.includes(lower)) {
        return russian;
      }
    }
    
    // If translation not found, return original
    return ingredient;
  };

  const generateArbuzLink = (ingredient) => {
    // Check if we have real link from Selenium
    if (arbuzLinks[ingredient] && arbuzLinks[ingredient].url) {
      return arbuzLinks[ingredient].url;
    }
    
    // Fallback to simple search link with correct URL format
    const translatedIngredient = translateIngredient(ingredient);
    const query = encodeURIComponent(translatedIngredient);
    return `https://arbuz.kz/ru/almaty/search?q=${query}`;
  };

  const getLinkText = (ingredient) => {
    if (loadingLinks) {
      return 'Loading...';
    }
    
    const linkData = arbuzLinks[ingredient];
    if (linkData) {
      switch (linkData.type) {
        case 'product':
          return 'Buy product 🛍️';
        case 'search':
          return 'Find on Arbuz.kz';
        default:
          return 'Find on Arbuz.kz';
      }
    }
    
    return 'Find on Arbuz.kz';
  };

  const openYouTubeCookingVideo = () => {
    // Create YouTube search query for cooking video
    const searchQuery = `how to cook ${recipe.title}`;
    const encodedQuery = encodeURIComponent(searchQuery);
    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodedQuery}`;
    
    // Open YouTube in new tab
    window.open(youtubeUrl, '_blank');
  };

  return (
    <div className="recipe-details-chat">
      <div className="recipe-header">
        <img src={recipe.imageUrl} alt={recipe.title} className="recipe-image-large" />
        <div className="recipe-title-section">
          <h2>{recipe.title}</h2>
          
          <div className="recipe-links">
            {(recipe.spoonacularUrl || recipe.sourceUrl) && (
              <a 
              href={recipe.spoonacularUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="recipe-link primary"
            >
              🔗 Original recipe
            </a>
            )}
            {!recipe.spoonacularUrl && !recipe.sourceUrl && (
              <div className="recipe-link disabled">
                🔗 Link unavailable
              </div>
            )}
            
            <button 
              className="recipe-link youtube-link"
              onClick={openYouTubeCookingVideo}
            >
              🎥 Show how to cook
            </button>
          </div>
        </div>
      </div>

      <div className="ingredients-section">
        <h3>📝 All ingredients:</h3>
        <ul className="ingredients-list">
          {recipe.fullIngredients?.map((ing, index) => (
            <li key={index}>{ing.original}</li>
          ))}
        </ul>
      </div>

      {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
        <div className="missing-ingredients-section">
          <h3>🛒 Need to buy:</h3>
          {loadingLinks && (
            <div className="loading-links">
              <small>🔍 Searching for products on Arbuz.kz...</small>
            </div>
          )}
          <div className="missing-ingredients">
            {recipe.missingIngredients.map((ingredient, index) => {
              const translatedIngredient = translateIngredient(ingredient);
              const linkData = arbuzLinks[ingredient];
              
              return (
                <div key={index} className="missing-ingredient">
                  <span>
                    {linkData?.translatedIngredient || translatedIngredient}
                    {(linkData?.translatedIngredient || translatedIngredient) !== ingredient && (
                      <small className="original-name"> ({ingredient})</small>
                    )}
                    {linkData?.type === 'product' && (
                      <small className="product-found"> ✅ product found</small>
                    )}
                  </span>
                  <a 
                    href={generateArbuzLink(ingredient)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`buy-link ${linkData?.type === 'product' ? 'product-link' : ''}`}
                    disabled={loadingLinks}
                  >
                    {getLinkText(ingredient)}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(!recipe.missingIngredients || recipe.missingIngredients.length === 0) && (
        <div className="no-missing-ingredients">
          🎉 You have all ingredients for this recipe!
        </div>
      )}

      <button 
        className="new-search-button"
        onClick={onNewSearch}
      >
        🔄 Find more recipes
      </button>
    </div>
  );
};

export default RecipeDetailsView; 