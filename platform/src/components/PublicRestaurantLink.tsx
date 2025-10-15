'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ExternalLink, 
  Eye, 
  Share2, 
  Copy, 
  CheckCircle,
  Globe,
  BarChart3
} from 'lucide-react';

interface PublicRestaurantLinkProps {
  restaurantId: string;
  restaurantName: string;
  publicUrl: string;
  viewCount?: number;
  bookingCount?: number;
  className?: string;
}

const PublicRestaurantLink: React.FC<PublicRestaurantLinkProps> = ({
  restaurantId,
  restaurantName,
  publicUrl,
  viewCount = 0,
  bookingCount = 0,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Ошибка копирования:', error);
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea');
      textArea.value = publicUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Ресторан ${restaurantName}`,
          text: `Посетите ресторан ${restaurantName}`,
          url: publicUrl,
        });
      } catch (error) {
        console.error('Ошибка при попытке поделиться:', error);
      }
    } else {
      // Fallback - копируем ссылку
      handleCopyLink();
    }
  };

  const handleOpenPublicPage = () => {
    window.open(publicUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className={`hover-lift ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Globe className="h-5 w-5 text-restero-green" />
          <span>Публичная страница</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Ваш ресторан доступен для бронирования гостями через публичную страницу.
          </p>
          
          {/* Статистика */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-lg font-semibold text-gray-900">{viewCount}</div>
                <div className="text-xs text-gray-600">Просмотров</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-lg font-semibold text-gray-900">{bookingCount}</div>
                <div className="text-xs text-gray-600">Бронирований</div>
              </div>
            </div>
          </div>
          
          {/* URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Ссылка на ресторан:</label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600 truncate">
                {publicUrl}
              </div>
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="sm"
                className="flex-shrink-0"
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Кнопки действий */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              onClick={handleOpenPublicPage}
              variant="restero"
              className="w-full h-10 text-sm"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Открыть страницу
            </Button>
            
            <Button
              onClick={handleShare}
              variant="outline"
              className="w-full h-10 text-sm"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Поделиться
            </Button>
          </div>
          
          {/* Дополнительная информация */}
          <div className="text-xs text-gray-500 text-center">
            Гости могут бронировать столы без регистрации
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PublicRestaurantLink;
