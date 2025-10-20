# PowerShell скрипт для настройки .env файла
Write-Host "Настройка .env файла для Docker деплоя..." -ForegroundColor Green

# Копируем env файл
if (Test-Path "env.development") {
    Copy-Item "env.development" ".env"
    Write-Host ".env файл создан из env.development" -ForegroundColor Green
} else {
    Write-Host "Файл env.development не найден" -ForegroundColor Red
    exit 1
}

# Проверяем, что файл создан
if (Test-Path ".env") {
    Write-Host ".env файл успешно создан" -ForegroundColor Green
    Write-Host "Не забудьте изменить секретные ключи перед production деплоем!" -ForegroundColor Yellow
} else {
    Write-Host "Ошибка создания .env файла" -ForegroundColor Red
    exit 1
}
