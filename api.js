import axios from 'axios';
import authService from './authService';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        await authService.refreshToken();
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout user
        authService.logout();
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
    } else {
      // Error in request setup
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const stockApi = {
  getStockData: (symbol) => api.get(`/stocks/${symbol}`),
  getStockStats: (symbol) => api.get(`/stocks/${symbol}/stats`),
  getCorrelation: (symbol1, symbol2) => api.get(`/stocks/correlation/${symbol1}/${symbol2}`),
  setAlert: (symbol, threshold) => api.post(`/stocks/${symbol}/alert`, { threshold }),
  getAlerts: () => api.get('/alerts'),
  deleteAlert: (alertId) => api.delete(`/alerts/${alertId}`)
};

export default api; 