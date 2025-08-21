# API Integration

The API integration layer will abstract the fetching and handling of data, ensuring a clean separation of concerns.

### Service Template

TypeScript

// src/api/leadsService.ts
import apiClient from './apiClient';

export const fetchLeads = async (query: string) => {
  try {
    const response = await apiClient.get(`/leads?q=${query}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch leads:', error);
    throw error;
  }
};

### API Client Configuration

TypeScript

// src/api/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error handling
    if (error.response?.status === 401) {
      // Handle unauthorized errors
    }
    return Promise.reject(error);
  },
);

export default apiClient;
