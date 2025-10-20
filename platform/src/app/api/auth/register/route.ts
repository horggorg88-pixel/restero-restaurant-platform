import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, createCorsResponse, createCorsErrorResponse, getOriginFromHeaders } from '@/lib/cors';
import bcrypt from 'bcryptjs';
import { RedisDataManager, connectRedis } from '@/lib/redis';
import { User } from '@/lib/types';
import { generateJWTToken } from '@/lib/auth';


// Явно указываем что это динамический route
export const dynamic = 'force-dynamic';

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = getOriginFromHeaders(request.headers);
  return handleCorsPreflight(origin);
}

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    // Валидация
    if (!firstName || !lastName || !email || !password) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Все поля обязательны', 400, origin);
    }

    if (password.length < 6) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Пароль должен содержать минимум 6 символов', 400, origin);
    }

    // Подключение к Redis
    await connectRedis();

    // Проверяем, существует ли пользователь
    const existingUser = await RedisDataManager.getUserByEmail(email);

    if (existingUser) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Пользователь с таким email уже существует', 400, origin);
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 12);

    // Генерируем ID пользователя
    const userId = await RedisDataManager.generateId('user');

    // Создаем пользователя
    const user: User = {
      id: userId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'USER',
      isEmailVerified: true,
      emailVerificationToken: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Сохраняем пользователя в Redis
    await RedisDataManager.saveUser(user);

    // Автовход: генерируем JWT токен на основе числовой части id
    const numericUserId = (() => {
      const parts = String(user.id).split(':');
      const n = parseInt(parts[parts.length - 1] || '', 10);
      return Number.isFinite(n) ? n : 0;
    })();

    const token = generateJWTToken({
      userId: numericUserId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });

    return NextResponse.json(
      { 
        message: 'Регистрация успешна',
        userId: user.id,
        token
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Ошибка регистрации:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}
