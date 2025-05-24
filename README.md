nFactorial-Ai-Cup-2025

Ruslan Alpenov

# 🍽️ FavouriteRecipe - Multimodal AI Recipe Application

AI-powered recipe finder that suggests recipes based on your available ingredients (from photos or text input) and provides shopping links for missing ingredients.

## 🌟 Features

- **🤖 AI Image Analysis**: Upload photos of your fridge/pantry to identify ingredients using Moondream AI
- **📝 Text Input**: Manually enter your available ingredients  
- **🔍 Recipe Search**: Find recipes using Spoonacular API based on your ingredients
- **🛒 Smart Shopping**: Get direct shopping links for missing ingredients on Arbuz.kz
- **🌐 Automated Shopping**: Selenium-powered web scraping for accurate product links
- **🎯 Diet Filters**: Support for various dietary preferences

## 🛠️ Technology Stack

**Frontend:**
- React 18
- CSS3 with modern styling
- Responsive design

**Backend:**
- Node.js + Express
- Selenium WebDriver (Chrome automation)
- Multer for file uploads

**APIs & Services:**
- [Spoonacular API](https://spoonacular.com/food-api) - Recipe database
- [Moondream AI](https://moondream.ai/) - Image analysis
- [Arbuz.kz](https://arbuz.kz) - Grocery shopping (automated)

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Google Chrome** browser (for Selenium automation)
- **Spoonacular API Key** ([Get here](https://spoonacular.com/food-api))
- **Moondream API Key** ([Get here](https://moondream.ai/))

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd favouriterecipe
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Environment Variables Setup

Create `.env` files in both backend and frontend directories:

**Backend `.env` file** (`backend/.env`):
```env
# Spoonacular API Key
# Get your API key from: https://spoonacular.com/food-api
SPOONACULAR_API_KEY=your_spoonacular_api_key_here

# Moondream API Key  
# Get your API key from: https://moondream.ai/
MOONDREAM_API_KEY=your_moondream_api_key_here

# Server Port
PORT=3001
```

**Frontend `.env` file** (`frontend/.env`):
```env
# React App Settings
REACT_APP_API_URL=http://localhost:3001
```

### 5. Chrome WebDriver Setup

The application uses Selenium with Chrome for automated shopping link generation. Chrome will be automatically managed by the application, but make sure you have Chrome browser installed.

## 🏃‍♂️ Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Backend will start on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend will start on `http://localhost:3000`

### Production Mode

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Start Backend:**
```bash
cd backend
npm start
```

## 📖 Usage Guide

### 1. **Upload Ingredient Photo**
- Click "📷 Загрузить фото" to upload an image of your ingredients
- AI will analyze the image and extract ingredients automatically

### 2. **Manual Ingredient Entry**
- Type your available ingredients in the text input
- Separate multiple ingredients with commas

### 3. **Find Recipes**
- Click "🔍 Найти рецепты" to search for matching recipes
- Optionally apply diet filters (vegetarian, vegan, etc.)

### 4. **View Recipe Details**
- Click on any recipe card to see detailed information
- View all ingredients and identify what you're missing

### 5. **Shop for Missing Ingredients**
- Click shopping links next to missing ingredients
- Links lead directly to Arbuz.kz product pages or search results

## 🏗️ Project Structure

```
favouriterecipe/
├── backend/
│   ├── services/
│   │   ├── arbuzService.js      # Arbuz.kz automation
│   │   ├── spoonacularService.js # Recipe API integration
│   │   └── moondreamService.js   # Image analysis
│   ├── controllers/
│   │   └── recipeController.js   # Recipe endpoints
│   ├── routes/
│   │   └── api.js               # API routes
│   ├── config/
│   │   └── multerConfig.js      # File upload config
│   ├── server.js                # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RecipeDetailsView.js
│   │   │   └── RecipeDetailsView.css
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Recipe Endpoints
- `POST /api/analyze-image` - Analyze uploaded image for ingredients
- `GET /api/recipes` - Find recipes by ingredients
- `GET /api/recipes/:id` - Get detailed recipe information

### Shopping Endpoints
- `POST /api/arbuz-links` - Get shopping links for ingredients

## 🧪 Development Features

### Selenium Automation
- Automated Chrome browser for web scraping
- Headless mode for production
- Smart product detection and link extraction
- Fallback to search pages when products not found

### Translation System
- 200+ ingredient English-to-Russian dictionary
- Smart ingredient name matching
- Handles various ingredient formats

### Error Handling
- Comprehensive fallback mechanisms
- User-friendly error messages
- Graceful degradation for failed services

## 🐛 Troubleshooting

### Common Issues

**1. Chrome/Selenium Issues:**
```bash
# Update Chrome to latest version
# Clear Chrome data if needed
```

**2. API Key Issues:**
```bash
# Verify your API keys are correct
# Check environment variables are loaded
```

**3. Port Conflicts:**
```bash
# Change PORT in backend/.env
# Update REACT_APP_API_URL in frontend/.env
```

### Debug Mode
Enable debug logging by setting environment variables:
```bash
DEBUG=true
NODE_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Spoonacular](https://spoonacular.com) for recipe data
- [Moondream AI](https://moondream.ai) for image analysis
- [Arbuz.kz](https://arbuz.kz) for grocery shopping integration

---

**Built with ❤️ for making cooking easier and more accessible!** 
