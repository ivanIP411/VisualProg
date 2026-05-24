import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUser, login as apiLogin, register as apiReg, logout as apiLogout, refresh, getCurrentUserSync } from './auth';

type User = { id: string; name: string; email: string } | null;

const AuthCtx = createContext<{
  user: User;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
} | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await refresh();
        const u = await getUser();
        setUser(u);
      } catch (err) {
        const syncUser = getCurrentUserSync();
        if (syncUser) {
          const u = await getUser();
          setUser(u);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email: string, pass: string) => {
    const u = await apiLogin(email, pass);
    setUser(u);
  };
  const register = async (name: string, email: string, pass: string) => {
    const u = await apiReg(name, email, pass);
    setUser(u);
  };
  const logout = async () => {
    await apiLogout();
    setUser(null);
  };
  return (
    <AuthCtx.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth AuthProvider');
  return ctx;
};