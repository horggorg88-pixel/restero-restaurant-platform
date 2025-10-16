'use client';

import { useEffect } from 'react';

export default function AdminPage() {
  useEffect(() => {
    // Перенаправляем на статические файлы админ-панели
    window.location.href = '/admin/index.html';
  }, []);

  return (
    <div className="min-h-screen bg-restero-gray-bg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-restero-green mx-auto mb-4"></div>
        <p className="text-gray-600">Переход в админ-панель...</p>
      </div>
    </div>
  );
}