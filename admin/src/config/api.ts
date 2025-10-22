// Конфигурация для админ панели
export const ADMIN_CONFIG = {
  api: {
    // Автоматическое определение API URL на основе текущего порта
    getBaseUrl: () => {
      // Если есть переменная окружения - используем её
      if (import.meta.env.VITE_BACKEND_API_URL) {
        return import.meta.env.VITE_BACKEND_API_URL;
      }
      
      // Определяем текущий порт админ панели
      const currentPort = window.location.port;
      const currentHost = window.location.hostname;
      
      // Если мы на сервере 37.1.210.31, используем правильный URL
      if (currentHost === '37.1.210.31') {
        return 'http://37.1.210.31:3000/api';
      }
      
      // Маппинг портов админ панели на порты API для локальной разработки
      const portMapping: Record<string, string> = {
        '3001': '3000',  // Admin на 3001 -> Platform на 3000
        '3002': '3003',
        '3003': '3004',
        '3004': '3005',
      };
      
      const apiPort = portMapping[currentPort] || '3000';
      return `http://${currentHost}:${apiPort}/api`;
    }
  }
};

// Функция для получения API URL
export function getApiUrl(): string {
  return ADMIN_CONFIG.api.getBaseUrl();
}

// Функция для получения URL платформы (без /api)
export function getPlatformUrl(): string {
  const apiUrl = getApiUrl();
  return apiUrl.replace('/api', '');
}
