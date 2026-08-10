import axios from 'axios';
import { logout } from '@/utils/auth';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Adds JWT token automatically
 */
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Handles Unauthorized / Forbidden responses
 */
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (typeof window !== 'undefined') {
      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        logout();

        const publicRoutes = [
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
        ];

        const currentPath = window.location.pathname;

        const isPublicRoute = publicRoutes.some((route) =>
          currentPath.startsWith(route)
        );

        if (!isPublicRoute) {
          logout();
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;