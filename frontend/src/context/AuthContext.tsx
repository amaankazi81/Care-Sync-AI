'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import userService, { UserProfile } from '@/services/userService';

interface AuthContextType {
  user: UserProfile | null;

  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    setLoading(false);
    return;
  }

  async function loadUser() {
    try {
      const response = await userService.getCurrentUserProfile();
      setUser(response);
    } catch (error) {
      console.error('Failed to load current user', error);
    } finally {
      setLoading(false);
    }
  }

  loadUser();
}, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
