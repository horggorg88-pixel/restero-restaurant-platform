'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  Calendar, 
  DollarSign, 
  Plus,
  Settings,
  LogOut,
  Network,
  CreditCard,
  BarChart3
} from 'lucide-react';
import BookingManagementLink from '@/components/BookingManagementLink';
import PublicRestaurantLink from '@/components/PublicRestaurantLink';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

const DashboardPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем авторизацию
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Получаем данные пользователя
    fetchUserData(token);
  }, [router]);

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Токен недействителен
        localStorage.removeItem('token');
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Ошибка получения данных пользователя:', error);
      router.push('/auth/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
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
              <h1 className="text-xl sm:text-2xl font-bold text-restero-green">Restero</h1>
              <span className="text-gray-600 text-sm sm:text-base hidden sm:inline">Панель управления</span>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-gray-700 text-sm sm:text-base hidden sm:inline">
                Добро пожаловать, {user?.firstName} {user?.lastName}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="px-2 sm:px-3">
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Выйти</span>
              </Button>
            </div>
          </div>
          
          {/* Mobile user info */}
          <div className="sm:hidden mt-2">
            <p className="text-sm text-gray-600 truncate">
              Привет, {user?.firstName}!
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Личный кабинет
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Управляйте вашими ресторанами и бронированиями
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="hover-lift">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="p-2 sm:p-3 bg-restero-green-bg rounded-lg">
                  <Building2 className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">0</p>
                  <p className="text-xs sm:text-sm text-gray-600">Ресторанов</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                  <Users className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">0</p>
                  <p className="text-xs sm:text-sm text-gray-600">Сотрудников</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
                  <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">0</p>
                  <p className="text-xs sm:text-sm text-gray-600">Бронирований</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">0 ₽</p>
                  <p className="text-xs sm:text-sm text-gray-600">Доход</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Management and Public Pages */}
        <div className="mb-6 sm:mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BookingManagementLink 
              restaurantId="1"
              restaurantName="Мой ресторан"
              bookingCount={12}
            />
            <PublicRestaurantLink
              restaurantId="1"
              restaurantName="Мой ресторан"
              publicUrl={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/restaurant/1`}
              viewCount={156}
              bookingCount={23}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="hover-lift">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <Building2 className="h-5 w-5 text-restero-green" />
                <span>Мои рестораны</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Управляйте вашими ресторанами, создавайте новые и настраивайте доступы.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
                <Button
                  variant="restero"
                  className="w-full h-10 sm:h-11 text-sm sm:text-base"
                  onClick={() => router.push('/dashboard/restaurants')}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Управление ресторанами</span>
                  <span className="sm:hidden">Рестораны</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-10 sm:h-11 text-sm sm:text-base"
                  onClick={() => router.push('/dashboard/booking-management')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Управление бронированиями</span>
                  <span className="sm:hidden">Бронирования</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-10 sm:h-11 text-sm sm:text-base"
                  onClick={() => router.push('/dashboard/restaurants/create')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Создать ресторан</span>
                  <span className="sm:hidden">Создать</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-10 sm:h-11 text-sm sm:text-base"
                  onClick={() => router.push('/dashboard/networks')}
                >
                  <Network className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Сети ресторанов</span>
                  <span className="sm:hidden">Сети</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-10 sm:h-11 text-sm sm:text-base"
                  onClick={() => router.push('/dashboard/billing')}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Биллинг и подписки</span>
                  <span className="sm:hidden">Биллинг</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-10 sm:h-11 text-sm sm:text-base"
                  onClick={() => router.push('/dashboard/analytics')}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Аналитика и отчеты</span>
                  <span className="sm:hidden">Аналитика</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-10 sm:h-11 text-sm sm:text-base"
                  onClick={() => router.push('/dashboard/settings')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Настройки
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <Settings className="h-5 w-5 text-restero-green" />
                <span>Настройки</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Управляйте настройками аккаунта, тарифами и доступом сотрудников.
              </p>
              <Button 
                variant="outline" 
                className="w-full h-10 sm:h-11 text-sm sm:text-base"
                onClick={() => router.push('/dashboard/settings')}
              >
                Открыть настройки
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
