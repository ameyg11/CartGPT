import { GoogleGenAI } from '@google/genai';


// Initialize Gemini client (requires GOOGLE_API_KEY env var)
// It will automatically use process.env.GOOGLE_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// Add your Gemini function declarations here.
// e.g., { name: 'get_order', description: '...', parameters: { ... } }




const tools = [];


/**
 * Communicates with Gemini API
 * @param {Array} messages - Chat history including the latest user message
 * @returns {Object} The Gemini response
 */
export async function generateResponse(messages) {
  try {
    // Format messages for Gemini (if using the standard text generation model)
    // Here we're using a simple setup. For tool calling you will likely need
    // to manage the conversation history array carefully.
    
    let systemInstruction = "You are a helpful customer support assistant for an ecommerce store called Orderly Chaos. You help customers with their orders.";
    
    // In a real tool-calling scenario, you would pass the tools array here.
    // For now, we leave it empty/unimplemented as per instructions.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: messages,
      config: {
        systemInstruction: systemInstruction,
        // tools: [{ functionDeclarations: tools }],
      }
    });

    return response;
  } catch (error) {
    console.error('Gemini Service Error:', error);
    throw error;
  }
}

export default {
  generateResponse
};
