# Деплой Restero на Render

Это руководство поможет вам развернуть платформу Restero (Next.js + Laravel API) на Render.com, используя Docker.

## 1. Подготовка GitHub репозитория

Убедитесь, что ваш код находится в GitHub репозитории. Если вы еще не загрузили его, выполните следующие шаги:

1. **Создайте новый репозиторий на GitHub:**
   Перейдите на [GitHub](https://github.com/new) и создайте новый публичный репозиторий, например, `restero-restaurant-platform`.

2. **Загрузите ваш локальный код в этот репозиторий:**
   ```bash
   # Удалите существующий remote (если он указывает на другой репозиторий)
   git remote remove origin

   # Добавьте новый remote, указывающий на ваш GitHub репозиторий
   git remote add origin https://github.com/YOUR_USERNAME/restero-restaurant-platform.git

   # Загрузите все изменения в ветку main
   git push -u origin main
   ```
   Замените `YOUR_USERNAME` на ваше имя пользователя GitHub.

## 2. Настройка проекта на Render

1. **Войдите в Render:**
   Перейдите на [https://render.com/](https://render.com/) и войдите в свою учетную запись.

2. **Создайте новый Web Service:**
   - Нажмите "New +" -> "Web Service"
   - Подключите ваш GitHub аккаунт и выберите репозиторий `restero-restaurant-platform`
   - Выберите ветку `main`

3. **Настройте конфигурацию:**
   - **Name:** `restero-platform`
   - **Environment:** `Docker`
   - **Region:** `Oregon (US West)`
   - **Branch:** `main`
   - **Dockerfile Path:** `./Dockerfile`
   - **Plan:** `Starter` (бесплатный)

## 3. Настройка переменных окружения

В Render, в разделе "Environment Variables", добавьте следующие переменные. **Обязательно замените placeholder'ы на реальные значения.**

### Основные переменные:

- `NODE_ENV=production`
- `APP_ENV=production`
- `APP_KEY=base64:your-laravel-app-key-here` (Сгенерируйте ключ Laravel: `php artisan key:generate --show`)
- `NEXTAUTH_URL=https://your-app-name.onrender.com` (Замените на реальный URL вашего приложения на Render)
- `NEXTAUTH_SECRET=your-super-secret-nextauth-key-here` (Сгенерируйте сильный ключ)

### База данных (если используете внешнюю):

- `DB_CONNECTION=mysql`
- `DB_HOST=your-database-host`
- `DB_PORT=3306`
- `DB_DATABASE=restero`
- `DB_USERNAME=restero`
- `DB_PASSWORD=your-database-password`

### Redis (если используете внешний):

- `REDIS_HOST=your-redis-host`
- `REDIS_PORT=6379`
- `CACHE_DRIVER=redis`
- `SESSION_DRIVER=redis`

### Next.js переменные:

- `NEXT_PUBLIC_API_URL=https://your-app-name.onrender.com:8000` (URL для API)

## 4. Использование render.yaml (альтернативный способ)

Если вы хотите использовать файл `render.yaml` для автоматической настройки:

1. Убедитесь, что файл `render.yaml` находится в корне репозитория
2. При создании сервиса выберите "Infrastructure as Code"
3. Render автоматически прочитает конфигурацию из `render.yaml`

## 5. Развертывание

После настройки переменных окружения Render автоматически начнет сборку и развертывание вашего приложения.

**Важные замечания:**
- Убедитесь, что порты 3000 (для Next.js) и 8000 (для Laravel API) открыты
- После первого деплоя Laravel API, возможно, потребуется выполнить миграции базы данных
- На бесплатном плане Render может "засыпать" после периода неактивности

## 6. Доступ к приложению

После успешного развертывания ваше приложение будет доступно по адресу:
- **Платформа:** `https://your-app-name.onrender.com`
- **API:** `https://your-app-name.onrender.com:8000`

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
- `docker-compose.render.yml` - конфигурация для Render
- `render.yaml` - конфигурация Render как код
- `Dockerfile` - основной Dockerfile

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
```