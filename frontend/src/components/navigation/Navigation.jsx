// src/components/navigation/Navigation.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../utils/apiClient";
import { useAuth } from "../../hooks/useAuth.jsx";
import { ChevronDown, Menu, X, Calendar, User, LogOut, Settings } from "lucide-react";
import {
  Button,
  Badge,
  Input,
  Separator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui";

export default function Navigation({ searchQuery = "", setSearchQuery = () => {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMenuPage = location.pathname === "/menu";

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: apiClient.getCurrentUser,
    enabled: auth.status === "authenticated"
  });

  const { data: reservations } = useQuery({
    queryKey: ['userReservations'],
    queryFn: apiClient.listUserReservations,
    enabled: auth.status === "authenticated"
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center">
          <Link to="/menu" className="font-bold text-xl">
            UniLunch
          </Link>
        </div>
        
        {isMenuPage && auth.status === "authenticated" && (
          <div className="relative w-full max-w-xs mx-auto">
            <Input
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full"
            />
          </div>
        )}

        {/* Mobile menu button */}
        <button
          className="block md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className={`hidden md:flex items-center gap-4`}>
          {auth.status === "authenticated" && (
            <>
              <Link to="/menu">
                <Button variant="ghost">Меню</Button>
              </Link>
              <Link to="/reservations">
                <Button variant="ghost">
                  Заказы
                  {reservations?.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {reservations.length}
                    </Badge>
                  )}
                </Button>
              </Link>
              {user?.isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost">Админ</Button>
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <User size={20} />
                    <span>{user?.email}</span>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => navigate("/account")}>
                    <Settings size={16} className="mr-2" />
                    <span>Настройки</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => auth.signOut()}>
                    <LogOut size={16} className="mr-2" />
                    <span>Выйти</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </nav>

        {/* Mobile navigation */}
        <nav
          className={`${
            isOpen ? "block" : "hidden"
          } md:hidden absolute top-16 left-0 right-0 bg-background border-b`}
        >
          {auth.status === "authenticated" && (
            <div className="container py-4 space-y-2">
              <Link to="/menu" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  Меню
                </Button>
              </Link>
              <Link to="/reservations" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  Заказы
                  {reservations?.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {reservations.length}
                    </Badge>
                  )}
                </Button>
              </Link>
              {user?.isAdmin && (
                <Link to="/admin" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    Админ
                  </Button>
                </Link>
              )}
              <Separator />
              <Link to="/account" className="block">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Settings size={16} />
                  <span>Настройки</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-red-500"
                onClick={() => auth.signOut()}
              >
                <LogOut size={16} />
                <span>Выйти</span>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}