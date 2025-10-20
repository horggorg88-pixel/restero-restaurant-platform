import React from 'react';
import { Button } from '@shared/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

interface BackToDashboardProps {
  className?: string;
}

const BackToDashboard: React.FC<BackToDashboardProps> = ({ className = '' }) => {
  const handleBackToDashboard = () => {
    // Получаем токен из localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('Токен не найден');
      return;
    }

    // Формируем URL для основной платформы с токеном
    const platformUrl = `${import.meta.env.VITE_PLATFORM_URL || 'http://localhost:3000'}/dashboard?token=${encodeURIComponent(token)}`;
    
    // Переходим на основную платформу
    window.location.href = platformUrl;
  };

  return (
    <Button
      onClick={handleBackToDashboard}
      variant="outline"
      size="sm"
      className={`flex items-center space-x-2 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      <Home className="h-4 w-4" />
      <span>Вернуться в дашборд</span>
    </Button>
  );
};

export default BackToDashboard;
