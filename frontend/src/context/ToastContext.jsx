// src/context/ToastContext.jsx
import React from 'react';
import { useToast } from '../components/navigation/useToast.jsx';
import { ToastContext } from './toast-context.js';

export function ToastProvider({ children }) {
  const { toast, ToastContainer } = useToast();

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}
