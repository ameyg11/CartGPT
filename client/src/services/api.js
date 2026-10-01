import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const sendChatMessage = async (message) => {
  try {
    const response = await axios.post(`${API_URL}/chat`, { message });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.error || 'Failed to communicate with the server.');
  }
};
