import { config } from '@/lib/config';
import { ApiError } from './client';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RefreshRequest,
  RefreshResponse,
} from '@/lib/types/auth';

const AUTH_ENDPOINTS = {
  login: '/v1/auth/login',
  logout: '/v1/auth/logout',
  refresh: '/v1/auth/refresh',
} as const;

async function handleResponse<T>(response: Response): Promise<T> {
  const data: ApiResponse<T> = await response.json().catch(() => ({
    success: false,
    error: 'Invalid response format',
  }));

  if (!response.ok) {
    throw new ApiError(response.status, data.error || data.message || 'Request failed', data);
  }

  if (!data.success && data.error) {
    throw new ApiError(response.status, data.error, data);
  }

  return data.data as T;
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${config.api.baseUrl}${AUTH_ENDPOINTS.login}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  return handleResponse<LoginResponse>(response);
}

export async function logout(
  refreshToken: string | null,
  accessToken: string
): Promise<LogoutResponse> {
  const body: LogoutRequest = {};
  if (refreshToken) {
    body.refreshToken = refreshToken;
  }

  const response = await fetch(`${config.api.baseUrl}${AUTH_ENDPOINTS.logout}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  return handleResponse<LogoutResponse>(response);
}

export async function refreshToken(currentRefreshToken: string): Promise<RefreshResponse> {
  const body: RefreshRequest = {
    refreshToken: currentRefreshToken,
  };

  const response = await fetch(`${config.api.baseUrl}${AUTH_ENDPOINTS.refresh}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return handleResponse<RefreshResponse>(response);
}

export const authApi = {
  login,
  logout,
  refreshToken,
};
