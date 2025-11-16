import { api } from '@/lib/api';
import { AuthResponse, LoginRequest, RegisterRequest } from '@/types';

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    console.log('📨 Register Response:', response.data);
    
    // Your backend returns { accessToken, user }
    return {
      data: {
        user: response.data.user,
        tokens: {
          access: {
            token: response.data.accessToken,
            expires: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes
          },
          refresh: {
            token: '', // Not provided in response - it's in HTTP-only cookie
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        }
      }
    };
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    console.log('📨 Login Response:', response.data);
    
    // Your backend returns { accessToken, user }
    return {
      data: {
        user: response.data.user,
        tokens: {
          access: {
            token: response.data.accessToken,
            expires: new Date(Date.now() + 15 * 60 * 1000).toISOString()
          },
          refresh: {
            token: '', // Not provided in response - it's in HTTP-only cookie
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        }
      }
    };
  },

  async refreshToken() {
    // Since refresh token is HTTP-only cookie, we don't need to send it manually
    const response = await api.post('/auth/refresh');
    console.log('📨 Refresh Token Response:', response.data);
    
    // Your backend returns { accessToken }
    return {
      data: {
        access: {
          token: response.data.accessToken,
          expires: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        }
      }
    };
  },

  async logout() {
    // Your backend expects refresh token from cookie or body
    // Since we don't have the refresh token, we'll let the cookie handle it
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.log('Logout API call failed, but continuing with client-side logout');
    }
    
    // Clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken'); // We weren't storing this anyway
    localStorage.removeItem('user');
  },
};