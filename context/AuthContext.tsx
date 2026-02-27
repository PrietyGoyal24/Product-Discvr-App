"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name: string) => void;
  signup: (email: string, name: string) => void;
  logout: () => void;
  isLoaded: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedReq = localStorage.getItem("auth_user");
    if (savedReq) {
      try {
        setUser(JSON.parse(savedReq));
      } catch { }
    }
    setIsLoaded(true);
  }, []);

  const login = (email: string, name: string) => {
    const userData = { email, name };
    setUser(userData);
    localStorage.setItem("auth_user", JSON.stringify(userData));
  };

  const signup = (email: string, name: string) => {
    // Mock signup is just login for this assessment
    login(email, name);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoaded }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
