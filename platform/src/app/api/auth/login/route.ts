import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { RedisDataManager, connectRedis } from '@/lib/redis';
import { generateJWTToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Валидация
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email и пароль обязательны' },
        { status: 400 }
      );
    }

    // Подключение к Redis
    await connectRedis();

    // Находим пользователя по email
    const user = await RedisDataManager.getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { message: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    // Проверяем, подтвержден ли email
    if (!user.isEmailVerified) {
      return NextResponse.json(
        { message: 'Подтвердите email перед входом в систему' },
        { status: 401 }
      );
    }

    // Обновляем время последнего входа
    user.lastLoginAt = new Date().toISOString();
    await RedisDataManager.saveUser(user);

          // Генерируем JWT токен
          const token = generateJWTToken({
            userId: user.id, 
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          });

    return NextResponse.json({
      message: 'Вход успешен',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Ошибка входа:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
