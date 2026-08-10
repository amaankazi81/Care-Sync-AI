import axios from 'axios';
import { LoginRequest, LoginResponse } from '@/types/Auth';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

class AuthApi {
  /**
   * Login
   */
  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await API.post<LoginResponse>('/auth/login', request);

    return response.data;
  }

  /**
   * Register
   */
  async register(data: unknown) {
    const response = await API.post('/auth/register', data);

    return response.data;
  }

  /**
   * Forgot Password
   */
  async forgotPassword(email: string) {
    const response = await API.post('/auth/forgot-password', {
      email,
    });

    return response.data;
  }

  /**
   * Reset Password
   */
  async resetPassword(data: { token: string; newPassword: string; confirmPassword: string }) {
    const response = await API.post('/auth/reset-password', data);

    return response.data;
  }
}

export default new AuthApi();
