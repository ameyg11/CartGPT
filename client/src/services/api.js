import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const sendChatMessage = async (message) => {
  try {
    const response = await axios.post(`${API_URL}/chat`, { message }, { timeout: 10000 });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    if (!error.response) {
      throw new Error(
        'Backend server is not running. Since this project is hosted frontend-only, fork it from GitHub, add your Gemini API key, and run the backend locally to experiment with live tool calls!'
      );
    }
    throw new Error(error.response?.data?.error || 'Failed to communicate with the server.');
  }
};
