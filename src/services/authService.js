import api from './api';

export const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Store auth data in localStorage
  setAuthData: (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
      username: data.username,
      fullName: data.fullName,
      role: data.role,
      userId: data.userId,
    }));
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Get stored user
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Clear auth data (logout)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Check if user is admin
  isAdmin: () => {
    const user = authService.getUser();
    return user?.role === 'ADMIN';
  },

  // Check if user is student
  isStudent: () => {
    const user = authService.getUser();
    return user?.role === 'STUDENT';
  },
};
