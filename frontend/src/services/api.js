import axios from 'axios';

const API_BASE_URL =  'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

export const folderAPI = {
  create: (folderData) => api.post('/folders', folderData),
  getFolderContents: (parentFolderId = null) => 
    api.get('/folders', { params: { parentFolderId } }),
  getFolder: (id) => api.get(`/folders/${id}`),
  getFolderPath: (id) => api.get(`/folders/${id}/path`),
};

export const imageAPI = {
  upload: (formData) => api.post('/images/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  search: (query) => api.get('/images/search', { params: { q: query } }),
  getImage: (id) => api.get(`/images/${id}`),
};

export default api;