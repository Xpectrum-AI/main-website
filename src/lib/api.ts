import axios from 'axios';

// Get API URL from environment variable or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const apiService = {
  // Get API keys from backend
  getApiKeys: async () => {
    try {
      const response = await api.get('/keys');
      return response.data;
    } catch (error) {
      console.error('Error fetching API keys:', error);
      throw error;
    }
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