// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from 'react';
import { getUser } from '../services/authService';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUser()
        .then((usr) => setUser(usr))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // const login = ({ user, token }) => {
  //   setUser(user);
  //   localStorage.setItem('token', token);
  // };

  const login = async ({ token }) => {
    localStorage.setItem('token', token);
    try {
      const freshUser = await getUser();
      setUser(freshUser);
    } catch (error) {
      console.error('Failed to fetch user after login', error);
      localStorage.removeItem('token');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user,setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
