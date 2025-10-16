FROM node:18-alpine

WORKDIR /app

# Копируем package.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Открываем порт
EXPOSE 3001

# Запускаем dev сервер для локальной разработки
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]