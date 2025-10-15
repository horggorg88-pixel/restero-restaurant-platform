import { NextRequest, NextResponse } from 'next/server';
import { generateJWTToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email адрес обязателен' },
        { status: 400 }
      );
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Некорректный email адрес' },
        { status: 400 }
      );
    }

    // Здесь будет проверка существования пользователя в базе данных
    // Пока используем моковую проверку
    const mockUsers = [
      { id: 1, email: 'test@example.com', firstName: 'Тест', lastName: 'Пользователь' },
      { id: 2, email: 'admin@restero.com', firstName: 'Админ', lastName: 'Рестеро' }
    ];

    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      // Для безопасности не сообщаем, что пользователь не найден
      return NextResponse.json({
        success: true,
        message: 'Если аккаунт с таким email существует, мы отправили инструкции по восстановлению пароля'
      });
    }

    // Генерируем токен для сброса пароля (действителен 1 час)
    const resetToken = generateJWTToken({
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });

    // Здесь будет отправка email с токеном
    // Пока логируем для демонстрации
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password/${resetToken}`;
    
    console.log('=== EMAIL ДЛЯ ВОССТАНОВЛЕНИЯ ПАРОЛЯ ===');
    console.log(`Получатель: ${email}`);
    console.log(`Тема: Восстановление пароля - Restero`);
    console.log(`Ссылка для сброса: ${resetUrl}`);
    console.log('=====================================');

    // В реальном приложении здесь будет:
    // 1. Сохранение токена в базе данных с временем истечения
    // 2. Отправка email через SMTP
    // 3. Логирование попытки восстановления

    return NextResponse.json({
      success: true,
      message: 'Инструкции по восстановлению пароля отправлены на ваш email'
    });

  } catch (error) {
    console.error('Ошибка восстановления пароля:', error);
    return NextResponse.json(
      { success: false, message: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
