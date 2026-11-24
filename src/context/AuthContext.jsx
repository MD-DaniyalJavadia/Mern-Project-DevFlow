import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuth = useCallback(() => setUser(null), []);

  const login = useCallback(async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    setUser(response.data.data.user);
    return response.data;
  }, []);

  const register = useCallback(async (payload) => {
    const response = await api.post("/auth/register", payload);
    setUser(response.data.data.user);
    return response.data;
  }, []);

  const logout = useCallback(async () => {
    try { await api.post("/auth/logout"); }
    finally { clearAuth(); }
  }, [clearAuth]);

  useEffect(() => {
    api.get("/auth/me")
      .then((response) => setUser(response.data.data.user))
      .catch(() => clearAuth())
      .finally(() => setLoading(false));
  }, [clearAuth]);

  const value = useMemo(() => ({ user, loading, isAuthenticated:Boolean(user), login, register, logout }), [user, loading, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
