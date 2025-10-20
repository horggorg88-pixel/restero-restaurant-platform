// Конфигурация для разработки
export const DEV_CONFIG = {
  cors: {
    allowedOrigins: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004',
      'http://localhost:3005',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3002',
      'http://127.0.0.1:3003',
      'http://127.0.0.1:3004',
      'http://127.0.0.1:3005',
    ]
  },
  api: {
    baseUrl: 'http://localhost:3003/api'
  }
};

// Функция для получения разрешенных origins
export function getAllowedOrigins(): string[] {
  // Сначала проверяем переменные окружения
  const envOrigins = process.env.ALLOWED_ORIGINS;
  if (envOrigins) {
    return envOrigins.split(',').map(origin => origin.trim()).filter(Boolean);
  }
  
  // Fallback на конфигурацию разработки
  return DEV_CONFIG.cors.allowedOrigins;
}

