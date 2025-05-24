const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

class ArbuzService {
  constructor(options = {}) {
    this.driver = null;
    this.debug = options.debug || false;
  }

  async initDriver() {
    if (!this.driver) {
      const options = new chrome.Options();
      
      if (!this.debug) {
        options.addArguments('--headless');
      }
      
      options.addArguments('--no-sandbox');
      options.addArguments('--disable-dev-shm-usage');
      options.addArguments('--disable-gpu');
      options.addArguments('--window-size=1920,1080');
      options.addArguments('--disable-web-security');
      options.addArguments('--allow-running-insecure-content');
      options.addArguments('--disable-blink-features=AutomationControlled');
      options.addArguments('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      this.driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
    }
    return this.driver;
  }

  async searchProduct(ingredientName) {
    try {
      await this.initDriver();
      
      const translatedIngredient = translateIngredient(ingredientName);
      console.log(`🔍 Поиск товара на Arbuz.kz: ${ingredientName} -> ${translatedIngredient}`);
      
      // 1. Переходим на главную страницу Arbuz.kz
      console.log('🏠 Переходим на главную страницу...');
      await this.driver.get('https://arbuz.kz');
      await this.driver.sleep(3000);
      
      // 2. Ищем поле поиска с правильным placeholder
      console.log('🔍 Ищем поле поиска "Искать в arbuz"...');
      const searchSelectors = [
        'input[placeholder="Искать в arbuz"]',
        'input[placeholder*="Искать в arbuz"]',
        'input[placeholder*="искать в arbuz"]',
        'input[placeholder*="arbuz"]',
        'input[name="q"]',
        'input[name="search"]',
        '.search-input',
        '.header-search input[type="text"]',
        'input[type="text"]:first-of-type'
      ];
      
      let searchInput = null;
      for (const selector of searchSelectors) {
        try {
          searchInput = await this.driver.findElement(By.css(selector));
          const placeholder = await searchInput.getAttribute('placeholder');
          console.log(`✅ Найдено поле поиска: ${selector} (placeholder: "${placeholder}")`);
          break;
        } catch (error) {
          continue;
        }
      }
      
      if (!searchInput) {
        console.log('❌ Поле поиска не найдено, используем прямую ссылку');
        const searchUrl = `https://arbuz.kz/ru/almaty/search?q=${encodeURIComponent(translatedIngredient)}`;
        return {
          type: 'search',
          url: searchUrl,
          searchUrl: searchUrl,
          translatedIngredient: translatedIngredient,
          originalIngredient: ingredientName,
          store: 'Arbuz.kz',
          reason: 'search_field_not_found'
        };
      }
      
      // 3. Вводим ингредиент в поле поиска
      console.log(`⌨️ Вводим "${translatedIngredient}" в поле поиска...`);
      await searchInput.clear();
      await searchInput.sendKeys(translatedIngredient);
      await this.driver.sleep(1000);
      
      // 4. Нажимаем Enter или ищем кнопку поиска
      console.log('🔘 Запускаем поиск...');
      try {
        // Сначала пробуем нажать Enter
        await searchInput.sendKeys(Key.RETURN);
        await this.driver.sleep(3000);
      } catch (error) {
        console.log('⚠️ Enter не сработал, ищем кнопку поиска...');
        
        // Ищем кнопку поиска
        const searchButtonSelectors = [
          'button[type="submit"]',
          '.search-button',
          '.header-search button',
          'button[data-testid="search-button"]',
          '.search-form button',
          'form button'
        ];
        
        let searchButton = null;
        for (const selector of searchButtonSelectors) {
          try {
            searchButton = await this.driver.findElement(By.css(selector));
            console.log(`✅ Найдена кнопка поиска: ${selector}`);
            await searchButton.click();
            break;
          } catch (error) {
            continue;
          }
        }
      }
      
      // 5. Ждем загрузки результатов поиска
      console.log('⏳ Ждем загрузки результатов поиска...');
      await this.driver.sleep(5000);
      
      // Получаем текущий URL для проверки
      const currentUrl = await this.driver.getCurrentUrl();
      console.log(`🌐 Текущий URL: ${currentUrl}`);
      
      // 6. Проверяем, есть ли релевантные результаты
      console.log('📄 Проверяем релевантность результатов...');
      let hasRelevantResults = false;
      try {
        const bodyText = await this.driver.findElement(By.css('body')).getText();
        const lowerBodyText = bodyText.toLowerCase();
        const lowerIngredient = translatedIngredient.toLowerCase();
        
        if (lowerBodyText.includes(lowerIngredient)) {
          hasRelevantResults = true;
          console.log('✅ Найдены релевантные результаты поиска');
        } else {
          console.log('⚠️ Релевантные результаты не найдены');
        }
      } catch (error) {
        console.log('⚠️ Не удалось проверить релевантность результатов');
      }
      
      // 7. Ищем товары на странице результатов
      console.log('🛍️ Ищем товары на странице результатов...');
      const productSelectors = [
        'a[href*="/ru/almaty/product/"]',
        'a[href*="/product/"]',
        '.product-card a',
        '.item-card a', 
        '.product-item a',
        '[data-testid="product-link"]',
        '.catalog-item a',
        '.goods-tile a',
        'a[href*="/goods/"]',
        '.product a',
        '.item a',
        'a.product-link',
        'a.item-link'
      ];
      
      let foundProducts = [];
      
      for (const selector of productSelectors) {
        try {
          console.log(`🔍 Ищем товары с селектором: ${selector}`);
          const products = await this.driver.findElements(By.css(selector));
          console.log(`   Найдено элементов: ${products.length}`);
          
          for (let product of products.slice(0, 3)) {
            try {
              const href = await product.getAttribute('href');
              if (href && (href.includes('/product/') || href.includes('/goods/') || href.includes('/item/'))) {
                const fullUrl = href.startsWith('http') ? href : `https://arbuz.kz${href}`;
                
                // Дополнительная проверка - пытаемся получить текст ссылки
                const linkText = await product.getText();
                console.log(`🔗 Найден товар: ${fullUrl} | "${linkText}"`);
                
                foundProducts.push({
                  url: fullUrl,
                  text: linkText
                });
              }
            } catch (error) {
              continue;
            }
          }
          
          if (foundProducts.length > 0) break;
        } catch (error) {
          console.log(`❌ Селектор ${selector} не сработал: ${error.message}`);
          continue;
        }
      }
      
      // 8. Возвращаем результат
      if (foundProducts.length > 0 && hasRelevantResults) {
        const firstProduct = foundProducts[0];
        const alternativeUrls = foundProducts.slice(1).map(p => p.url);
        
        console.log(`✅ Найден товар: ${firstProduct.url}`);
        
        return {
          type: 'product',
          url: firstProduct.url,
          searchUrl: currentUrl,
          translatedIngredient: translatedIngredient,
          originalIngredient: ingredientName,
          alternativeProducts: alternativeUrls,
          foundProductsCount: foundProducts.length,
          store: 'Arbuz.kz',
          productText: firstProduct.text
        };
      }
      
      // Если товары не найдены - возвращаем ссылку поиска
      console.log('📋 Товары не найдены, возвращаем ссылку поиска');
      return {
        type: 'search',
        url: currentUrl,
        searchUrl: currentUrl,
        translatedIngredient: translatedIngredient,
        originalIngredient: ingredientName,
        store: 'Arbuz.kz',
        reason: hasRelevantResults ? 'no_products_found' : 'no_relevant_results'
      };
      
    } catch (error) {
      console.error('❌ Ошибка при поиске на Arbuz.kz:', error.message);
      
      // В случае ошибки возвращаем простую ссылку поиска
      const translatedIngredient = translateIngredient(ingredientName);
      const query = encodeURIComponent(translatedIngredient);
      return {
        type: 'fallback',
        url: `https://arbuz.kz/ru/almaty/search?q=${query}`,
        searchUrl: `https://arbuz.kz/ru/almaty/search?q=${query}`,
        translatedIngredient: translatedIngredient,
        originalIngredient: ingredientName,
        store: 'Arbuz.kz',
        error: error.message
      };
    }
  }

  async searchMultipleIngredients(ingredients) {
    const results = [];
    
    for (const ingredient of ingredients) {
      const result = await this.searchProduct(ingredient);
      results.push({
        ingredient: ingredient,
        ...result
      });
      
      // Пауза между запросами
      await this.driver?.sleep(2000);
    }
    
    return results;
  }

  async close() {
    if (this.driver) {
      await this.driver.quit();
      this.driver = null;
    }
  }

  // Метод для получения информации о товаре
  async getProductInfo(productUrl) {
    try {
      await this.initDriver();
      await this.driver.get(productUrl);
      await this.driver.sleep(3000);
      
      let title = 'Товар';
      let price = '';
      
      try {
        const titleSelectors = [
          'h1',
          '.product-title',
          '.product-name',
          '[data-testid="product-title"]',
          '.goods-tile__title'
        ];
        
        for (const selector of titleSelectors) {
          try {
            const titleElement = await this.driver.findElement(By.css(selector));
            title = await titleElement.getText();
            if (title && title.trim()) break;
          } catch (error) {
            continue;
          }
        }
      } catch (error) {
        console.log('Заголовок товара не найден');
      }
      
      try {
        const priceSelectors = [
          '.price',
          '.product-price',
          '.current-price',
          '[data-testid="price"]',
          '.price-current',
          '.goods-tile__price'
        ];
        
        for (const selector of priceSelectors) {
          try {
            const priceElement = await this.driver.findElement(By.css(selector));
            price = await priceElement.getText();
            if (price && price.trim()) break;
          } catch (error) {
            continue;
          }
        }
      } catch (error) {
        console.log('Цена товара не найдена');
      }
      
      return {
        title: title.trim(),
        price: price.trim(),
        url: productUrl
      };
    } catch (error) {
      console.error('Ошибка при получении информации о товаре:', error);
      return null;
    }
  }
}

// Расширенный словарь перевода ингредиентов
const ingredientTranslations = {
  // Мясо и птица
  'chicken': 'курица',
  'chicken breast': 'куриная грудка',
  'chicken thigh': 'куриное бедро',
  'beef': 'говядина',
  'ground beef': 'говяжий фарш',
  'pork': 'свинина',
  'turkey': 'индейка',
  'lamb': 'баранина',
  'fish': 'рыба',
  'salmon': 'лосось',
  'tuna': 'тунец',
  'cod': 'треска',
  'shrimp': 'креветки',
  'bacon': 'бекон',
  'ham': 'ветчина',
  'sausage': 'колбаса',
  
  // Овощи
  'onion': 'лук репчатый',
  'onions': 'лук репчатый',
  'red onion': 'красный лук',
  'garlic': 'чеснок',
  'tomato': 'помидоры',
  'tomatoes': 'помидоры',
  'cherry tomatoes': 'помидоры черри',
  'potato': 'картофель',
  'potatoes': 'картофель',
  'sweet potato': 'батат',
  'carrot': 'морковь',
  'carrots': 'морковь',
  'bell pepper': 'болгарский перец',
  'red pepper': 'красный перец',
  'green pepper': 'зеленый перец',
  'pepper': 'перец',
  'cucumber': 'огурцы',
  'cucumbers': 'огурцы',
  'cabbage': 'капуста',
  'broccoli': 'брокколи',
  'cauliflower': 'цветная капуста',
  'spinach': 'шпинат',
  'lettuce': 'салат листовой',
  'mushroom': 'грибы',
  'mushrooms': 'грибы',
  'white mushrooms': 'шампиньоны',
  'corn': 'кукуруза',
  'peas': 'горошек',
  'green beans': 'стручковая фасоль',
  'celery': 'сельдерей',
  'zucchini': 'кабачки',
  'eggplant': 'баклажаны',
  'avocado': 'авокадо',
  
  // Фрукты и ягоды
  'apple': 'яблоки',
  'apples': 'яблоки',
  'banana': 'бананы',
  'bananas': 'бананы',
  'orange': 'апельсины',
  'oranges': 'апельсины',
  'lemon': 'лимоны',
  'lemons': 'лимоны',
  'lime': 'лайм',
  'strawberry': 'клубника',
  'strawberries': 'клубника',
  'blueberries': 'черника',
  'raspberries': 'малина',
  'grape': 'виноград',
  'grapes': 'виноград',
  'pineapple': 'ананас',
  'mango': 'манго',
  'kiwi': 'киви',
  
  // Молочные продукты
  'milk': 'молоко',
  'whole milk': 'молоко цельное',
  'skim milk': 'обезжиренное молоко',
  'cheese': 'сыр',
  'cheddar cheese': 'сыр чеддер',
  'mozzarella': 'моцарелла',
  'parmesan': 'пармезан',
  'cottage cheese': 'творог',
  'cream cheese': 'сливочный сыр',
  'butter': 'масло сливочное',
  'cream': 'сливки',
  'heavy cream': 'жирные сливки',
  'sour cream': 'сметана',
  'yogurt': 'йогурт',
  'greek yogurt': 'греческий йогурт',
  'egg': 'яйца',
  'eggs': 'яйца',
  'egg whites': 'яичные белки',
  
  // Крупы и зерновые
  'rice': 'рис',
  'white rice': 'белый рис',
  'brown rice': 'коричневый рис',
  'pasta': 'макароны',
  'spaghetti': 'спагетти',
  'penne': 'пенне',
  'bread': 'хлеб',
  'white bread': 'белый хлеб',
  'whole wheat bread': 'цельнозерновой хлеб',
  'flour': 'мука',
  'all-purpose flour': 'мука пшеничная',
  'whole wheat flour': 'цельнозерновая мука',
  'oats': 'овсянка',
  'rolled oats': 'овсяные хлопья',
  'quinoa': 'киноа',
  'barley': 'ячмень',
  'buckwheat': 'гречка',
  
  // Бобовые и орехи
  'beans': 'фасоль',
  'black beans': 'черная фасоль',
  'kidney beans': 'красная фасоль',
  'chickpeas': 'нут',
  'lentils': 'чечевица',
  'almonds': 'миндаль',
  'walnuts': 'грецкие орехи',
  'peanuts': 'арахис',
  'cashews': 'кешью',
  'pistachios': 'фисташки',
  
  // Специи и приправы
  'salt': 'соль',
  'black pepper': 'черный перец',
  'white pepper': 'белый перец',
  'paprika': 'паприка',
  'cumin': 'зира',
  'oregano': 'орегано',
  'basil': 'базилик',
  'thyme': 'тимьян',
  'rosemary': 'розмарин',
  'parsley': 'петрушка',
  'dill': 'укроп',
  'cilantro': 'кинза',
  'bay leaves': 'лавровый лист',
  'cinnamon': 'корица',
  'nutmeg': 'мускатный орех',
  'ginger': 'имбирь',
  'turmeric': 'куркума',
  'curry powder': 'карри',
  'chili powder': 'молотый чили',
  'red pepper flakes': 'хлопья красного перца',
  
  // Масла и жиры
  'oil': 'растительное масло',
  'olive oil': 'оливковое масло',
  'extra virgin olive oil': 'оливковое масло extra virgin',
  'vegetable oil': 'растительное масло',
  'canola oil': 'рапсовое масло',
  'coconut oil': 'кокосовое масло',
  'sesame oil': 'кунжутное масло',
  
  // Соусы и приправы
  'soy sauce': 'соевый соус',
  'worcestershire sauce': 'вустерский соус',
  'hot sauce': 'острый соус',
  'ketchup': 'кетчуп',
  'mustard': 'горчица',
  'mayonnaise': 'майонез',
  'vinegar': 'уксус',
  'balsamic vinegar': 'бальзамический уксус',
  'apple cider vinegar': 'яблочный уксус',
  
  // Сладости и выпечка
  'sugar': 'сахар',
  'brown sugar': 'коричневый сахар',
  'powdered sugar': 'сахарная пудра',
  'honey': 'мед',
  'maple syrup': 'кленовый сироп',
  'vanilla': 'ваниль',
  'vanilla extract': 'ванильный экстракт',
  'chocolate': 'шоколад',
  'dark chocolate': 'темный шоколад',
  'cocoa powder': 'какао порошок',
  'baking powder': 'разрыхлитель',
  'baking soda': 'сода',
  
  // Напитки
  'wine': 'вино',
  'white wine': 'белое вино',
  'red wine': 'красное вино',
  'beer': 'пиво',
  'water': 'вода',
  'chicken stock': 'куриный бульон',
  'beef stock': 'говяжий бульон',
  'vegetable stock': 'овощной бульон',
  'broth': 'бульон',
  
  // Консервы
  'canned tomatoes': 'консервированные помидоры',
  'tomato paste': 'томатная паста',
  'tomato sauce': 'томатный соус',
  'coconut milk': 'кокосовое молоко',
  'canned beans': 'консервированная фасоль'
};

function translateIngredient(ingredient) {
  const lower = ingredient.toLowerCase().trim();
  
  // Убираем лишние слова и символы
  const cleanIngredient = lower
    .replace(/\(.*?\)/g, '') // убираем скобки и их содержимое
    .replace(/,.*$/, '') // убираем запятую и всё после неё
    .replace(/\s+/g, ' ') // заменяем множественные пробелы одним
    .trim();
  
  // Ищем точное совпадение
  if (ingredientTranslations[cleanIngredient]) {
    return ingredientTranslations[cleanIngredient];
  }
  
  // Ищем частичное совпадение (сначала более длинные совпадения)
  const sortedKeys = Object.keys(ingredientTranslations).sort((a, b) => b.length - a.length);
  
  for (const english of sortedKeys) {
    if (cleanIngredient.includes(english) || english.includes(cleanIngredient)) {
      return ingredientTranslations[english];
    }
  }
  
  // Если перевод не найден, возвращаем оригинал
  return ingredient;
}

module.exports = { ArbuzService, translateIngredient }; 