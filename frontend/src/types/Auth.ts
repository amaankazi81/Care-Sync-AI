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

export interface AuthUser {
  username: string;
  role: string;

  firstName: string;
  lastName: string;
}
