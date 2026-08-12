import api from '@/lib/api';

export interface UserProfile {
  id?: string;

  username: string;

  email: string;

  firstName: string;

  lastName: string;

  phoneNumber: string;

  role: string;

  patientId: string | null;
}

const userService = {
  getCurrentUserProfile: async (): Promise<UserProfile> => {
    const response =
      await api.get<UserProfile>('/users/me');

    return response.data;
  },
};

export default userService;