import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../api/auth";
import { AuthResponseDto, LoginRequest, RegisterRequest } from "../types/auth";

type User = {
  id: number;
  name: string;
  email: string;
  avatar: string;
};

type AuthContextType = {
  user: User | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    const res = await loginUser(data);
    localStorage.setItem("token", res.accessToken);
    localStorage.setItem("refreshToken", res.refreshToken);
    const userObj = {
      id: res.id,
      name: res.name,
      email: res.email,
      avatar: res.profile,
    };
    localStorage.setItem("user", JSON.stringify(userObj));
    setUser(userObj);
  };

  const register = async (data: RegisterRequest) => {
    await registerUser(data);
    // Optionally auto-login after register
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
