require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
async function check() {
  try {
    console.log("Key:", process.env.GEMINI_API_KEY);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
    const result = await model.generateContent("Hello");
    console.log("Success:", result.response.text());
  } catch (e) {
    console.error("Error:", e);
  }
}
check();
