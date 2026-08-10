import api from '@/lib/api';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
}

const registerService = {
  register: async (data: RegisterRequest) => {
    const response = await api.post('/auth/register', data);

    return response.data;
  },
};

export default registerService;
