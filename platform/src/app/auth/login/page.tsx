'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

type AuthMode = 'login' | 'register';

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const router = useRouter();

  const handleAuthSuccess = () => {
    // Перенаправляем в личный кабинет после успешной авторизации
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-restero-gray-bg flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* Логотип */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-restero-green mb-2">Restero</h1>
          <p className="text-gray-600">Система управления ресторанами</p>
        </div>

        {/* Формы авторизации */}
        {mode === 'login' ? (
          <LoginForm
            onSuccess={handleAuthSuccess}
            onSwitchToRegister={() => setMode('register')}
            onSwitchToForgotPassword={() => {
              router.push('/auth/forgot-password');
            }}
          />
        ) : (
          <RegisterForm
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setMode('login')}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
