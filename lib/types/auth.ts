export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

// API Response wrapper matching backend response.Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Login
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

// Logout
export interface LogoutRequest {
  refreshToken?: string;
}

export interface LogoutResponse {
  message: string;
}

// Refresh Token
export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  token: string;
  refreshToken?: string;
}
