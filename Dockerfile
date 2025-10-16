# Упрощенный Dockerfile для Northflank
FROM node:18-alpine

# Устанавливаем PHP и необходимые расширения
RUN apk add --no-cache \
    php82 \
    php82-fpm \
    php82-pdo \
    php82-pdo_mysql \
    php82-mbstring \
    php82-xml \
    php82-curl \
    php82-zip \
    php82-bcmath \
    php82-gd \
    php82-fileinfo \
    php82-tokenizer \
    php82-openssl \
    php82-json \
    php82-phar \
    php82-dom \
    php82-xmlwriter \
    php82-simplexml \
    php82-xmlreader \
    php82-ctype \
    php82-iconv \
    php82-intl \
    php82-session \
    php82-sodium \
    php82-gettext \
    composer \
    supervisor

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем все файлы проекта
COPY . .

# Устанавливаем зависимости Node.js
RUN cd platform && npm ci

# Устанавливаем зависимости админ-панели
RUN cd admin/gills-moscow-front && npm ci

# Создаем необходимые директории для Laravel
RUN mkdir -p /app/api/bootstrap/cache && \
    mkdir -p /app/api/storage/logs && \
    mkdir -p /app/api/storage/framework/cache && \
    mkdir -p /app/api/storage/framework/sessions && \
    mkdir -p /app/api/storage/framework/views && \
    chmod -R 777 /app/api/storage && \
    chmod -R 777 /app/api/bootstrap/cache

# Устанавливаем зависимости PHP
RUN cd api && COMPOSER_IGNORE_PLATFORM_REQS=1 COMPOSER_DISABLE_XDEBUG_WARN=1 composer install --no-dev --optimize-autoloader --no-scripts

# Настраиваем Laravel (без Apiato команд)
RUN cd api && \
    echo "APP_KEY=" > .env && \
    php -r "echo 'APP_KEY=base64:' . base64_encode(random_bytes(32)) . PHP_EOL;" >> .env

# Собираем Next.js приложение
RUN cd platform && npm run build

# Собираем админ-панель и копируем в Next.js public
RUN cd admin/gills-moscow-front && npm run build && \
    mkdir -p /app/platform/public/admin && \
    cp -r dist/* /app/platform/public/admin/ && \
    chmod -R 755 /app/platform/public/admin

# Устанавливаем serve для статических файлов админ-панели
RUN npm install -g serve

# Создаем конфигурацию для supervisor
RUN mkdir -p /etc/supervisor/conf.d && \
    echo '[supervisord]' > /etc/supervisor/conf.d/supervisord.conf && \
    echo 'nodaemon=true' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo '' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo '[program:platform]' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'command=npm start' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'directory=/app/platform' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'autostart=true' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'autorestart=true' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'stderr_logfile=/var/log/platform.err.log' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'stdout_logfile=/var/log/platform.out.log' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo '' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo '[program:api]' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'command=php -S 0.0.0.0:8000 -t public' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'directory=/app/api' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'autostart=true' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'autorestart=true' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'stderr_logfile=/var/log/api.err.log' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'stdout_logfile=/var/log/api.out.log' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo '' >> /etc/supervisor/conf.d/supervisord.conf

# Открываем порты
EXPOSE 3000 8000

# Запускаем через supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
