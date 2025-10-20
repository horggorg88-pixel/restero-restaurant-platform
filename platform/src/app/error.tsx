'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-lg text-center">
          <h1 className="text-2xl font-semibold mb-2">Произошла ошибка</h1>
          <p className="text-gray-600 mb-4">{error?.message || 'Непредвиденная ошибка'}</p>
          {error?.digest ? (
            <p className="text-xs text-gray-400 mb-4">Код: {error.digest}</p>
          ) : null}
          <button
            onClick={reset}
            className="px-4 py-2 rounded bg-black text-white hover:opacity-90"
          >
            Попробовать снова
          </button>
        </div>
      </body>
    </html>
  );
}


