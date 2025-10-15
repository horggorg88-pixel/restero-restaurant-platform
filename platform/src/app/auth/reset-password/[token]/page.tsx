'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

const ResetPasswordPage = () => {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isValidToken, setIsValidToken] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      setError('Токен сброса пароля не найден');
    }
  }, [token]);

  const validateForm = (): boolean => {
    if (!password.trim()) {
      setError('Введите новый пароль');
      return false;
    }

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
          confirmPassword
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        
        // Автоматически перенаправляем на страницу входа через 3 секунды
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        setError(result.message || 'Произошла ошибка при сбросе пароля');
      }

    } catch (error) {
      console.error('Ошибка сброса пароля:', error);
      setError('Произошла ошибка соединения с сервером');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-restero-gray-bg flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 sm:space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-restero-green mb-2">Restero</h1>
            <p className="text-gray-600">Система управления ресторанами</p>
          </div>

          <Card>
            <CardContent className="p-8 text-center">
              <div className="space-y-6">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Недействительная ссылка
                  </h2>
                  <p className="text-gray-600">
                    Ссылка для сброса пароля недействительна или истекла.
                  </p>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => router.push('/auth/forgot-password')}
                    variant="restero"
                    className="w-full"
                  >
                    Запросить новую ссылку
                  </Button>
                  
                  <Button
                    onClick={() => router.push('/auth/login')}
                    variant="outline"
                    className="w-full"
                  >
                    Вернуться к входу
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-restero-gray-bg flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 sm:space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-restero-green mb-2">Restero</h1>
            <p className="text-gray-600">Система управления ресторанами</p>
          </div>

          <Card>
            <CardContent className="p-8 text-center">
              <div className="space-y-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Пароль успешно изменен!
                  </h2>
                  <p className="text-gray-600">
                    Ваш пароль был успешно обновлен. Теперь вы можете войти в систему с новым паролем.
                  </p>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => router.push('/auth/login')}
                    variant="restero"
                    className="w-full"
                  >
                    Войти в аккаунт
                  </Button>
                  
                  <p className="text-sm text-gray-500">
                    Автоматическое перенаправление через 3 секунды...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-restero-gray-bg flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* Логотип */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-restero-green mb-2">Restero</h1>
          <p className="text-gray-600">Система управления ресторанами</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Создание нового пароля
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Введите новый пароль для вашего аккаунта
            </p>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Новый пароль */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Новый пароль</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Введите новый пароль"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    className={error ? 'border-red-500 pr-10' : 'pr-10'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Подтверждение пароля */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Подтвердите пароль</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Подтвердите новый пароль"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError('');
                    }}
                    className={error ? 'border-red-500 pr-10' : 'pr-10'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Ошибка */}
              {error && (
                <div className="flex items-center space-x-2 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              {/* Требования к паролю */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>Пароль должен содержать:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Минимум 6 символов</li>
                  <li>Рекомендуется использовать буквы и цифры</li>
                </ul>
              </div>

              {/* Кнопки */}
              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="restero"
                  className="w-full h-11"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Сохранение...
                    </>
                  ) : (
                    'Сохранить новый пароль'
                  )}
                </Button>
                
                <Button
                  type="button"
                  onClick={() => router.push('/auth/login')}
                  variant="outline"
                  className="w-full h-11"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Вернуться к входу
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
