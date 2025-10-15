'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface IntegrationStatusData {
  success: boolean;
  integration: {
    bookingApi: {
      status: 'connected' | 'disconnected';
      url: string;
      error?: string;
    };
    restaurants: {
      count: number;
      error?: string;
    };
    timestamp: string;
  };
}

interface IntegrationStatusProps {
  onStatsUpdate?: (stats: any) => void;
}

export default function IntegrationStatus({ onStatsUpdate }: IntegrationStatusProps) {
  const [status, setStatus] = useState<IntegrationStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIntegrationStatus();
  }, []);

  const fetchIntegrationStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/integration/status');
      const data = await response.json();
      
      if (data.success) {
        setStatus(data);
        setError(null);
        
        // Уведомляем родительский компонент об обновлении статистики
        if (onStatsUpdate) {
          onStatsUpdate({
            restaurants: data.integration?.restaurants?.count || 0,
            bookings: data.integration?.restaurants?.count || 0
          });
        }
      } else {
        setError(data.message || 'Ошибка получения статуса');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
      console.error('Ошибка получения статуса интеграции:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
          <span>Проверка статуса интеграции...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-red-200 bg-red-50">
        <div className="flex items-center space-x-2 text-red-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>Ошибка: {error}</span>
        </div>
        <button 
          onClick={fetchIntegrationStatus}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Попробовать снова
        </button>
      </Card>
    );
  }

  if (!status) return null;

  const { bookingApi, restaurants } = status.integration;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Статус интеграции</h3>
        <button 
          onClick={fetchIntegrationStatus}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Обновить
        </button>
      </div>
      
      <div className="space-y-4">
        {/* Статус API бронирований */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              bookingApi.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm font-medium">API бронирований</span>
          </div>
          <div className="text-right">
            <div className={`text-sm font-medium ${
              bookingApi.status === 'connected' ? 'text-green-600' : 'text-red-600'
            }`}>
              {bookingApi.status === 'connected' ? 'Подключен' : 'Отключен'}
            </div>
            {bookingApi.error && (
              <div className="text-xs text-red-500">{bookingApi.error}</div>
            )}
          </div>
        </div>

        {/* Количество ресторанов в системе бронирований */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Ресторанов в системе бронирований</span>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">{restaurants.count}</div>
            {restaurants.error && (
              <div className="text-xs text-red-500">{restaurants.error}</div>
            )}
          </div>
        </div>

        {/* URL API */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">URL API</span>
          <div className="text-xs text-gray-500 font-mono">{bookingApi.url}</div>
        </div>

        {/* Время последнего обновления */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Последнее обновление</span>
          <div className="text-xs text-gray-500">
            {new Date(status.integration.timestamp).toLocaleString('ru-RU')}
          </div>
        </div>
      </div>
    </Card>
  );
}
