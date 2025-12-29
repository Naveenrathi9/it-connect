import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token if available
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

// API methods
export const testConnection = async () => {
  try {
    const response = await api.get('/test-db');
    return response.data;
  } catch (error) {
    console.error('Error testing connection:', error);
    throw error;
  }
};

export const createAssetReturn = async (assetData: any) => {
  try {
    const response = await api.post('/asset-returns', assetData);
    return response.data;
  } catch (error) {
    console.error('Error creating asset return:', error);
    throw error;
  }
};

export const getAssetReturns = async () => {
  try {
    const response = await api.get('/asset-returns');
    return response.data;
  } catch (error) {
    console.error('Error fetching asset returns:', error);
    throw error;
  }
};

export const updateAssetReturn = async (id: string, assetData: any) => {
  try {
    const response = await api.put(`/asset-returns/${id}`, assetData);
    return response.data;
  } catch (error) {
    console.error(`Error updating asset return ${id}:`, error);
    throw error;
  }
};

export const deleteAssetReturn = async (id: string) => {
  try {
    const response = await api.delete(`/asset-returns/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting asset return ${id}:`, error);
    throw error;
  }
};

export default api;
