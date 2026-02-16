import axios from 'axios';
import { getAuthToken } from './auth';

const API_URL = 'https://blog-api-bnxm.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

// AUTOMATICALLY ATTACH TOKEN
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
