'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Network, 
  Plus, 
  Edit, 
  Trash2, 
  Building2,
  ArrowLeft,
  Users,
  Calendar
} from 'lucide-react';

interface RestaurantNetwork {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  restaurantsCount: number;
  totalBookings: number;
}

const NetworksPage = () => {
  const router = useRouter();
  const [networks, setNetworks] = useState<RestaurantNetwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchNetworks(token);
  }, [router]);

  const fetchNetworks = async (token: string) => {
    try {
      const response = await fetch('/api/networks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNetworks(data);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Ошибка получения сетей:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNetwork = async (networkId: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту сеть? Все рестораны будут отключены от сети.')) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`/api/networks/${networkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setNetworks(prev => prev.filter(n => n.id !== networkId));
      } else {
        alert('Ошибка удаления сети');
      }
    } catch (error) {
      console.error('Ошибка удаления сети:', error);
      alert('Ошибка удаления сети');
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
              <h1 className="text-2xl font-bold text-restero-green">Сети ресторанов</h1>
            </div>
            
            <Button 
              variant="restero"
              onClick={() => router.push('/dashboard/networks/create')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Создать сеть
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {networks.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Network className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                У вас пока нет сетей ресторанов
              </h3>
              <p className="text-gray-600 mb-6">
                Создайте сеть для объединения ваших ресторанов и управления общей базой клиентов
              </p>
              <Button 
                variant="restero"
                onClick={() => router.push('/dashboard/networks/create')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Создать сеть
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {networks.map((network) => (
              <Card key={network.id} className="overflow-hidden">
                <CardHeader className="bg-restero-green-bg">
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Network className="h-5 w-5" />
                    <span>{network.name}</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {network.description && (
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {network.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Building2 className="h-4 w-4" />
                        <span>{network.restaurantsCount} ресторанов</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{network.totalBookings} бронирований</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        network.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {network.isActive ? 'Активна' : 'Неактивна'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(network.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => router.push(`/dashboard/networks/${network.id}/edit`)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Редактировать
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/dashboard/networks/${network.id}/restaurants`)}
                      >
                        <Building2 className="h-4 w-4 mr-1" />
                        Рестораны
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteNetwork(network.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default NetworksPage;
