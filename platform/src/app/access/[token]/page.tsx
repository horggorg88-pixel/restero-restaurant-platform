'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Building2 } from 'lucide-react';

const AccessActivationPage = () => {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [restaurantName, setRestaurantName] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Токен доступа не найден');
      return;
    }

    activateAccess(token);
  }, [token]);

  const activateAccess = async (token: string) => {
    try {
      const response = await fetch('/api/access/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Доступ успешно активирован!');
        setRestaurantName(data.restaurantName);
        
        // Перенаправляем на страницу входа через 3 секунды
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Ошибка активации доступа');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Ошибка соединения с сервером');
    }
  };

  return (
    <div className="min-h-screen bg-restero-gray-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Активация доступа
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center">
            {status === 'loading' && (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 text-restero-green animate-spin mx-auto" />
                <p className="text-gray-600">Активация доступа...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Доступ активирован!
                </h3>
                {restaurantName && (
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <Building2 className="h-4 w-4" />
                    <span>{restaurantName}</span>
                  </div>
                )}
                <p className="text-green-600 font-medium">{message}</p>
                <p className="text-sm text-gray-500">
                  Перенаправление на страницу входа...
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <XCircle className="h-12 w-12 text-red-500 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Ошибка активации
                </h3>
                <p className="text-red-600 font-medium">{message}</p>
                <div className="space-y-2">
                  <Button
                    onClick={() => router.push('/auth/login')}
                    variant="restero"
                    className="w-full"
                  >
                    Перейти к входу
                  </Button>
                  <Button
                    onClick={() => router.push('/')}
                    variant="outline"
                    className="w-full"
                  >
                    На главную
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccessActivationPage;
