import geminiService, { generateResponse } from './gemini.service.js';

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
    // 1. Prepare messages array (in a real app, you'd fetch history from DB)
    const messages = [
      { role: 'user', parts: [{ text: userMessage }] }
    ];

    // 2. Send to Gemini
    let response = await geminiService.generateResponse(messages);
    
    // 3. Check for function calls (Extension Point for Tools)
    // TODO: Detect if response.functionCalls exists
    // TODO: Loop through function calls
    // TODO: Execute your custom functions
    // TODO: Append results to messages and call Gemini again

    /* Example structure for tool execution later:
    if (response.functionCalls) {
      for (const call of response.functionCalls) {
        console.log(`[GEMINI] Function call detected: ${call.name}`);
        
        debugInfo.toolCalls.push({
          name: call.name,
          arguments: call.args,
          // result: await myTool(call.args)
        });
        
        // ... execute tool ...
        // ... return result to Gemini ...
      }
    }
    */

    // 4. Get final text
    // Assuming a simple text response for now since tools are not implemented
    let finalAnswer = response.text || "I'm sorry, I cannot answer that right now.";

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
