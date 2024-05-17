import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt_decode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
      } else {
        setIsAuthenticated(true);
        setUser(decodedToken.user);
        navigate('/');
      }
    }
  }, []);

  const login = async (formData) => {
    try {
      const response = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      setUser(jwt_decode(response.data.token).user);
      navigate('/');
    } catch (error) {
      // Handle login error
      console.error("Login Error:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login') // Redirect to the login page on logout
};

  const register = async (formData) => {
    try {
      const response = await axios.post('/api/auth/register', formData);
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      setUser(jwt_decode(response.data.token).user);
      navigate('/');
    } catch (error) {
      // Handle registration error
      console.error("Register Error:", error);
    }
  };


  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
