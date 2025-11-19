"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, loginUser, signupUser, logoutUser, getStoredUser, getStoredToken, saveAuthData } from "@/lib/auth";

interface AuthContextType {
  user: User | null; 
  isLoading: boolean; 
  login: (email: string, password: string) => Promise<void>; 
  signup: (name: string, email: string, password: string) => Promise<void>; 
  logout: () => void; 
  isAuthenticated: boolean; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getStoredToken();

    if (storedUser && storedToken) {
      setUser(storedUser);
    }

    setIsLoading(false);
  }, []);

  // Login function
  const handleLogin = async (email: string, password: string) => {
    try {
      const { user: loggedInUser, token } = await loginUser({
        email,
        password,
      });

      saveAuthData(loggedInUser, token);
      setUser(loggedInUser);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Signup function
  const handleSignup = async (name: string, email: string, password: string) => {
    try {
      const { user: newUser } = await signupUser({
        name,
        email,
        password,
      });

      // Don't save auth data on signup - user needs to login
      // User will be redirected to login page
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    isAuthenticated: !!user, 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

