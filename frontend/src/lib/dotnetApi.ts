import axios from 'axios';
import { logout } from '@/utils/auth';

const dotnetApi = axios.create({
  baseURL: 'http://localhost:5036/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Automatically attaches JWT token
 */
dotnetApi.interceptors.request.use(
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
 */
dotnetApi.interceptors.response.use(
  (response) => response,

  (error) => {
    if (typeof window !== 'undefined') {
      const status = error?.response?.status;

      if (status === 401) {
        logout();

        window.location.href = '/login';
      }

      if (status === 403) {
        console.error('Forbidden');
      }
    }

    return Promise.reject(error);
  }
);

export default dotnetApi;