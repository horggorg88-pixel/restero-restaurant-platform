# Настройка базы данных для Restero

## 1. Установка PostgreSQL

### Windows
1. Скачайте PostgreSQL с официального сайта: https://www.postgresql.org/download/windows/
2. Установите PostgreSQL с настройками по умолчанию
3. Запомните пароль для пользователя `postgres`

### macOS
```bash
# Через Homebrew
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## 2. Создание базы данных

1. Откройте терминал и подключитесь к PostgreSQL:
```bash
psql -U postgres
```

2. Создайте базу данных:
```sql
CREATE DATABASE restero_db;
```

3. Создайте пользователя (опционально):
```sql
CREATE USER restero_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE restero_db TO restero_user;
```

4. Выйдите из psql:
```sql
\q
```

## 3. Настройка переменных окружения

1. Скопируйте файл `env.example` в `.env.local`:
```bash
cp env.example .env.local
```

2. Отредактируйте `.env.local`:
```env
# Database
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/restero_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here-make-it-long-and-random"
JWT_EXPIRES_IN="7d"

# Email (настройте SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
FROM_EMAIL="noreply@restero.com"
FROM_NAME="Restero"

# App
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# External API (существующий сервис бронирований)
BOOKING_API_URL="http://localhost:8000/api"
BOOKING_API_KEY="your-booking-api-key"
```

## 4. Инициализация базы данных

1. Установите Prisma CLI:
```bash
npm install -g prisma
```

2. Создайте миграции:
```bash
npx prisma migrate dev --name init
```

3. Сгенерируйте Prisma Client:
```bash
npx prisma generate
```

4. (Опционально) Откройте Prisma Studio для просмотра данных:
```bash
npx prisma studio
```

## 5. Проверка подключения

Запустите приложение:
```bash
npm run dev
```

Если все настроено правильно, приложение должно запуститься без ошибок базы данных.

## 6. Структура базы данных

После инициализации будут созданы следующие таблицы:

- `users` - пользователи системы
- `restaurants` - рестораны
- `restaurant_networks` - сети ресторанов
- `accesses` - доступы сотрудников
- `payments` - платежи
- `bookings` - бронирования

## 7. Резервное копирование

### Создание бэкапа:
```bash
pg_dump -U postgres -h localhost restero_db > backup.sql
```

### Восстановление из бэкапа:
```bash
psql -U postgres -h localhost restero_db < backup.sql
```

## 8. Облачные решения

### Neon (рекомендуется для разработки)
1. Зарегистрируйтесь на https://neon.tech/
2. Создайте новый проект
3. Скопируйте connection string
4. Обновите `DATABASE_URL` в `.env.local`

### Supabase
1. Зарегистрируйтесь на https://supabase.com/
2. Создайте новый проект
3. Перейдите в Settings > Database
4. Скопируйте connection string
5. Обновите `DATABASE_URL` в `.env.local`

## Troubleshooting

### Ошибка подключения к базе данных
- Проверьте, что PostgreSQL запущен
- Убедитесь, что пароль в `DATABASE_URL` правильный
- Проверьте, что порт 5432 доступен

### Ошибка миграций
- Убедитесь, что база данных создана
- Проверьте права доступа пользователя
- Попробуйте удалить папку `prisma/migrations` и запустить миграции заново

### Ошибка Prisma Client
```bash
npx prisma generate
```

Если проблемы продолжаются, проверьте логи в консоли браузера и терминале.
