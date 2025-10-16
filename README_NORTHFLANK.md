# Restero Restaurant Platform

Полноценная система управления ресторанами с бронированиями.

## 🚀 Деплой на Northflank

### 1. Подготовка репозитория

1. Создайте новый репозиторий на GitHub
2. Загрузите код:
```bash
git remote add origin https://github.com/YOUR_USERNAME/restero-restaurant-platform.git
git push -u origin main
```

### 2. Настройка Northflank

1. Перейдите на [Northflank](https://app.northflank.com/)
2. Создайте новый проект
3. Подключите GitHub репозиторий
4. Выберите `docker-compose.northflank.yml`

### 3. Переменные окружения

Настройте следующие переменные в Northflank:

```env
# Laravel
APP_KEY=base64:your-app-key-here
APP_ENV=production

# База данных
DB_HOST=your-mysql-host
DB_DATABASE=restero
DB_USERNAME=restero
DB_PASSWORD=your-password

# Redis
REDIS_HOST=your-redis-host

# Next.js
NEXT_PUBLIC_API_URL=https://your-app.northflank.app:8000
NEXTAUTH_URL=https://your-app.northflank.app
NEXTAUTH_SECRET=your-secret-key
```

### 4. Сервисы

- **Платформа**: https://your-app.northflank.app:3000
- **API**: https://your-app.northflank.app:8000

## 🐳 Локальная разработка

```bash
# Запуск локального стека
npm run docker:local

# Остановка
npm run docker:local:down

# Логи
npm run docker:local:logs
```

## 📁 Структура проекта

- `platform/` - Next.js платформа
- `api/` - Laravel API
- `admin/gills-moscow-front/` - React админка
- `docker-compose.local.yml` - локальная конфигурация
- `docker-compose.northflank.yml` - конфигурация для Northflank
- `Dockerfile` - основной Dockerfile
- `Dockerfile.local` - локальная версия

## 🔧 Команды

```bash
# Установка зависимостей
npm run install:all

# Локальная разработка
npm run dev

# Сборка
npm run build

# Docker (локально)
npm run docker:local

# Railway деплой
npm run railway:deploy
```
