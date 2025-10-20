import React from 'react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Страница не найдена</h1>
        <p className="text-gray-600">Запрашиваемая страница не существует.</p>
      </div>
    </div>
  );
}


