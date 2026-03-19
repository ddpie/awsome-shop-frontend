import axios from 'axios';
import { storage } from '../utils/storage';

const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Request interceptor: inject JWT
http.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: unified error handling & envelope unwrap
http.interceptors.response.use(
  (response) => {
    const body = response.data;
    // Backend wraps responses in { code, message, data }
    // Unwrap the envelope so services get the inner payload directly
    if (body && typeof body === 'object' && 'code' in body && 'data' in body) {
      return body;
    }
    return body;
  },
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      storage.clear();
      window.location.href = '/login';
    } else if (status === 403) {
      // Let components handle 403 via error propagation
    } else if (status >= 500) {
      // Let components handle 5xx via error propagation
    }

    return Promise.reject(error);
  },
);

export default http;
