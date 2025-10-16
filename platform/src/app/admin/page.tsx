'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Проверяем токен из URL параметров
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      // Сохраняем токен в localStorage
      localStorage.setItem('token', token);
    } else {
      // Проверяем токен в localStorage
      const existingToken = localStorage.getItem('token');
      if (!existingToken) {
        setError('Токен не найден. Пожалуйста, войдите в систему.');
        setIsLoading(false);
        return;
      }
    }

    // Перенаправляем на статические файлы админ-панели
    window.location.href = '/admin/index.html';
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-restero-gray-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-restero-green mx-auto mb-4"></div>
          <p className="text-gray-600">Переход в админ-панель...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-restero-gray-bg flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-restero-green text-white px-4 py-2 rounded hover:bg-restero-green-dark"
          >
            Вернуться в дашборд
          </button>
        </div>
      </div>
    );
  }

  return null;
}
