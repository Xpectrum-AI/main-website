import { useState, useEffect } from 'react';
import apiService from '../lib/api';

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        setLoading(true);
        const response = await apiService.getApiKeys();
        setApiKeys(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch API keys');
        console.error('Error fetching API keys:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApiKeys();
  }, []);

  return { apiKeys, loading, error };
};

export default useApiKeys; 