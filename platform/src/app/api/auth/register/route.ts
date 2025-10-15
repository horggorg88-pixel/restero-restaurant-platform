import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { RedisDataManager, connectRedis } from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    // Валидация
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: 'Все поля обязательны' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Пароль должен содержать минимум 6 символов' },
        { status: 400 }
      );
    }

    // Подключение к Redis
    await connectRedis();

    // Проверяем, существует ли пользователь
    const existingUser = await RedisDataManager.getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { message: 'Пользователь с таким email уже существует' },
        { status: 400 }
      );
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 12);

    // Генерируем ID пользователя
    const userId = await RedisDataManager.generateId('user');

    // Создаем пользователя
    const user = {
      id: userId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'USER',
      isEmailVerified: true,
      emailVerificationToken: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Сохраняем пользователя в Redis
    await RedisDataManager.saveUser(user);

    return NextResponse.json(
      { 
        message: 'Регистрация успешна. Проверьте email для подтверждения аккаунта.',
        userId: user.id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Ошибка регистрации:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
