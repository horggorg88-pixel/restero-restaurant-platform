'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  CreditCard, 
  Building2, 
  Network,
  Check,
  AlertCircle
} from 'lucide-react';

interface Restaurant {
  id: number;
  name: string;
  address: string;
  isActive?: boolean;
}

interface Network {
  id: number;
  name: string;
  description?: string;
}

const UpgradePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') as 'RESTAURANT' | 'NETWORK';
  
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [networks, setNetworks] = useState<Network[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<number | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    if (!type || !['RESTAURANT', 'NETWORK'].includes(type)) {
      router.push('/dashboard/billing');
      return;
    }

    fetchData(token);
  }, [router, type]);

  const fetchData = async (token: string) => {
    try {
      if (type === 'RESTAURANT') {
        const response = await fetch('/api/restaurants', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setRestaurants(data.filter((r: Restaurant) => r.isActive));
        }
      } else {
        const response = await fetch('/api/networks', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setNetworks(data);
        }
      }
    } catch (error) {
      console.error('Ошибка получения данных:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await fetch('/api/billing/subscriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type,
          restaurantId: selectedRestaurant,
          networkId: selectedNetwork
        })
      });

      const data = await response.json();

      if (response.ok) {
        // В реальном приложении здесь был бы переход к платежной системе
        alert('Подписка создана! В реальном приложении здесь будет переход к оплате.');
        router.push('/dashboard/billing');
      } else {
        setError(data.message || 'Ошибка создания подписки');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    return type === 'RESTAURANT' ? 'Подключение ресторана' : 'Создание сети ресторанов';
  };

  const getIcon = () => {
    return type === 'RESTAURANT' ? Building2 : Network;
  };

  const getPrice = () => {
    return type === 'RESTAURANT' ? '2 990 ₽' : '1 990 ₽';
  };

  const getDescription = () => {
    return type === 'RESTAURANT' 
      ? 'Выберите ресторан для подключения к системе управления бронированиями'
      : 'Выберите сеть ресторанов для централизованного управления';
  };

  const IconComponent = getIcon();

  return (
    <div className="min-h-screen bg-restero-gray-bg">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/dashboard/billing')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Назад</span>
            </Button>
            <h1 className="text-2xl font-bold text-restero-green">{getTitle()}</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <IconComponent className="h-5 w-5 text-restero-green" />
                <span>{getTitle()}</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Информация о тарифе */}
                <div className="bg-restero-green-bg p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">
                        {type === 'RESTAURANT' ? 'Тариф "Ресторан"' : 'Тариф "Сеть ресторанов"'}
                      </h3>
                      <p className="text-sm text-white/80">{getDescription()}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{getPrice()}</div>
                      <div className="text-sm text-white/80">в месяц</div>
                    </div>
                  </div>
                </div>

                {/* Выбор ресторана или сети */}
                {type === 'RESTAURANT' ? (
                  <div className="space-y-2">
                    <Label>Выберите ресторан</Label>
                    {restaurants.length === 0 ? (
                      <div className="text-center py-8 border rounded-lg">
                        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">
                          У вас нет активных ресторанов
                        </p>
                        <Button 
                          variant="outline"
                          onClick={() => router.push('/dashboard/restaurants/create')}
                        >
                          Создать ресторан
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {restaurants.map((restaurant) => (
                          <div 
                            key={restaurant.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedRestaurant === restaurant.id
                                ? 'border-restero-green bg-restero-green-bg'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedRestaurant(restaurant.id)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                selectedRestaurant === restaurant.id
                                  ? 'border-restero-green bg-restero-green'
                                  : 'border-gray-300'
                              }`}>
                                {selectedRestaurant === restaurant.id && (
                                  <Check className="h-3 w-3 text-white" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{restaurant.name}</p>
                                <p className="text-sm text-gray-600">{restaurant.address}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Выберите сеть</Label>
                    {networks.length === 0 ? (
                      <div className="text-center py-8 border rounded-lg">
                        <Network className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">
                          У вас нет сетей ресторанов
                        </p>
                        <Button 
                          variant="outline"
                          onClick={() => router.push('/dashboard/networks/create')}
                        >
                          Создать сеть
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {networks.map((network) => (
                          <div 
                            key={network.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedNetwork === network.id
                                ? 'border-restero-green bg-restero-green-bg'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedNetwork(network.id)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                selectedNetwork === network.id
                                  ? 'border-restero-green bg-restero-green'
                                  : 'border-gray-300'
                              }`}>
                                {selectedNetwork === network.id && (
                                  <Check className="h-3 w-3 text-white" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{network.name}</p>
                                {network.description && (
                                  <p className="text-sm text-gray-600">{network.description}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Кнопка оформления */}
                <Button 
                  type="submit" 
                  variant="restero"
                  disabled={isLoading || (type === 'RESTAURANT' ? !selectedRestaurant : !selectedNetwork)}
                  className="w-full"
                >
                  {isLoading ? 'Оформление...' : `Оформить подписку за ${getPrice()}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UpgradePage;
