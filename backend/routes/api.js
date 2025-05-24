const express = require('express');
const router = express.Router();
const { ArbuzService, translateIngredient } = require('../services/arbuzService');

// НЕ создаем глобальный экземпляр - будем создавать для каждого запроса

// Endpoint для получения ссылок на товары Arbuz.kz
router.post('/arbuz-links', async (req, res) => {
  let arbuzService = null;
  
  try {
    const { ingredients } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: 'Необходимо предоставить массив ингредиентов' });
    }

    console.log('Поиск товаров на Arbuz.kz для ингредиентов:', ingredients);
    
    // Создаем новый экземпляр для этого запроса
    arbuzService = new ArbuzService();
    
    const results = [];
    
    for (const ingredient of ingredients) {
      console.log(`Поиск: ${ingredient}`);
      
      try {
        // Передаем оригинальный английский ингредиент, перевод происходит внутри searchProduct
        const result = await arbuzService.searchProduct(ingredient);
        results.push({
          originalIngredient: ingredient,
          ...result
        });
        
        // Небольшая пауза между запросами
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Ошибка поиска для ${ingredient}:`, error);
        // В случае ошибки добавляем fallback ссылку
        const translatedIngredient = translateIngredient(ingredient);
        const query = encodeURIComponent(translatedIngredient);
        results.push({
          originalIngredient: ingredient,
          translatedIngredient: translatedIngredient,
          type: 'fallback',
          url: `https://arbuz.kz/ru/almaty/search?q=${query}`,
          searchUrl: `https://arbuz.kz/ru/almaty/search?q=${query}`,
          store: 'Arbuz.kz'
        });
      }
    }
    
    res.json({ results });
    
  } catch (error) {
    console.error('Ошибка при поиске на Arbuz.kz:', error);
    res.status(500).json({ error: 'Ошибка при поиске товаров на Arbuz.kz' });
  } finally {
    // Обязательно закрываем браузер для этого запроса
    if (arbuzService) {
      try {
        await arbuzService.close();
      } catch (error) {
        console.error('Ошибка при закрытии браузера:', error);
      }
    }
  }
});

// Endpoint для получения одной ссылки на товар
router.post('/arbuz-link', async (req, res) => {
  let arbuzService = null;
  
  try {
    const { ingredient } = req.body;
    
    if (!ingredient) {
      return res.status(400).json({ error: 'Необходимо предоставить ингредиент' });
    }

    const translatedIngredient = translateIngredient(ingredient);
    console.log(`Поиск одного товара: ${ingredient} -> ${translatedIngredient}`);
    
    // Создаем новый экземпляр для этого запроса
    arbuzService = new ArbuzService();
    const result = await arbuzService.searchProduct(ingredient);
    
    res.json({
      originalIngredient: ingredient,
      ...result
    });
    
  } catch (error) {
    console.error('Ошибка при поиске товара:', error);
    
    // В случае ошибки возвращаем fallback ссылку
    const translatedIngredient = translateIngredient(ingredient);
    const query = encodeURIComponent(translatedIngredient);
    res.json({
      originalIngredient: ingredient,
      translatedIngredient: translatedIngredient,
      type: 'fallback',
      url: `https://arbuz.kz/ru/almaty/search?q=${query}`,
      searchUrl: `https://arbuz.kz/ru/almaty/search?q=${query}`,
      store: 'Arbuz.kz'
    });
  } finally {
    // Обязательно закрываем браузер для этого запроса
    if (arbuzService) {
      try {
        await arbuzService.close();
      } catch (error) {
        console.error('Ошибка при закрытии браузера:', error);
      }
    }
  }
});

// Single ingredient search for testing
router.get('/arbuz-links/:ingredient', async (req, res) => {
  try {
    const { ingredient } = req.params;
    
    if (!ingredient) {
      return res.status(400).json({ error: 'Ingredient parameter is required' });
    }

    // Translate ingredient to Russian for Arbuz.kz search
    const translatedIngredient = translateIngredient(ingredient);

    console.log(`Searching for single product: ${ingredient} -> ${translatedIngredient}`);
    
    const result = await arbuzService.searchProduct(ingredient);
    
    res.json({
      originalIngredient: ingredient,
      translatedIngredient: result.translatedIngredient,
      url: result.url,
      type: result.type
    });
    
  } catch (error) {
    console.error(`Error searching for ingredient ${req.params.ingredient}:`, error);
    res.status(500).json({ 
      error: 'Failed to search for ingredient',
      details: error.message 
    });
  }
});

module.exports = router; 