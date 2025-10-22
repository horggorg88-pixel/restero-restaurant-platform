'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  ExternalLink, 
  ArrowLeft, 
  Users, 
  Clock,
  CheckCircle
} from 'lucide-react';

const BookingManagementPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    todayBookings: 0
  });

  useEffect(() => {
    // Загружаем реальную статистику бронирований
    fetchBookingStats();
  }, []);

  const fetchBookingStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/bookings/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats({
          totalBookings: data.totalBookings || 0,
          activeBookings: data.activeBookings || 0,
          todayBookings: data.todayBookings || 0
        });
      } else {
        // Если API недоступен, показываем нули
        setStats({
          totalBookings: 0,
          activeBookings: 0,
          todayBookings: 0
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки статистики бронирований:', error);
      // При ошибке показываем нули
      setStats({
        totalBookings: 0,
        activeBookings: 0,
        todayBookings: 0
      });
    }
  };

  const handleOpenAdminPanel = async () => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Необходимо войти в систему');
        return;
      }

      // Определяем базовый URL для админ панели
      let adminBase = 'http://localhost:3001'; // fallback для разработки
      
      // Проверяем переменную окружения
      if (process.env.NEXT_PUBLIC_ADMIN_URL) {
        adminBase = process.env.NEXT_PUBLIC_ADMIN_URL.trim();
      } else {
        // Если переменная не задана, определяем URL на основе текущего домена
        const currentHost = window.location.hostname;
        
        if (currentHost === '37.1.210.31') {
          adminBase = 'http://37.1.210.31:3001';
        } else if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
          adminBase = `http://${currentHost}:3001`;
        }
      }

      const adminUrl = `${adminBase}/?token=${encodeURIComponent(token)}`;
      window.open(adminUrl, '_blank', 'noopener,noreferrer');
      
    } catch (error) {
      console.error('Ошибка при переходе в админ-панель:', error);
      alert('Ошибка при переходе в панель управления бронированиями');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-restero-gray-bg">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Назад в дашборд</span>
              </Button>
              
              <div className="h-6 w-px bg-gray-300" />
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-restero-green" />
                <h1 className="text-xl font-bold text-gray-900">
                  Управление бронированиями
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-restero-green-bg rounded-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                    <p className="text-sm text-gray-600">Всего бронирований</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeBookings}</p>
                    <p className="text-sm text-gray-600">Активных броней</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.todayBookings}</p>
                    <p className="text-sm text-gray-600">Сегодня</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Основная карточка */}
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Calendar className="h-6 w-6 text-restero-green" />
                <span>Панель управления бронированиями</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <p className="text-gray-600 text-lg">
                Откройте полнофункциональную панель управления для просмотра, редактирования и управления всеми бронированиями вашего ресторана.
              </p>

              {/* Возможности */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Просмотр всех бронирований</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Редактирование броней</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Управление столами</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Статистика и аналитика</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Планировщик загрузки</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">База данных клиентов</span>
                </div>
              </div>

              {/* Кнопка перехода */}
              <div className="pt-4">
                <Button
                  onClick={handleOpenAdminPanel}
                  disabled={isLoading}
                  variant="restero"
                  size="lg"
                  className="w-full h-12 text-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Загрузка...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-5 w-5 mr-2" />
                      Открыть панель управления
                    </>
                  )}
                </Button>
              </div>

              {/* Дополнительная информация */}
              <div className="text-sm text-gray-500 text-center">
                Панель откроется в новой вкладке с полным доступом ко всем функциям
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BookingManagementPage;
