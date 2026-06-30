"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { AuthContextType, User } from "@/types/authContextType";
import loadLocalStorage from "@/api/helpers/loadLocalStorage";
import saveLocalStorage from "@/api/helpers/saveLocalStorage";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const accessToken = loadLocalStorage("accessToken");

    return accessToken ? { accessToken } : null;
  });

  const login = (userData: User) => {
    saveLocalStorage("accessToken", userData.accessToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
