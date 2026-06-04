import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSession, clearSession, setSession } from '../data/store';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (session) setUser(session);
    setLoading(false);
  }, []);

  const login = (userData) => {
    setSession(userData);
    setUser(userData);
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  const refreshUser = (updatedUser) => {
    setSession(updatedUser);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
