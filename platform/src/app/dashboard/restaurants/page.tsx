'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Calendar,
  ArrowLeft,
  Image as ImageIcon
} from 'lucide-react';

interface Restaurant {
  id: number;
  name: string;
  address: string;
  photo?: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  isActive: boolean;
  createdAt: string;
  bookingsCount: number;
  accessesCount: number;
}

const RestaurantsPage = () => {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем авторизацию
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
        setRestaurants(data);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Ошибка получения ресторанов:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRestaurant = async (restaurantId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот ресторан?')) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`/api/restaurants/${restaurantId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setRestaurants(prev => prev.filter(r => r.id !== restaurantId));
      } else {
        alert('Ошибка удаления ресторана');
      }
    } catch (error) {
      console.error('Ошибка удаления ресторана:', error);
      alert('Ошибка удаления ресторана');
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
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Назад</span>
              </Button>
              <h1 className="text-lg sm:text-2xl font-bold text-restero-green">Мои рестораны</h1>
            </div>
            
            <Button 
              variant="restero"
              onClick={() => router.push('/dashboard/restaurants/create')}
              size="sm"
              className="px-3 sm:px-4"
            >
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Создать ресторан</span>
              <span className="sm:hidden">Создать</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 sm:py-8">
        {restaurants.length === 0 ? (
          <Card className="text-center py-8 sm:py-12">
            <CardContent className="px-4 sm:px-6">
              <Building2 className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                У вас пока нет ресторанов
              </h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Создайте первый ресторан для начала работы с системой бронирований
              </p>
              <Button 
                variant="restero"
                onClick={() => router.push('/dashboard/restaurants/create')}
                className="w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Создать ресторан
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {restaurants.map((restaurant) => (
              <Card key={restaurant.id} className="overflow-hidden hover-lift">
                <div className="aspect-video bg-gray-200 relative">
                  {restaurant.photo ? (
                    <img 
                      src={restaurant.photo} 
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      restaurant.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {restaurant.isActive ? 'Активен' : 'Неактивен'}
                    </span>
                  </div>
                </div>
                
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-base sm:text-lg line-clamp-1">{restaurant.name}</CardTitle>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">{restaurant.address}</p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {restaurant.description && (
                      <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">
                        {restaurant.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="truncate">{restaurant.bookingsCount} бронирований</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="truncate">{restaurant.accessesCount} сотрудников</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-2">
                      <Button 
                        variant="resteroOutline" 
                        size="sm" 
                        className="flex-1 h-8 sm:h-9 text-xs sm:text-sm hover-lift"
                        onClick={() => router.push(`/dashboard/restaurants/${restaurant.id}/edit`)}
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                        <span className="hidden sm:inline">Редактировать</span>
                        <span className="sm:hidden">Изменить</span>
                      </Button>
                      <Button 
                        variant="restero"
                        size="sm"
                        className="flex-1 h-8 sm:h-9 text-xs sm:text-sm hover-lift"
                        onClick={() => router.push(`/dashboard/restaurants/${restaurant.id}/accesses`)}
                      >
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                        <span className="hidden sm:inline">Доступы</span>
                        <span className="sm:hidden">Доступы</span>
                      </Button>
                      <Button 
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteRestaurant(restaurant.id)}
                        className="h-8 sm:h-9 px-2 sm:px-3 hover-lift"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
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

export default RestaurantsPage;
