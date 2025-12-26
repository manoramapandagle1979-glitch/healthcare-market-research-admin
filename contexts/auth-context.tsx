'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { tokenStorage, decodeToken } from '@/lib/auth/token';
import { authApi } from '@/lib/api/auth';
import { config } from '@/lib/config';
import type { User } from '@/lib/types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const initializeUser = useCallback(() => {
    const token = tokenStorage.getToken();
    if (!token) {
      return null;
    }

    const payload = decodeToken(token);
    if (payload) {
      return {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      };
    } else {
      tokenStorage.clearAll();
      return null;
    }
  }, []);

  const [user, setUser] = useState<User | null>(initializeUser);
  const [isLoading] = useState(false);

  const loadUserFromToken = useCallback(() => {
    const token = tokenStorage.getToken();
    if (!token) {
      setUser(null);
      return;
    }

    const payload = decodeToken(token);
    if (payload) {
      setUser({
        id: payload.id,
        email: payload.email,
        role: payload.role,
      });
    } else {
      tokenStorage.clearAll();
      setUser(null);
    }
  }, []);

  const handleLogout = useCallback(
    async (shouldCallApi = false) => {
      if (shouldCallApi) {
        const token = tokenStorage.getToken();
        const refreshToken = tokenStorage.getRefreshToken();
        if (token) {
          try {
            await authApi.logout(refreshToken, token);
          } catch {
            // Ignore logout API errors - we still want to clear local state
          }
        }
      }
      tokenStorage.clearAll();
      setUser(null);
      router.push('/login');
    },
    [router]
  );

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const token = tokenStorage.getToken();
      if (!token) {
        handleLogout(false);
        return;
      }

      const payload = decodeToken(token);
      if (!payload || Date.now() >= payload.exp * 1000 - config.session.tokenRefreshInterval) {
        const refreshToken = tokenStorage.getRefreshToken();
        if (!refreshToken) {
          handleLogout(false);
          return;
        }

        authApi
          .refreshToken(refreshToken)
          .then(data => {
            tokenStorage.setToken(data.token);
            if (data.refreshToken) {
              tokenStorage.setRefreshToken(data.refreshToken);
            }
            loadUserFromToken();
          })
          .catch(() => {
            handleLogout(false);
          });
      }
    }, config.session.tokenRefreshInterval);

    return () => clearInterval(interval);
  }, [user, loadUserFromToken, handleLogout]);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await authApi.login({ email, password });

      tokenStorage.setToken(data.token);
      tokenStorage.setRefreshToken(data.refreshToken);
      setUser(data.user);
      router.push('/dashboard');
    },
    [router]
  );

  const logout = useCallback(() => {
    handleLogout(true);
  }, [handleLogout]);

  const refreshUser = useCallback(async () => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
