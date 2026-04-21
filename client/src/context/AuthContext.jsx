import { createContext, useState, useEffect } from "react";
import authService from "../services/authServices.js";
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data);
    return data;
  };
  const login = async (userData) => {
    const data = await authService.login(userData);
    setUser(data);
    return data;
  };
  const logout = () => {
    authService.logout();
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};