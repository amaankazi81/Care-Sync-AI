import { jwtDecode } from 'jwt-decode';

export const TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const ROLE_KEY = 'role';

export interface JwtPayload {
  sub?: string;
  email?: string;
  name?: string;
  unique_name?: string;
  preferred_username?: string;
  username?: string;
  userName?: string;
  userId?: string;
  role?: string;
  exp?: number;
  iat?: number;

  [key: string]: unknown;
}

/**
 * Save authentication tokens
 */
export const saveTokens = (
  accessToken: string,
  refreshToken: string | null,
  role: string
) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(ROLE_KEY, role);

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  document.cookie = `accessToken=${accessToken}; path=/`;
  document.cookie = `role=${role}; path=/`;
};

/**
 * Get access token
 */
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get logged-in role
 */
export const getRole = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(ROLE_KEY);
};

/**
 * Decode JWT token
 *
 * IMPORTANT:
 * We intentionally keep all claims because the backend
 * may use different claim names such as:
 *
 * email
 * unique_name
 * preferred_username
 * username
 * userId
 * sub
 */
export const decodeToken = (): JwtPayload | null => {
  const token = getAccessToken();

  if (!token) {
    return null;
  }

  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error('Invalid JWT Token', error);

    return null;
  }
};

/**
 * Check whether JWT token is expired
 */
export const isTokenExpired = (): boolean => {
  const decoded = decodeToken();

  if (!decoded || !decoded.exp) {
    return true;
  }

  const currentTime = Date.now() / 1000;

  return decoded.exp < currentTime;
};

/**
 * Check whether user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getAccessToken();

  if (!token) {
    return false;
  }

  return !isTokenExpired();
};

/**
 * Logout user
 */
export const logout = () => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);

  document.cookie =
    'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  document.cookie =
    'role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};