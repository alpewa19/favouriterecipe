const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyzes an image to identify food ingredients
 * @param {Buffer} imageBuffer - The image buffer to analyze
 * @returns {Promise<string>} - Comma-separated list of ingredients
 */
async function analyzeImage(imageBuffer) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    // Convert buffer to base64
    const base64Image = imageBuffer.toString('base64');
    
    const prompt = "Identify all food ingredients visible in this image. List them separated by commas. If no food ingredients are clearly identifiable, return an empty string.";
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image
        }
      }
    ]);
    
    const response = await result.response;
    const ingredients = response.text().trim();
    
    return ingredients;
  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    throw new Error('Failed to analyze image');
  }
}

module.exports = {
  analyzeImage
}; 