// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import AuthPage from "../components/auth/AuthPage";
import MenuPage from "../pages/MenuPage";
import AdminPage from "../pages/AdminPage";
import ReservationsPage from "../pages/ReservationsPage";
import AccountPage from "../pages/AccountPage";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";

export default function AppRoutes({ searchQuery, setSearchQuery }) {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route
        path="/menu"
        element={
          <ProtectedRoute>
            <MainLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
              <MenuPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <MainLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
              <AdminPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservations"
        element={
          <ProtectedRoute>
            <MainLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
              <ReservationsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <MainLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
              <AccountPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}