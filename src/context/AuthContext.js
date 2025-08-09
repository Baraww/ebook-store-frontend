// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          // This is the line we are fixing
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/me`, {
            headers: {
              'x-auth-token': token,
            },
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

  const login = (newToken) => {
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