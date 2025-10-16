#!/bin/bash

echo "🚀 Запуск локального стека Restero..."
echo ""

# Проверяем наличие Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker Desktop."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен. Установите Docker Compose."
    exit 1
fi

echo "📦 Собираем и запускаем контейнеры..."
echo ""

# Запускаем локальный стек
docker-compose -f docker-compose.local.yml up --build

echo ""
echo "✅ Локальный стек запущен!"
echo ""
echo "🌐 Доступные сервисы:"
echo "   • Платформа: http://localhost:3000"
echo "   • API: http://localhost:8000"
echo "   • Админка: http://localhost:3001"
echo "   • MySQL: localhost:3306"
echo "   • Redis: localhost:6379"
echo ""
echo "📝 Для остановки: npm run docker:local:down"
echo "📋 Для логов: npm run docker:local:logs"
