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

export default function Navigation({ searchQuery = "", setSearchQuery = () => { } }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  const { language, setLanguage, t } = useLanguage();
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMenuPage = location.pathname === "/menu";

  // Загружаем количество товаров в корзине и слушаем изменения
  useEffect(() => {
    const updateCartCount = () => {
      const cart = apiClient.getCart();
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemsCount(totalItems);
    };

    updateCartCount();
    
    // Обновляем каждую секунду для синхронизации между вкладками
    const interval = setInterval(updateCartCount, 1000);
    
    // Слушаем изменения в localStorage
    window.addEventListener('storage', updateCartCount);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  // Применяем тему при изменении
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Функция переключения темы
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: apiClient.getCurrentUser,
    enabled: auth.status === "authenticated"
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo Section */}
        <div className="flex items-center gap-6">
          <Link to="/menu" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">UL</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              UniLunch
            </span>
          </Link>

          {/* Desktop Search */}
          {isMenuPage && auth.status === "authenticated" && (
            <div className="relative hidden md:block">
              <div className="relative">
                <Input
                  placeholder={t('common.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-64 pl-10 pr-4 rounded-full border-2 border-orange-500 bg-muted/50 focus:bg-background focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70 focus-visible:ring-offset-0 focus-visible:border-orange-500 focus-visible:shadow-none transition-all duration-200"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="block md:hidden p-2 rounded-lg hover:bg-accent transition-colors duration-200"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <div className="relative w-6 h-6">
            <span className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 top-3' : 'top-1'}`} />
            <span className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : 'top-3'}`} />
            <span className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ${isOpen ? '-rotate-45 top-3' : 'top-5'}`} />
          </div>
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {auth.status === "authenticated" && (
            <>
              {/* Theme and Language controls */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/50">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="w-8 h-8 p-0 hover:bg-background/80 rounded-full transition-all duration-200"
                  title={theme === 'light' ? t('common.switchTo') + ' ' + t('common.dark') : t('common.switchTo') + ' ' + t('common.light')}
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>

                <div className="w-px h-4 bg-border" />

                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent border-0 outline-none text-sm cursor-pointer hover:text-primary py-1 px-2 rounded transition-colors duration-200"
                  title={t('common.language')}
                >
                  <option value="ru">🇷🇺 РУС</option>
                  <option value="en">🇺🇸 ENG</option>
                  <option value="uz">🇺🇿 UZB</option>
                  <option value="ja">🇯🇵 日本語</option>
                </select>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-1">
                <Button asChild variant="ghost" className="h-9 px-4 rounded-full hover:bg-accent transition-all duration-200">
                  <Link to="/reservations" className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span className="hidden lg:inline">{t('common.orders')}</span>
                    {cartItemsCount > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 min-w-5 text-xs !bg-orange-600 dark:!bg-orange-500 !text-white hover:!bg-orange-700 dark:hover:!bg-orange-600">
                        {cartItemsCount}
                      </Badge>
                    )}
                  </Link>
                </Button>

                {user?.isAdmin && (
                  <Button asChild variant="ghost" className="h-9 px-4 rounded-full hover:bg-accent transition-all duration-200">
                    <Link to="/admin" className="flex items-center gap-2">
                      <Settings size={16} />
                      <span className="hidden lg:inline">{t('common.admin')}</span>
                    </Link>
                  </Button>
                )}
              </div>

              {/* User menu dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-9 gap-2 px-3 rounded-full hover:bg-accent transition-all duration-200 border border-border/50"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <User size={14} className="text-white" />
                    </div>
                    <span className="max-w-32 truncate text-sm font-medium hidden sm:inline">
                      {user?.email?.split('@')[0]}
                    </span>
                    <ChevronDown size={14} className="opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 p-2 bg-background/95 backdrop-blur border border-border/50 shadow-lg z-[100]"
                  sideOffset={4}
                >
                  <div className="px-3 py-2 border-b border-border/50 mb-2">
                    <p className="text-sm font-medium">{user?.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.isAdmin ? t('common.administrator') : t('common.student')}
                    </p>
                  </div>

                  <DropdownMenuItem
                    onSelect={() => navigate("/account")}
                    className="h-9 cursor-pointer rounded-lg focus:bg-accent/80 transition-colors duration-200"
                  >
                    <Settings size={16} className="mr-3 text-muted-foreground" />
                    <span>{t('common.settings')}</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-2 bg-border/50" />

                  <DropdownMenuItem
                    onSelect={() => auth.signOut()}
                    className="h-9 cursor-pointer rounded-lg focus:bg-destructive/10 focus:text-destructive text-destructive/80 hover:text-destructive transition-colors duration-200"
                  >
                    <LogOut size={16} className="mr-3" />
                    <span>{t('common.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </nav>

        {/* Mobile navigation */}
        <div
          className={`${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            } md:hidden fixed top-16 right-0 w-80 max-w-[90vw] h-[calc(100vh-4rem)] bg-background/95 backdrop-blur border-l border-border/50 shadow-xl transition-all duration-300 ease-in-out overflow-y-auto`}
        >
          {auth.status === "authenticated" && (
            <div className="p-6 space-y-6">
              {/* Mobile user info */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.isAdmin ? t('common.administrator') : t('common.student')}
                  </p>
                </div>
              </div>

              {/* Mobile Search */}
              {isMenuPage && (
                <div className="relative">
                  <Input
                    placeholder={t('common.search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 w-full pl-11 pr-4 rounded-xl border-2 border-orange-500 bg-muted/50 focus:bg-background focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70 focus-visible:ring-offset-0 focus-visible:border-orange-500 focus-visible:shadow-none"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Mobile navigation links */}
              <div className="space-y-2">
                <Button asChild variant="ghost" className="w-full justify-start h-12 rounded-xl hover:bg-accent/80 transition-all duration-200" onClick={() => setIsOpen(false)}>
                  <Link to="/reservations" className="flex items-center gap-3">
                    <Calendar size={18} />
                    <span className="font-medium">{t('common.orders')}</span>
                    {cartItemsCount > 0 && (
                      <Badge variant="secondary" className="ml-auto h-6 min-w-6 !bg-orange-600 dark:!bg-orange-500 !text-white hover:!bg-orange-700 dark:hover:!bg-orange-600">
                        {cartItemsCount}
                      </Badge>
                    )}
                  </Link>
                </Button>

                {user?.isAdmin && (
                  <Button asChild variant="ghost" className="w-full justify-start h-12 rounded-xl hover:bg-accent/80 transition-all duration-200" onClick={() => setIsOpen(false)}>
                    <Link to="/admin" className="flex items-center gap-3">
                      <Settings size={18} />
                      <span className="font-medium">{t('common.admin')}</span>
                    </Link>
                  </Button>
                )}

                <Button asChild variant="ghost" className="w-full justify-start h-12 rounded-xl hover:bg-accent/80 transition-all duration-200" onClick={() => setIsOpen(false)}>
                  <Link to="/account" className="flex items-center gap-3">
                    <User size={18} />
                    <span className="font-medium">{t('common.settings')}</span>
                  </Link>
                </Button>
              </div>

              <Separator className="bg-border/50" />

              {/* Theme and Language controls */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border/50">
                  <div className="flex items-center gap-3">
                    {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
                    <span className="font-medium">{t('common.theme')}</span>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                    className="data-[state=checked]:bg-orange-500"
                  />
                </div>

                <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe size={18} />
                    <span className="font-medium">{t('common.language')}</span>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full h-10 bg-background rounded-lg px-3 border border-border/50 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all duration-200"
                  >
                    <option value="ru">🇷🇺 Русский</option>
                    <option value="en">🇺🇸 English</option>
                    <option value="uz">🇺🇿 O'zbek</option>
                    <option value="ja">🇯🇵 日本語</option>
                  </select>
                </div>
              </div>

              <Separator className="bg-border/50" />

              {/* Logout button */}
              <Button
                variant="ghost"
                className="w-full justify-start h-12 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                onClick={() => {
                  auth.signOut();
                  setIsOpen(false);
                }}
              >
                <LogOut size={18} className="mr-3" />
                <span className="font-medium">{t('common.logout')}</span>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile overlay */}
        {isOpen && (
          <div
            className="md:hidden fixed inset-0 top-16 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </header>
  );
}
