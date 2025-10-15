'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  ArrowLeft, 
  TrendingUp,
  Users,
  Calendar,
  Clock,
  Building2,
  Download
} from 'lucide-react';

interface AnalyticsData {
  totalBookings: number;
  totalRevenue: number;
  averageBookingDuration: number;
  topRestaurants: Array<{
    id: number;
    name: string;
    bookingsCount: number;
    revenue: number;
  }>;
  bookingsByMonth: Array<{
    month: string;
    bookings: number;
    revenue: number;
  }>;
  bookingsByDay: Array<{
    day: string;
    bookings: number;
  }>;
}

const AnalyticsPage = () => {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchAnalytics(token);
  }, [router]);

  const fetchAnalytics = async (token: string) => {
    try {
      const response = await fetch('/api/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        setError('Ошибка загрузки аналитики');
      }
    } catch (error) {
      console.error('Ошибка получения аналитики:', error);
      setError('Ошибка соединения с сервером');
    } finally {
      setIsLoading(false);
    }
  };

  const exportReport = () => {
    // В реальном приложении здесь был бы экспорт в Excel/PDF
    alert('Экспорт отчета. В реальном приложении здесь будет скачивание файла.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-restero-gray-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-restero-green mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка аналитики...</p>
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
              <h1 className="text-2xl font-bold text-restero-green">Аналитика и отчеты</h1>
            </div>
            
            <Button 
              variant="restero"
              onClick={exportReport}
            >
              <Download className="h-4 w-4 mr-2" />
              Экспорт отчета
            </Button>
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

        {analytics ? (
          <>
            {/* Общая статистика */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Всего бронирований</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.totalBookings}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Общая выручка</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.totalRevenue.toLocaleString()} ₽</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Средняя длительность</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.averageBookingDuration} мин</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Средний чек</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {analytics.totalBookings > 0 ? Math.round(analytics.totalRevenue / analytics.totalBookings).toLocaleString() : 0} ₽
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Топ ресторанов */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-restero-green" />
                    <span>Топ ресторанов</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  {analytics.topRestaurants.length === 0 ? (
                    <div className="text-center py-8">
                      <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Нет данных о ресторанах</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {analytics.topRestaurants.map((restaurant, index) => (
                        <div key={restaurant.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-restero-green text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{restaurant.name}</p>
                              <p className="text-sm text-gray-600">{restaurant.bookingsCount} бронирований</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{restaurant.revenue.toLocaleString()} ₽</p>
                            <p className="text-sm text-gray-600">выручка</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Бронирования по месяцам */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-restero-green" />
                    <span>Бронирования по месяцам</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  {analytics.bookingsByMonth.length === 0 ? (
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Нет данных за последние месяцы</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {analytics.bookingsByMonth.map((month, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-restero-green rounded-full"></div>
                            <span className="text-sm font-medium">{month.month}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{month.bookings} бронирований</p>
                            <p className="text-xs text-gray-600">{month.revenue.toLocaleString()} ₽</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Бронирования по дням недели */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-restero-green" />
                  <span>Бронирования по дням недели</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {analytics.bookingsByDay.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Нет данных по дням недели</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-2">
                    {analytics.bookingsByDay.map((day, index) => (
                      <div key={index} className="text-center p-3 border rounded-lg">
                        <p className="text-sm font-medium">{day.day}</p>
                        <p className="text-lg font-bold text-restero-green">{day.bookings}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Аналитика недоступна
              </h3>
              <p className="text-gray-600 mb-6">
                Недостаточно данных для отображения аналитики
              </p>
              <Button 
                variant="restero"
                onClick={() => router.push('/dashboard/restaurants')}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Управление ресторанами
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AnalyticsPage;
