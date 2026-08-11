import api from '@/lib/api';
import {
  saveTokens,
  saveUserInfo,
} from '@/utils/auth';

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
  patientId?: string | null;
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
  /* ==========================================================
     LOGIN
  ========================================================== */

  login: async (
    data: LoginRequest
  ): Promise<LoginResponse> => {
    const response = await api.post(
      '/auth/login',
      data
    );

    const loginData: LoginResponse =
      response.data;

    /*
     * --------------------------------------------------------
     * SAVE AUTHENTICATION TOKENS
     * --------------------------------------------------------
     */

    saveTokens(
      loginData.accessToken,
      loginData.refreshToken,
      loginData.role
    );

    /*
     * --------------------------------------------------------
     * SAVE LOGGED-IN USER INFORMATION
     *
     * This is important because Topbar needs to immediately
     * know which user has logged in after switching accounts.
     * --------------------------------------------------------
     */

    saveUserInfo({
      username: loginData.username,
      firstName: loginData.firstName,
      lastName: loginData.lastName,
      role: loginData.role,
      patientId: loginData.patientId,
    });

    /*
     * --------------------------------------------------------
     * Notify the rest of the application that authentication
     * has changed.
     *
     * Topbar and AppLayout listen for this event.
     * --------------------------------------------------------
     */

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new Event('auth-change')
      );
    }

    return loginData;
  },

  /* ==========================================================
     REGISTER
  ========================================================== */

  register: async (
    data: RegisterRequest
  ) => {
    const response = await api.post(
      '/auth/register',
      data
    );

    return response.data;
  },

  /* ==========================================================
     FORGOT PASSWORD
  ========================================================== */

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

  /* ==========================================================
     RESET PASSWORD
  ========================================================== */

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