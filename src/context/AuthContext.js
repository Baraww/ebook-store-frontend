// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize token from localStorage
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  // This effect runs ONLY when the token changes (or on initial load)
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/users/me', {
            headers: { 'x-auth-token': token },
          });
          const data = await response.json();
          if (response.ok) {
            setUser(data);
          } else {
            logout();
          }
        } catch (error) {
          console.error("Failed to fetch user");
          logout();
        }
      }
    };
    fetchUser();
  }, [token]);

  // This is the updated login function
  const login = async (newToken) => {
    // We set the token first, which will trigger the useEffect above
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};