// src/hooks/useToastContext.js
import { useContext } from 'react';
import { ToastContext } from '../context/toast-context.js';

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}
