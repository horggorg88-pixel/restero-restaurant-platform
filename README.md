# 🚀 Restero - Система управления ресторанами

Полноценная система управления ресторанами с бронированиями, доступами сотрудников и объединением в сети.

## Быстрый старт

### 1. Установка зависимостей
```bash
npm run setup
```

### 2. Запуск проекта
```bash
npm run dev
```

**Результат:**
- Платформа: http://localhost:3000
- Админ-панель: http://localhost:3001

## Доступные команды

### Основные
- `npm run dev` - запуск фронтенд сервисов (платформа + админ)
- `npm run build` - сборка всех приложений
- `npm run setup` - установка всех зависимостей

### Индивидуальные сервисы
- `npm run dev:platform` - только платформа
- `npm run dev:admin` - только админ-панель

### Docker
- `npm run docker:dev` - Docker в режиме разработки
- `npm run docker:prod` - Docker в продакшене
- `npm run docker:down` - остановка Docker
- `npm run docker:logs` - просмотр логов

### Утилиты
- `npm run clean` - очистка node_modules
- `npm run install:all` - установка всех зависимостей

## Требования

### Для фронтенд разработки (`npm run dev`)
- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0

### Для Docker (`npm run docker:*`)
- **Docker**: >= 20.0.0
- **Docker Compose**: >= 2.0.0

## Архитектура

### Redis-Only Architecture
Проект использует **Redis** как единственный источник данных:

- **Next.js Platform** (TypeScript) - основной фронтенд
- **React Admin Panel** (TypeScript) - админка  
- **Redis Cloud** - база данных и кэш
- **Next.js API Routes** - бэкенд API

### Преимущества:
- ✅ **Единый язык** - TypeScript везде
- ✅ **Высокая производительность** - in-memory Redis
- ✅ **Простота деплоя** - меньше сервисов
- ✅ **Горизонтальное масштабирование**
- ✅ **Автоматическая очистка** - TTL

## Структура проекта

```
restaurant-platform/
├── package.json              # Корневой package.json
├── platform/                 # Next.js приложение
├── admin/gills-moscow-front/ # React админ-панель
├── api/                      # Laravel API
└── docker-compose.yml        # Docker конфигурация
```

## Разработка

### Hot Reload
Все сервисы поддерживают автоматическую перезагрузку:
- Next.js перезагружается при изменении файлов
- Vite (React) перезагружается при изменении файлов
- Laravel перезагружается при изменении файлов

### Отладка
- Логи Next.js: в консоли терминала
- Логи React: в консоли терминала
- Логи Laravel: `storage/logs/laravel.log`
- Docker логи: `npm run docker:logs`

## Troubleshooting

### Проблемы с портами
Если порты заняты, измените их в:
- Next.js: `platform/package.json`
- React: `admin/gills-moscow-front/vite.config.ts`
- Laravel: `api/.env`

### Проблемы с зависимостями
```bash
npm run clean
npm run install:all
```

### Проблемы с Docker
```bash
npm run docker:down
npm run docker:dev
```

## Лицензия

MIT License
