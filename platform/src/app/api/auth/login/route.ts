import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, createCorsResponse, createCorsErrorResponse, getOriginFromHeaders } from '@/lib/cors';
import bcrypt from 'bcryptjs';
import { RedisDataManager, connectRedis } from '@/lib/redis';
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
    const { email, password } = await request.json();

    // Валидация
    if (!email || !password) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Email и пароль обязательны', 400, origin);
    }

    // Подключение к Redis
    await connectRedis();

    // Находим пользователя по email
    const user = await RedisDataManager.getUserByEmail(email);

    if (!user) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Неверный email или пароль', 401, origin);
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Неверный email или пароль', 401, origin);
    }

    // Проверяем, подтвержден ли email
    if (!user.isEmailVerified) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Подтвердите email перед входом в систему', 401, origin);
    }

    // Обновляем время последнего входа
    user.lastLoginAt = new Date().toISOString();
    await RedisDataManager.saveUser(user);

          // Генерируем JWT токен (извлекаем числовую часть из id вида "user:11")
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
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}
