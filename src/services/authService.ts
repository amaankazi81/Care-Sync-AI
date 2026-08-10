import api from '@/lib/api';

/* ============================================================
   LOGIN
============================================================ */

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string | null;
  tokenType: string;
  expiresIn: number;

  username: string;
  role: string;
  firstName: string;
  lastName: string;
}

/* ============================================================
   REGISTER
============================================================ */

export type UserRole =
  | 'PATIENT'
  | 'DOCTOR'
  | 'RECEPTIONIST'
  | 'ADMIN';

export interface RegisterRequest {
  // ==========================
  // Common Fields
  // ==========================

  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;

  role: UserRole;

  registrationCode?: string;

  // ==========================
  // Doctor Fields
  // ==========================

  specialization?: string;

  qualification?: string;

  experience?: number;

  roomNumber?: string;

  departmentId?: string;

  isAvailable?: boolean;

  // ==========================
  // Patient Fields
  // ==========================

  dateOfBirth?: string;

  gender?: string;

  bloodGroup?: string;

  address?: string;

  emergencyContactName?: string;

  emergencyContactNumber?: string;
}

/* ============================================================
   DEPARTMENT
============================================================ */

export interface Department {
  id: string;
  name: string;
  description: string;
}

export interface DepartmentResponse {
  success: boolean;
  message: string;
  data: Department[];
}

/* ============================================================
   AUTH SERVICE
============================================================ */

const authService = {
  /* ==========================
     LOGIN
  ========================== */

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', data);

    const loginData: LoginResponse = response.data;

    localStorage.setItem('accessToken', loginData.accessToken);

    if (loginData.refreshToken) {
      localStorage.setItem(
        'refreshToken',
        loginData.refreshToken
      );
    }

    localStorage.setItem('role', loginData.role);

    localStorage.setItem(
      'username',
      loginData.username
    );

    return loginData;
  },

  /* ==========================
     REGISTER
  ========================== */

  register: async (
    data: RegisterRequest
  ) => {
    const response = await api.post(
      '/auth/register',
      data
    );

    return response.data;
  },

  /* ==========================
     FORGOT PASSWORD
  ========================== */

  forgotPassword: async (
    email: string
  ) => {
    const response = await api.post(
      '/auth/forgot-password',
      {
        email,
      }
    );

    return response.data;
  },

  /* ==========================
     RESET PASSWORD
  ========================== */

  resetPassword: async (data: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const response = await api.post(
      '/auth/reset-password',
      data
    );

    return response.data;
  },
};

export default authService;