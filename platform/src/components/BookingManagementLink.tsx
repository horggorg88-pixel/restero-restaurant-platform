'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, Users, BarChart3 } from 'lucide-react';
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
  bookingCount = 0,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenBookingManagement = async () => {
    setIsLoading(true);
    
    try {
      // Переходим на страницу управления бронированиями в платформе
      window.location.href = '/dashboard/booking-management';
      
    } catch (error) {
      console.error('Ошибка при переходе в панель управления бронированиями:', error);
      alert('Ошибка при переходе в панель управления бронированиями');
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
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-lg font-semibold text-gray-900">{bookingCount}</div>
                <div className="text-xs text-gray-600">Активных броней</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-lg font-semibold text-gray-900">98%</div>
                <div className="text-xs text-gray-600">Точность</div>
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
