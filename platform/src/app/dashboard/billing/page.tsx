'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  ArrowLeft, 
  Check, 
  AlertCircle,
  Calendar,
  DollarSign,
  Building2,
  Network,
  Plus
} from 'lucide-react';

interface Subscription {
  id: number;
  type: 'RESTAURANT' | 'NETWORK';
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING';
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  restaurantCount?: number;
  networkId?: number;
}

interface Payment {
  id: number;
  amount: number;
  currency: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  description: string;
  paidAt: string;
  subscriptionId: number;
}

const BillingPage = () => {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchBillingData(token);
  }, [router]);

  const fetchBillingData = async (token: string) => {
    try {
      const [subscriptionsRes, paymentsRes] = await Promise.all([
        fetch('/api/billing/subscriptions', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/billing/payments', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (subscriptionsRes.ok) {
        const subsData = await subscriptionsRes.json();
        setSubscriptions(subsData);
      }

      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json();
        setPayments(paymentsData);
      }
    } catch (error) {
      console.error('Ошибка получения данных биллинга:', error);
      setError('Ошибка загрузки данных');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgradeSubscription = (type: 'RESTAURANT' | 'NETWORK') => {
    router.push(`/dashboard/billing/upgrade?type=${type}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'EXPIRED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Активна';
      case 'EXPIRED': return 'Истекла';
      case 'PENDING': return 'Ожидает оплаты';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-restero-gray-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-restero-green mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-restero-gray-bg">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Назад</span>
              </Button>
              <h1 className="text-2xl font-bold text-restero-green">Биллинг и подписки</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Текущие подписки */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-restero-green" />
                <span>Текущие подписки</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {subscriptions.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    У вас нет активных подписок
                  </p>
                  <div className="space-y-2">
                    <Button 
                      variant="restero"
                      onClick={() => handleUpgradeSubscription('RESTAURANT')}
                      className="w-full"
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      Подключить ресторан
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleUpgradeSubscription('NETWORK')}
                      className="w-full"
                    >
                      <Network className="h-4 w-4 mr-2" />
                      Создать сеть ресторанов
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {subscriptions.map((subscription) => (
                    <div key={subscription.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {subscription.type === 'RESTAURANT' ? (
                            <Building2 className="h-4 w-4 text-restero-green" />
                          ) : (
                            <Network className="h-4 w-4 text-restero-green" />
                          )}
                          <span className="font-medium">
                            {subscription.type === 'RESTAURANT' ? 'Ресторан' : 'Сеть ресторанов'}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                          {getStatusText(subscription.status)}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center justify-between">
                          <span>Стоимость:</span>
                          <span className="font-medium">{subscription.amount} {subscription.currency}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Действует до:</span>
                          <span>{new Date(subscription.endDate).toLocaleDateString('ru-RU')}</span>
                        </div>
                        {subscription.restaurantCount && (
                          <div className="flex items-center justify-between">
                            <span>Ресторанов:</span>
                            <span>{subscription.restaurantCount}</span>
                          </div>
                        )}
                      </div>
                      
                      {subscription.status === 'EXPIRED' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-3"
                          onClick={() => handleUpgradeSubscription(subscription.type)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Продлить подписку
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* История платежей */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-restero-green" />
                <span>История платежей</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {payments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    История платежей пуста
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {payments.slice(0, 10).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          payment.status === 'COMPLETED' ? 'bg-green-100' : 
                          payment.status === 'PENDING' ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          {payment.status === 'COMPLETED' ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{payment.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(payment.paidAt).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{payment.amount} {payment.currency}</p>
                        <p className={`text-xs ${
                          payment.status === 'COMPLETED' ? 'text-green-600' : 
                          payment.status === 'PENDING' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {payment.status === 'COMPLETED' ? 'Оплачено' : 
                           payment.status === 'PENDING' ? 'Ожидает' : 'Ошибка'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Тарифы */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-restero-green" />
              <span>Тарифные планы</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Тариф для ресторана */}
              <div className="border rounded-lg p-6">
                <div className="text-center mb-4">
                  <Building2 className="h-12 w-12 text-restero-green mx-auto mb-2" />
                  <h3 className="text-xl font-bold">Ресторан</h3>
                  <p className="text-gray-600">Управление одним рестораном</p>
                </div>
                
                <div className="text-center mb-6">
                  <span className="text-3xl font-bold text-restero-green">2 990 ₽</span>
                  <span className="text-gray-600">/месяц</span>
                </div>
                
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Управление бронированиями</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Доступы для сотрудников</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Аналитика и отчеты</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Техподдержка 24/7</span>
                  </li>
                </ul>
                
                <Button 
                  variant="restero" 
                  className="w-full"
                  onClick={() => handleUpgradeSubscription('RESTAURANT')}
                >
                  Подключить ресторан
                </Button>
              </div>

              {/* Тариф для сети */}
              <div className="border rounded-lg p-6 border-restero-green">
                <div className="text-center mb-4">
                  <Network className="h-12 w-12 text-restero-green mx-auto mb-2" />
                  <h3 className="text-xl font-bold">Сеть ресторанов</h3>
                  <p className="text-gray-600">Объединение ресторанов в сеть</p>
                </div>
                
                <div className="text-center mb-6">
                  <span className="text-3xl font-bold text-restero-green">1 990 ₽</span>
                  <span className="text-gray-600">/месяц</span>
                </div>
                
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Все функции ресторана</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Общая база клиентов</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Централизованное управление</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Скидка на каждый ресторан</span>
                  </li>
                </ul>
                
                <Button 
                  variant="restero" 
                  className="w-full"
                  onClick={() => handleUpgradeSubscription('NETWORK')}
                >
                  Создать сеть
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BillingPage;
