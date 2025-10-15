'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Введите email адрес');
      return;
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Введите корректный email адрес');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.message || 'Произошла ошибка при отправке письма');
      }

    } catch (error) {
      console.error('Ошибка восстановления пароля:', error);
      setError('Произошла ошибка соединения с сервером');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-restero-gray-bg flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 sm:space-y-8">
          {/* Логотип */}
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
                    Письмо отправлено!
                  </h2>
                  <p className="text-gray-600">
                    Мы отправили инструкции по восстановлению пароля на адрес{' '}
                    <span className="font-medium text-gray-900">{email}</span>
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-gray-500">
                    Проверьте папку "Спам", если письмо не пришло в течение нескольких минут.
                  </p>
                  
                  <div className="space-y-2">
                    <Button
                      onClick={() => router.push('/auth/login')}
                      variant="restero"
                      className="w-full"
                    >
                      Вернуться к входу
                    </Button>
                    
                    <Button
                      onClick={() => {
                        setIsSuccess(false);
                        setEmail('');
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Отправить еще раз
                    </Button>
                  </div>
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
              Восстановление пароля
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Введите email адрес, на который зарегистрирован ваш аккаунт
            </p>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email поле */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email адрес</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  className={error ? 'border-red-500' : ''}
                  required
                />
                {error && (
                  <div className="flex items-center space-x-2 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}
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
                      Отправка...
                    </>
                  ) : (
                    'Отправить инструкции'
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

            {/* Дополнительная информация */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Вспомнили пароль?{' '}
                <button
                  onClick={() => router.push('/auth/login')}
                  className="text-restero-green hover:underline"
                >
                  Войти в аккаунт
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
