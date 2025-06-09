// src/layouts/MainLayout.jsx
import React from "react";
import Navigation from "../components/navigation/Navigation";
import { useToast } from "../components/navigation/useToast.jsx";

export default function MainLayout({ children, searchQuery, setSearchQuery }) {
  const { ToastContainer } = useToast();
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      {children}
      <ToastContainer />
    </div>
  );
}