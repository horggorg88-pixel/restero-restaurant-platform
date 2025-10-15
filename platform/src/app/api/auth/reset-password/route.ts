import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { token, password, confirmPassword } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Токен сброса пароля обязателен' },
        { status: 400 }
      );
    }

    if (!password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Пароль и подтверждение пароля обязательны' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Пароли не совпадают' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Пароль должен содержать минимум 6 символов' },
        { status: 400 }
      );
    }

    // Проверяем токен
    let decodedToken;
    try {
      decodedToken = verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Токен сброса пароля недействителен или истек' },
        { status: 400 }
      );
    }

    // Здесь будет обновление пароля в базе данных
    // Пока логируем для демонстрации
    console.log('=== СБРОС ПАРОЛЯ ===');
    console.log(`Пользователь: ${decodedToken.email}`);
    console.log(`Новый пароль: ${password}`);
    console.log(`Время: ${new Date().toISOString()}`);
    console.log('==================');

    // В реальном приложении здесь будет:
    // 1. Хеширование нового пароля
    // 2. Обновление пароля в базе данных
    // 3. Инвалидация всех активных сессий пользователя
    // 4. Отправка уведомления об изменении пароля
    // 5. Удаление токена сброса из базы данных

    return NextResponse.json({
      success: true,
      message: 'Пароль успешно обновлен'
    });

  } catch (error) {
    console.error('Ошибка сброса пароля:', error);
    return NextResponse.json(
      { success: false, message: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
