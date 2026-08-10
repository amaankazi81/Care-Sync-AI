import api from '@/lib/api';

export interface UserProfile {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

class ProfileService {
  async getCurrentUserProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>('/users/me');
    return response.data;
  }

  async updateProfile(request: UpdateProfileRequest): Promise<UserProfile> {
    const response = await api.put<UserProfile>('/users/me', request);

    return response.data;
  }

  async changePassword(request: ChangePasswordRequest): Promise<void> {
    await api.put('/users/change-password', request);
  }
}

export default new ProfileService();
