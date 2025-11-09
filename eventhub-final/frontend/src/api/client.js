import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
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

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Auth API
export const auth = {
  register: async (data) => {
    const response = await apiClient.post('/auth/register', data);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  me: async () => {
    return await apiClient.get('/auth/me');
  },

  updateMe: async (data) => {
    const response = await apiClient.put('/auth/me', data);
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  redirectToLogin: () => {
    window.location.href = '/login';
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

// Generic entity CRUD operations
const createEntityAPI = (entityName) => ({
  list: async (sortBy = '') => {
    const params = sortBy ? { sort: sortBy } : {};
    return await apiClient.get(`/${entityName}`, { params });
  },

  filter: async (filters, sortBy = '') => {
    const params = { ...filters };
    if (sortBy) params.sort = sortBy;
    return await apiClient.get(`/${entityName}`, { params });
  },

  getById: async (id) => {
    return await apiClient.get(`/${entityName}/${id}`);
  },

  create: async (data) => {
    return await apiClient.post(`/${entityName}`, data);
  },

  bulkCreate: async (items) => {
    return await apiClient.post(`/${entityName}/bulk`, { items });
  },

  update: async (id, data) => {
    return await apiClient.put(`/${entityName}/${id}`, data);
  },

  delete: async (id) => {
    return await apiClient.delete(`/${entityName}/${id}`);
  },
});

// Entities API
export const entities = {
  Event: createEntityAPI('events'),
  Resource: createEntityAPI('resources'),
  Booking: createEntityAPI('bookings'),
  Rating: createEntityAPI('ratings'),
  WaitingList: createEntityAPI('waiting-list'),
  User: createEntityAPI('users'),
};

// Main API object (mimics base44 structure)
export const api = {
  auth,
  entities,
};

export default api;
