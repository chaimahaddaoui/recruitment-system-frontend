import api from '@/lib/api';
import { AuthResponse, LoginData, RegisterData, User } from '@/types';
import Cookies from 'js-cookie';

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    
    // Sauvegarder le token et l'utilisateur
    Cookies.set('token', response.data.access_token, { expires: 7 });
    Cookies.set('user', JSON.stringify(response.data.user), { expires: 7 });
    
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    
    // Sauvegarder le token et l'utilisateur
    Cookies.set('token', response.data.access_token, { expires: 7 });
    Cookies.set('user', JSON.stringify(response.data.user), { expires: 7 });
    
    return response.data;
  },

  logout() {
    Cookies.remove('token');
    Cookies.remove('user');
    window.location.href = '/auth/login';
  },

  getCurrentUser(): User | null {
    const userStr = Cookies.get('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return Cookies.get('token') || null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};