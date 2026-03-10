'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Charger l'utilisateur depuis les cookies au démarrage
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setUser(response.user);
    
    // Redirection selon le rôle
    switch (response.user.role) {
      case 'CANDIDATE':
        router.push('/dashboard/candidate');
        break;
      case 'RECRUITER':
        router.push('/dashboard/recruiter');
        break;
      case 'HR_MANAGER':
      case 'ADMIN':
        router.push('/dashboard/hr-manager');
        break;
      default:
        router.push('/');
    }
  };

  const register = async (data: any) => {
    const response = await authService.register(data);
    setUser(response.user);
    
    // Redirection selon le rôle
    switch (response.user.role) {
      case 'CANDIDATE':
        router.push('/dashboard/candidate');
        break;
      case 'RECRUITER':
        router.push('/dashboard/recruiter');
        break;
      case 'HR_MANAGER':
      case 'ADMIN':
        router.push('/dashboard/hr-manager');
        break;
      default:
        router.push('/');
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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