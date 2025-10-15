# Настройка локальной PostgreSQL базы данных

## Установка PostgreSQL

### Windows:
1. Скачайте PostgreSQL с официального сайта: https://www.postgresql.org/download/windows/
2. Установите с настройками по умолчанию
3. Запомните пароль для пользователя `postgres`

### macOS:
```bash
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Создание базы данных

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

## Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
# Database
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/restero_db"
POSTGRES_PRISMA_URL="postgresql://postgres:your_password@localhost:5432/restero_db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Email Configuration
FROM_EMAIL="noreply@restero.com"
FROM_NAME="Restero"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

## Запуск миграций

```bash
npx prisma db push
```

## Проверка подключения

```bash
npx prisma studio
```

Это откроет веб-интерфейс для просмотра базы данных.
