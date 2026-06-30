"use client";

import { createContext, ReactNode, useContext, useSyncExternalStore } from "react";
import { AuthContextType, User } from "@/types/authContextType";
import saveLocalStorage from "@/api/helpers/saveLocalStorage";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  return localStorage.getItem("accessToken");
}

function getServerSnapshot() {
  return null;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const accessToken = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const user: User | null = accessToken ? { accessToken } : null;

  const login = (userData: User) => {
    saveLocalStorage("accessToken", userData.accessToken);
    window.dispatchEvent(new Event("storage"));
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    window.dispatchEvent(new Event("storage"));
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
