const { vl } = require('moondream');

const moondream = new vl({
  apiKey: process.env.MOONDREAM_API_KEY,
});

/**
 * Анализирует изображение через Moondream Cloud SDK
 * @param {Buffer} imageBuffer - буфер изображения
 * @returns {Promise<string>} - Ответ на вопрос "What are the ingredients in this photo?"
 */
async function analyzeImage(imageBuffer) {
  try {
    const result = await moondream.query({
      image: imageBuffer,
      question: "List only the food ingredients visible in this photo, separated by commas. Do not include any utensils or non-food items. Respond with a comma-separated list of ingredients only, no extra words.",
      stream: false
    });
    // result.answer — строка с ответом
    return result.answer;
  } catch (error) {
    console.error('Error analyzing image with Moondream:', error);
    throw new Error('Failed to analyze image');
  }
}

module.exports = { analyzeImage }; 