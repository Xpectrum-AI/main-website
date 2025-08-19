import axios from 'axios';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
const apiService = {
  // Get available service API keys
  getApiKeys: async () => {
    return axios.get('/api/service-keys');
  },

  // Voice chat endpoint
  voiceChat: async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    
    return axios.post('/api/voice-chat', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
    });
  },

  // WebSocket connection for real-time voice chat
  getWebSocketUrl: () => {
    const wsUrl = import.meta.env.VITE_WS_URL;
    return wsUrl;
  },

  // Test AWS connection
  testAWSConnection: async () => {
    try {
      const response = await api.get('/test-aws');
      return response.data;
    } catch (error) {
      console.error('Error testing AWS connection:', error);
      throw error;
    }
  },
};

export default apiService;