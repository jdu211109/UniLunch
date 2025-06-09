import React, { useState } from 'react';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');

  const signIn = async (credentials) => {
    try {
      setStatus('loading');
      // Здесь будет логика аутентификации
      setUser({ id: '1', email: credentials.email });
      setStatus('authenticated');
    } catch (error) {
      setStatus('unauthenticated');
      throw error;
    }
  };

  const signOut = () => {
    setUser(null);
    setStatus('unauthenticated');
  };

  const value = {
    user,
    status,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}