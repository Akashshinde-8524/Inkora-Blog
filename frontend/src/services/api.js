import axios from 'axios';

const BACKEND_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://inkora-blog-1.onrender.com/api').replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://inkora-blog-1.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const getBackendBaseUrl = () => BACKEND_BASE_URL;

export const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  return `${BACKEND_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

function fixUploadUrls(obj, backendBase) {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    if (obj.startsWith('/uploads/')) {
      return `${backendBase}${obj}`;
    }
    if (obj.includes('](/uploads/')) {
      return obj.replaceAll('](/uploads/', `](${backendBase}/uploads/`);
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => fixUploadUrls(item, backendBase));
  }
  if (typeof obj === 'object') {
    const newObj = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = fixUploadUrls(obj[key], backendBase);
    }
    return newObj;
  }
  return obj;
}

// Request Interceptor: Attach JWT Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('inkora_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Centralized error handling & automatic URL resolution
api.interceptors.response.use(
  (response) => {
    if (response?.data) {
      response.data = fixUploadUrls(response.data, BACKEND_BASE_URL);
    }
    return response;
  },
  (error) => {
    const status = error.response ? error.response.status : null;
    
    if (status === 401) {
      // Clear token if expired or invalid
      localStorage.removeItem('inkora_token');
      localStorage.removeItem('inkora_user');
      // If we are not on login/register, optionally redirect or notify
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    return Promise.reject({
      status,
      message,
      data: error.response?.data,
      originalError: error,
    });
  }
);

export default api;
