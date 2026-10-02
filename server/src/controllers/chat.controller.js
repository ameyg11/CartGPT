import chatService from '../services/chat.service.js';

export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    console.log(`\n[CHAT] User: ${message}`);
    
    const result = await chatService.processChat(message);
    
    console.log(`[CHAT] AI: ${result.message}`);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Chat Controller Error:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing the chat.'
    });
  }
};

export default {
  handleChat
};
