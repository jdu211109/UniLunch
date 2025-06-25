// src/App.jsx
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext.jsx';
import { LanguageProvider } from './context/LanguageProvider';
import { ToastProvider } from './context/ToastContext.jsx';
import './index.css';

const queryClient = new QueryClient();

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <ToastProvider>
            <div className="min-h-screen bg-background">
              <AppRoutes searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>
          </ToastProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}