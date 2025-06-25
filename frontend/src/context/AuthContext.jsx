import React, { useState, useEffect } from 'react';
import { AuthContext } from './auth-context';
import { apiClient } from '../utils/apiClient';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');

  // Check if user is authenticated on app start
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setStatus('unauthenticated');
        return;
      }

      try {
        const userData = await apiClient.getCurrentUser();
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          isAdmin: userData.role === 'admin'
        });
        setStatus('authenticated');
      } catch (error) {
        console.error('Auth initialization failed:', error);
        localStorage.removeItem('auth_token');
        setStatus('unauthenticated');
      }
    };

    initAuth();
  }, []);

  const signIn = async (credentials) => {
    try {
      setStatus('loading');
      const response = await apiClient.login(credentials);
      
      if (response.success) {
        setUser({
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
          isAdmin: response.user.role === 'admin'
        });
        setStatus('authenticated');
        return response;
      } else {
        setStatus('unauthenticated');
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      setStatus('unauthenticated');
      throw error;
    }
  };

  const signUp = async (userData) => {
    try {
      setStatus('loading');
      const response = await apiClient.register(userData);
      
      if (response.success) {
        setUser({
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
          isAdmin: response.user.role === 'admin'
        });
        setStatus('authenticated');
        return response;
      } else {
        setStatus('unauthenticated');
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      setStatus('unauthenticated');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setStatus('unauthenticated');
    }
  };

  const value = {
    user,
    status,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}