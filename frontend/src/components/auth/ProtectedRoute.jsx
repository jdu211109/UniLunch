// src/components/auth/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../utils/apiClient";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const auth = useAuth();
  const location = useLocation();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: apiClient.getCurrentUser,
    enabled: auth.status === "authenticated",
  });

  if (auth.status === "loading") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (auth.status === "unauthenticated") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (adminOnly && !user?.isAdmin) {
    return <Navigate to="/menu" state={{ from: location }} replace />;
  }

  return children;
}