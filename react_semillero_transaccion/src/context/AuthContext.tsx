import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { DEMO_ACCOUNTS, fetchYoApi, loginApi } from '../services/api';
import { LoginRequest, RoleType, UserIdentity } from '../types/api';

interface AuthContextValue {
  token: string | null;
  user: UserIdentity | null;
  primaryRole: RoleType | null;
  expiresInSeconds: number | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<RoleType>;
  switchDemoRole: (role: RoleType) => Promise<RoleType>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'ufps_semilleros_jwt';
const EXPIRES_STORAGE_KEY = 'ufps_semilleros_exp';

function extractPrimaryRole(autoridades: string[]): RoleType {
  if (autoridades.some((a) => a.includes('ADMINISTRADOR'))) return 'ADMINISTRADOR';
  if (autoridades.some((a) => a.includes('DIRECTOR'))) return 'DIRECTOR';
  return 'MIEMBRO';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [expiresInSeconds, setExpiresInSeconds] = useState<number | null>(() => {
    const saved = localStorage.getItem(EXPIRES_STORAGE_KEY);
    return saved ? Number(saved) : null;
  });
  const [user, setUser] = useState<UserIdentity | null>(null);
  const [loading, setLoading] = useState<boolean>(!!localStorage.getItem(TOKEN_STORAGE_KEY));

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(EXPIRES_STORAGE_KEY);
    setToken(null);
    setUser(null);
    setExpiresInSeconds(null);
  }, []);

  useEffect(() => {
    let active = true;
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchYoApi(token)
      .then((identity) => {
        if (active) {
          setUser(identity);
        }
      })
      .catch(() => {
        if (active) {
          logout();
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [token, logout]);

  const login = useCallback(async (credentials: LoginRequest): Promise<RoleType> => {
    const loginRes = await loginApi(credentials);
    const identity = await fetchYoApi(loginRes.accessToken);
    localStorage.setItem(TOKEN_STORAGE_KEY, loginRes.accessToken);
    localStorage.setItem(EXPIRES_STORAGE_KEY, String(loginRes.expiresInSeconds));
    setToken(loginRes.accessToken);
    setExpiresInSeconds(loginRes.expiresInSeconds);
    setUser(identity);
    return extractPrimaryRole(identity.autoridades);
  }, []);

  const switchDemoRole = useCallback(
    async (role: RoleType): Promise<RoleType> => {
      const preset = DEMO_ACCOUNTS.find((acc) => acc.role === role) || DEMO_ACCOUNTS[0];
      return login({ email: preset.email, password: preset.password });
    },
    [login]
  );

  const primaryRole = user ? extractPrimaryRole(user.autoridades) : null;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        primaryRole,
        expiresInSeconds,
        loading,
        login,
        switchDemoRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return ctx;
}

