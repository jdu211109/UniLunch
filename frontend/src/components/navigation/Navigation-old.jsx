// src/components/navigation/Navigation.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../utils/apiClient.js";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useLanguage } from "../../hooks/useLanguage";
import { 
  ChevronDown, 
  Menu, 
  X, 
  Calendar, 
  User, 
  LogOut, 
  Settings,
  Sun,
  Moon,
  Globe
} from "lucide-react";
import {
  Button,
  Badge,
  Input,
  Separator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Switch
} from "../ui/index.js";

export default function Navigation({ searchQuery = "", setSearchQuery = () => {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const { language, setLanguage, t } = useLanguage();
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMenuPage = location.pathname === "/menu";

  // Применяем тему при изменении
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Функция переключения темы
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
  };

  // Загрузка темы при монтировании
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

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
              placeholder={t('common.search')}
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
              {/* Theme and Language controls */}
              <div className="flex items-center gap-4 mr-4">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleTheme}
                    className="w-9 h-9 p-0"
                  >
                    {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
                  </Button>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="h-9 bg-transparent border-0 outline-none text-sm cursor-pointer hover:text-primary"
                >
                  <option value="ru">РУС</option>
                  <option value="en">ENG</option>
                  <option value="uz">UZB</option>
                  <option value="ja">日本語</option>
                </select>
              </div>

              <Link to="/reservations">
                <Button variant="ghost">
                  {t('common.orders')}
                  {reservations?.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {reservations.length}
                    </Badge>
                  )}
                </Button>
              </Link>
              {user?.isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost">{t('common.admin')}</Button>
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <User size={20} />
                    <span className="max-w-[150px] truncate">{user?.email}</span>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onSelect={() => navigate("/account")}>
                    <Settings size={16} className="mr-2" />
                    <span>{t('common.settings')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => auth.signOut()} className="text-red-500">
                    <LogOut size={16} className="mr-2" />
                    <span>{t('common.logout')}</span>
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
              
              {/* Настройки профиля */}
              <Link to="/account" className="block">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Settings size={16} />
                  <span>Настройки профиля</span>
                </Button>
              </Link>
              
              {/* Переключатель темы */}
              <div className="px-4 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {theme === 'light' ? <Sun size={16} className="mr-2" /> : <Moon size={16} className="mr-2" />}
                    <span>Тема</span>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                </div>
              </div>
              
              {/* Выбор языка */}
              <div className="px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Globe size={16} />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="flex h-8 w-full items-center bg-transparent px-2 text-sm outline-none"
                  >
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                    <option value="uz">O'zbek</option>
                    <option value="ja">日本語</option>
                  </select>
                </div>
              </div>
              
              <Separator />
              
              {/* Кнопка выхода */}
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