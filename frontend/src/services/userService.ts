import api from '@/lib/api';

export interface UserProfile {
  id?: string;

  username: string;

  email: string;

  firstName: string;

  lastName: string;

  phoneNumber: string;

  role: string;

  /*
   * Optional because some APIs may return the
   * patient id directly while others may not.
   */
  patientId?: string;
}

const userService = {
  getCurrentUserProfile: async (): Promise<UserProfile> => {
    const response =
      await api.get<UserProfile>('/users/me');

    return response.data;
  },
};

export default userService;