'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Network, Building2, Check } from 'lucide-react';

interface Restaurant {
  id: number;
  name: string;
  address: string;
  isActive: boolean;
}

const CreateNetworkPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurants, setSelectedRestaurants] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchRestaurants(token);
  }, [router]);

  const fetchRestaurants = async (token: string) => {
    try {
      const response = await fetch('/api/restaurants', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRestaurants(data.filter((r: Restaurant) => r.isActive));
      }
    } catch (error) {
      console.error('Ошибка получения ресторанов:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRestaurantToggle = (restaurantId: number) => {
    setSelectedRestaurants(prev => 
      prev.includes(restaurantId)
        ? prev.filter(id => id !== restaurantId)
        : [...prev, restaurantId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Валидация
    if (!formData.name.trim()) {
      setError('Название сети обязательно');
      setIsLoading(false);
      return;
    }

    if (selectedRestaurants.length === 0) {
      setError('Выберите хотя бы один ресторан');
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await fetch('/api/networks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          restaurantIds: selectedRestaurants
        })
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/dashboard/networks');
      } else {
        setError(data.message || 'Ошибка создания сети');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-restero-gray-bg">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/dashboard/networks')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Назад</span>
            </Button>
            <h1 className="text-2xl font-bold text-restero-green">Создание сети ресторанов</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Форма создания сети */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Network className="h-5 w-5 text-restero-green" />
                  <span>Информация о сети</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                      {error}
                    </div>
                  )}

                  {/* Название сети */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Название сети *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Введите название сети"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Описание */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Описание</Label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Краткое описание сети ресторанов"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  {/* Кнопка создания */}
                  <Button 
                    type="submit" 
                    variant="restero"
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Создание...' : 'Создать сеть'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Выбор ресторанов */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-restero-green" />
                  <span>Выберите рестораны</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {restaurants.length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      У вас нет активных ресторанов для создания сети
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => router.push('/dashboard/restaurants/create')}
                    >
                      Создать ресторан
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 mb-4">
                      Выберите рестораны для объединения в сеть:
                    </p>
                    
                    {restaurants.map((restaurant) => (
                      <div 
                        key={restaurant.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedRestaurants.includes(restaurant.id)
                            ? 'border-restero-green bg-restero-green-bg'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleRestaurantToggle(restaurant.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              selectedRestaurants.includes(restaurant.id)
                                ? 'border-restero-green bg-restero-green'
                                : 'border-gray-300'
                            }`}>
                              {selectedRestaurants.includes(restaurant.id) && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{restaurant.name}</p>
                              <p className="text-sm text-gray-600">{restaurant.address}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-600">
                        Выбрано ресторанов: <span className="font-medium">{selectedRestaurants.length}</span>
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateNetworkPage;
