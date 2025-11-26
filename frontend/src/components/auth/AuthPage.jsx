// src/components/auth/AuthPage.jsx
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useToastContext } from "../../hooks/useToastContext.js";
import { apiClient } from "../../utils/apiClient.js";
import { Lock, Mail, Eye, EyeOff, User, Clock, CreditCard, Smartphone, CheckCircle, ArrowLeft } from "lucide-react";

export default function AuthPage() {
  const auth = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(null); // null, 'email', 'code', 'reset'
  const [resetEmail, setResetEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [resetPasswordData, setResetPasswordData] = useState({
    password: "",
    password_confirmation: ""
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  const { toast } = useToastContext();

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      return await auth.signIn(credentials);
    },
    onSuccess: () => {
      toast({
        title: "Успешно!",
        description: "Вы успешно вошли в систему",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка входа",
        description: error instanceof Error ? error.message : "Не удалось войти в систему",
        variant: "destructive",
      });
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async (userData) => {
      return await auth.signUp(userData);
    },
    onSuccess: () => {
      toast({
        title: "Успешно!",
        description: "Регистрация прошла успешно",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка регистрации",
        description: error instanceof Error ? error.message : "Не удалось зарегистрироваться",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      loginMutation.mutate({
        email: formData.email,
        password: formData.password
      });
    } else {
      if (formData.password !== formData.password_confirmation) {
        toast({
          title: "Ошибка",
          description: "Пароли не совпадают",
          variant: "destructive",
        });
        return;
      }

      signUpMutation.mutate({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const sendCodeMutation = useMutation({
    mutationFn: async (email) => {
      return await apiClient.sendResetCode({ email });
    },
    onSuccess: () => {
      toast({
        title: "Код отправлен",
        description: `Проверочный код отправлен на ${resetEmail}`,
      });
      setForgotPasswordStep('code');
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось отправить код",
        variant: "destructive",
      });
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: async ({ email, code }) => {
      return await apiClient.verifyResetCode({ email, code });
    },
    onSuccess: () => {
      toast({
        title: "Успешно!",
        description: "Код подтвержден",
      });
      setForgotPasswordStep('reset');
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Неверный код",
        variant: "destructive",
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ email, code, password, password_confirmation }) => {
      return await apiClient.resetPassword({ email, code, password, password_confirmation });
    },
    onSuccess: () => {
      toast({
        title: "Успешно!",
        description: "Пароль успешно изменен",
      });
      setForgotPasswordStep(null);
      setResetEmail("");
      setVerificationCode(["", "", "", "", "", ""]);
      setResetPasswordData({ password: "", password_confirmation: "" });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось сбросить пароль",
        variant: "destructive",
      });
    },
  });

  const handleForgotPassword = () => {
    setForgotPasswordStep('email');
  };

  const handleSendCode = (e) => {
    e.preventDefault();
    if (!resetEmail) {
      toast({
        title: "Ошибка",
        description: "Введите email",
        variant: "destructive",
      });
      return;
    }
    sendCodeMutation.mutate(resetEmail);
  };

  const handleCodeChange = (index, value) => {
    if (value.length > 1) value = value[0];
    if (!/^[0-9]*$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    const code = verificationCode.join('');
    if (code.length !== 6) {
      toast({
        title: "Ошибка",
        description: "Введите 6-значный код",
        variant: "destructive",
      });
      return;
    }
    verifyCodeMutation.mutate({ email: resetEmail, code });
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (resetPasswordData.password !== resetPasswordData.password_confirmation) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают",
        variant: "destructive",
      });
      return;
    }
    const code = verificationCode.join('');
    resetPasswordMutation.mutate({
      email: resetEmail,
      code,
      password: resetPasswordData.password,
      password_confirmation: resetPasswordData.password_confirmation
    });
  };

  const handleBackToLogin = () => {
    setForgotPasswordStep(null);
    setResetEmail("");
    setVerificationCode(["", "", "", "", "", ""]);
  };


  if (auth.status === "authenticated") {
    return <Navigate to="/menu" />;
  }

  const isLoading = loginMutation.isPending || signUpMutation.isPending;

  const benefits = [
    {
      icon: Clock,
      title: "Заказ без очередей",
      description: "Экономьте время - заказывайте заранее"
    },
    {
      icon: Smartphone,
      title: "Онлайн бронирование",
      description: "Бронируйте обед в пару кликов"
    },
    {
      icon: CreditCard,
      title: "Удобная оплата",
      description: "Оплачивайте онлайн безопасно"
    },
    {
      icon: CheckCircle,
      title: "Гарантия качества",
      description: "Свежие блюда каждый день"
    }
  ];

  return (
    <div className="auth-split-container min-h-screen flex">
      {/* Left Side - Benefits */}
      <div className="auth-left-side hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center px-12 xl:px-16 text-white w-full">
          <div className="mb-12 text-center">
            <h1 className="text-5xl xl:text-6xl font-bold mb-4 leading-tight bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              UniLunch
            </h1>
            <p className="text-xl xl:text-2xl text-white/90 font-light">
              Ваш умный помощник для заказа обедов
            </p>
          </div>

          <div className="space-y-6 w-full max-w-md">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-white/80 text-sm">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="auth-right-side w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
              UniLunch
            </h1>
            <p className="text-gray-600">Ваш умный помощник для заказа обедов</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
            {/* Forgot Password - Email Step */}
            {forgotPasswordStep === 'email' && (
              <>
                <button
                  onClick={handleBackToLogin}
                  className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Назад
                </button>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Забыли пароль?
                  </h2>
                  <p className="text-white/80">
                    Введите ваш email для получения кода восстановления
                  </p>
                </div>

                <form onSubmit={handleSendCode} className="space-y-5">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <Mail className="h-5 w-5 text-white/70 group-focus-within:text-orange-400 transition-colors" />
                    </div>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="example@university.edu"
                      className="w-full pl-12 pr-4 py-3 bg-white/20 border-2 border-white/30 text-white placeholder-white/50 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 focus:bg-white/30 outline-none transition-all"
                      required
                      disabled={sendCodeMutation.isPending}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={sendCodeMutation.isPending}
                  >
                    {sendCodeMutation.isPending ? "Отправка..." : "Отправить код"}
                  </button>
                </form>
              </>
            )}

            {/* Forgot Password - Code Verification Step */}
            {forgotPasswordStep === 'code' && (
              <>
                <button
                  onClick={handleBackToLogin}
                  className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Назад
                </button>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Введите код
                  </h2>
                  <p className="text-white/80">
                    Мы отправили 6-значный код на<br />
                    <span className="font-semibold text-orange-400">{resetEmail}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyCode} className="space-y-6">
                  <div className="flex justify-center gap-2">
                    {verificationCode.map((digit, index) => (
                      <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        className="w-12 h-14 text-center text-2xl font-bold bg-white/20 border-2 border-white/30 text-white rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 focus:bg-white/30 outline-none transition-all"
                        disabled={verifyCodeMutation.isPending}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={verifyCodeMutation.isPending}
                  >
                    {verifyCodeMutation.isPending ? "Проверка..." : "Подтвердить"}
                  </button>

                  <button
                    type="button"
                    onClick={handleSendCode}
                    className="w-full text-white/80 hover:text-white text-sm transition-colors"
                    disabled={sendCodeMutation.isPending}
                  >
                    Отправить код повторно
                  </button>
                </form>
              </>
            )}

            {/* Forgot Password - Reset Password Step */}
            {forgotPasswordStep === 'reset' && (
              <>
                <button
                  onClick={handleBackToLogin}
                  className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Назад к входу
                </button>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Новый пароль
                  </h2>
                  <p className="text-white/80">
                    Введите новый пароль для вашего аккаунта
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <Lock className="h-5 w-5 text-white/70 group-focus-within:text-orange-400 transition-colors" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={resetPasswordData.password}
                      onChange={(e) => setResetPasswordData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Новый пароль"
                      className="w-full pl-12 pr-12 py-3 bg-white/20 border-2 border-white/30 text-white placeholder-white/50 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 focus:bg-white/30 outline-none transition-all"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center z-10"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-white/70 hover:text-orange-400 transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-white/70 hover:text-orange-400 transition-colors" />
                      )}
                    </button>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <Lock className="h-5 w-5 text-white/70 group-focus-within:text-orange-400 transition-colors" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={resetPasswordData.password_confirmation}
                      onChange={(e) => setResetPasswordData(prev => ({ ...prev, password_confirmation: e.target.value }))}
                      placeholder="Подтвердите пароль"
                      className="w-full pl-12 pr-12 py-3 bg-white/20 border-2 border-white/30 text-white placeholder-white/50 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 focus:bg-white/30 outline-none transition-all"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center z-10"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-white/70 hover:text-orange-400 transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-white/70 hover:text-orange-400 transition-colors" />
                      )}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={resetPasswordMutation.isPending}
                  >
                    {resetPasswordMutation.isPending ? "Сохранение..." : "Сбросить пароль"}
                  </button>
                </form>
              </>
            )}

            {/* Normal Login/Register Form */}
            {!forgotPasswordStep && (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {isLogin ? "С возвращением!" : "Создать аккаунт"}
                  </h2>
                  <p className="text-white/80">
                    {isLogin ? "Войдите в свой аккаунт" : "Заполните форму для регистрации"}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-4">
                    {!isLogin && (
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                          <User className="h-5 w-5 text-white/70 group-focus-within:text-orange-400 transition-colors" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Полное имя"
                          className="w-full pl-12 pr-4 py-3 bg-white/20 border-2 border-white/30 text-white placeholder-white/50 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 focus:bg-white/30 outline-none transition-all"
                          required
                        />
                      </div>
                    )}

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Mail className="h-5 w-5 text-white/70 group-focus-within:text-orange-400 transition-colors" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@university.edu"
                        className="w-full pl-12 pr-4 py-3 bg-white/20 border-2 border-white/30 text-white placeholder-white/50 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 focus:bg-white/30 outline-none transition-all"
                        required
                      />
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Lock className="h-5 w-5 text-white/70 group-focus-within:text-orange-400 transition-colors" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Пароль"
                        className="w-full pl-12 pr-12 py-3 bg-white/20 border-2 border-white/30 text-white placeholder-white/50 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 focus:bg-white/30 outline-none transition-all"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center z-10"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-white/70 hover:text-orange-400 transition-colors" />
                        ) : (
                          <Eye className="h-5 w-5 text-white/70 hover:text-orange-400 transition-colors" />
                        )}
                      </button>
                    </div>

                    {!isLogin && (
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                          <Lock className="h-5 w-5 text-white/70 group-focus-within:text-orange-400 transition-colors" />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="password_confirmation"
                          value={formData.password_confirmation}
                          onChange={handleChange}
                          placeholder="Подтвердите пароль"
                          className="w-full pl-12 pr-12 py-3 bg-white/20 border-2 border-white/30 text-white placeholder-white/50 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 focus:bg-white/30 outline-none transition-all"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-4 flex items-center z-10"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-white/70 hover:text-orange-400 transition-colors" />
                          ) : (
                            <Eye className="h-5 w-5 text-white/70 hover:text-orange-400 transition-colors" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {isLogin && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                      >
                        Забыли пароль?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Обработка..."
                      : isLogin ? "Войти" : "Зарегистрироваться"}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-white/80 hover:text-white font-medium transition-colors"
                  >
                    {isLogin ? (
                      <>Нет аккаунта? <span className="text-orange-400 hover:text-orange-300 font-semibold">Зарегистрироваться</span></>
                    ) : (
                      <>Уже есть аккаунт? <span className="text-orange-400 hover:text-orange-300 font-semibold">Войти</span></>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {!forgotPasswordStep && (
            <p className="text-center text-white/70 text-sm mt-6">
              Продолжая, вы соглашаетесь с нашими{" "}
              <a href="#terms" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
                Правилами использования
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
