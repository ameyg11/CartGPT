import geminiService from './gemini.service.js';

/**
 * Handles the chat interaction flow
 * @param {String} userMessage 
 * @returns {Object} The final response and debug info
 */
export async function processChat(userMessage) {
  const debugInfo = {
    toolCalls: []
  };

  try {
    // Process message using Gemini Interactions API with tool calling
    const response = await geminiService.generateResponse(userMessage, debugInfo);
    
    const finalAnswer = typeof response === 'string'
      ? response
      : (response?.text || response?.output_text || "I'm sorry, I cannot answer that right now.");

    return {
      success: true,
      message: finalAnswer,
      debug: debugInfo
    };

  } catch (error) {
    console.error('Chat Service Error:', error);
    throw new Error('Failed to process chat message');
  }
}

export default {
  processChat
};
