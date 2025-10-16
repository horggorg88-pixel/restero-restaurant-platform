FROM php:8.2-fpm



# Set working directory
WORKDIR /var/www

# Install dependencies

RUN apt-get update && apt-get install -y \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libmcrypt-dev \
        libpng-dev \
        zlib1g-dev \
        libxml2-dev \
        libzip-dev \
        libonig-dev \
        graphviz \
        libpq-dev \
    && docker-php-ext-configure gd \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-install pdo_pgsql \
    && docker-php-ext-install zip \
    && docker-php-ext-install sockets \
    && docker-php-source delete \
    && docker-php-ext-install bcmath \
    && curl -sS https://getcomposer.org/installer | php -- \
     --install-dir=/usr/local/bin --filename=composer

RUN pecl install redis && docker-php-ext-enable redis




# Add user for laravel application
RUN groupadd -g 1000 user
RUN useradd -u 1000 -ms /bin/bash -g user user

# Copy existing application directory contents
COPY ./ /var/www

# Copy existing application directory permissions
COPY --chown=user:user ./ /var/www

# Change current user to www
USER user

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm"]
