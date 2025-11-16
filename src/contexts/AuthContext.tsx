'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, LoginRequest, RegisterRequest } from '@/types';
import { authService } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('🔄 Checking authentication...');
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');

      console.log('📦 Local Storage - User:', userData);
      console.log('📦 Local Storage - Token:', token ? 'Present' : 'Missing');

      if (userData && token) {
        const parsedUser = JSON.parse(userData);
        console.log('✅ User found in storage:', parsedUser.email);
        setUser(parsedUser);
      } else {
        console.log('❌ No user or token found in storage');
      }
    } catch (error) {
      console.error('🚨 Auth check failed:', error);
      await logout();
    } finally {
      setIsLoading(false);
      console.log('🏁 Auth check completed');
    }
  };

  const login = async (data: LoginRequest) => {
    try {
      console.log('🔐 Attempting login for:', data.email);
      const response = await authService.login(data);
      
      console.log('📊 Login response:', response);
      
      const { user: userData, tokens } = response.data;

      if (!userData || !tokens) {
        throw new Error('Invalid response from server');
      }

      console.log('✅ Login successful, storing tokens...');
      
      // Store only the access token (refresh token is HTTP-only cookie)
      localStorage.setItem('accessToken', tokens.access.token);
      localStorage.setItem('user', JSON.stringify(userData));

      console.log('📦 Access token and user stored in localStorage');
      setUser(userData);
    } catch (error: any) {
      console.error('🚨 Login failed:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      console.log('👤 Attempting registration for:', data.email);
      const response = await authService.register(data);
      
      console.log('📊 Register response:', response);
      
      const { user: userData, tokens } = response.data;

      if (!userData || !tokens) {
        throw new Error('Invalid response from server');
      }

      console.log('✅ Registration successful, storing tokens...');
      
      // Store only the access token (refresh token is HTTP-only cookie)
      localStorage.setItem('accessToken', tokens.access.token);
      localStorage.setItem('user', JSON.stringify(userData));

      console.log('📦 Access token and user stored in localStorage');
      setUser(userData);
    } catch (error: any) {
      console.error('🚨 Registration failed:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  };

  const logout = async () => {
    console.log('🚪 Logging out...');
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
      console.log('✅ Logout completed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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