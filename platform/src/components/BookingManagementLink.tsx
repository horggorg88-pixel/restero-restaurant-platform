'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BookingManagementLinkProps {
  restaurantId?: string;
  restaurantName?: string;
  bookingCount?: number;
  className?: string;
}

const BookingManagementLink: React.FC<BookingManagementLinkProps> = ({
  restaurantId,
  restaurantName,
  bookingCount: propBookingCount,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [bookingCount, setBookingCount] = useState(propBookingCount || 0);

  useEffect(() => {
    // Загружаем реальное количество активных броней
    fetchActiveBookings();
  }, []);

  const fetchActiveBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/bookings/active', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookingCount(data.count || 0);
      } else {
        // Если API недоступен, используем переданное значение или 0
        setBookingCount(propBookingCount || 0);
      }
    } catch (error) {
      console.error('Ошибка загрузки активных бронирований:', error);
      // При ошибке используем переданное значение или 0
      setBookingCount(propBookingCount || 0);
    }
  };

  const handleOpenBookingManagement = async () => {
    setIsLoading(true);

    try {
      // Формируем адрес админки
      const adminBase =
        (process.env.NEXT_PUBLIC_ADMIN_URL && process.env.NEXT_PUBLIC_ADMIN_URL.trim()) ||
        'http://localhost:3001';

      // Пробрасываем restaurant_id через query, если он известен
      const rid = restaurantId || localStorage.getItem('restaurant_id') || localStorage.getItem('restaurantId') || '';
      const url = rid ? `${adminBase}/?restaurant_id=${encodeURIComponent(rid)}` : `${adminBase}/`;

      // Переходим на страницу авторизации админки (там установим restaurant_id из query)
      window.location.href = url;
    } catch (error) {
      console.error('Ошибка при переходе в админ-панель:', error);
      alert('Ошибка при переходе в админ-панель');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`hover-lift ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Calendar className="h-5 w-5 text-restero-green" />
          <span>Управление бронированиями</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Откройте панель управления бронированиями для просмотра и редактирования всех броней вашего ресторана.
          </p>
          
          {/* Статистика */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-lg font-semibold text-gray-900">{bookingCount}</div>
                <div className="text-xs text-gray-600">Активных броней</div>
              </div>
            </div>
          </div>
          
          {/* Кнопка перехода */}
          <Button
            onClick={handleOpenBookingManagement}
            disabled={isLoading}
            variant="restero"
            className="w-full h-11 text-base"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Загрузка...
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4 mr-2" />
                Управление бронированиями
              </>
            )}
          </Button>
          
          {/* Дополнительная информация */}
          <div className="text-xs text-gray-500 text-center">
            Переход к управлению бронированиями
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingManagementLink;