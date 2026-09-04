"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  profilePhoto?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage on initial load
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        const parsed = JSON.parse(storedUser);
        const actualUser = parsed?.user || parsed;
        setUser(actualUser);

        // Fetch fresh profile from /auth/me
        fetch('https://pgonline-backend-v-1-0.onrender.com/api/v1/auth/me', {
          headers: { 'Authorization': `Bearer ${storedToken}` }
        })
          .then(res => res.json())
          .then(data => {
            if (data.success && data.data) {
              const freshUser = data.data.user || data.data;
              setUser(freshUser);
              localStorage.setItem('user', JSON.stringify(freshUser));
            }
          })
          .catch(err => console.error("Failed to refresh user profile", err));
      } catch (err) {
        console.error("Failed to parse user from local storage");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: any) => {
    const actualUser = newUser?.user || newUser;
    setToken(newToken);
    setUser(actualUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(actualUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
