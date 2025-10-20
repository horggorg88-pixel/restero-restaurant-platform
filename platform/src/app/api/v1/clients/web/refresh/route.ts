import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, createCorsResponse, createCorsErrorResponse, getOriginFromHeaders } from '@/lib/cors';
import { RedisDataManager, connectRedis } from '@/lib/redis';
import { generateJWTToken } from '@/lib/auth';


// Явно указываем что это динамический route
export const dynamic = 'force-dynamic';
// Обновление токена доступа

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = getOriginFromHeaders(request.headers);
  return handleCorsPreflight(origin);
}

export async function POST(request: NextRequest) {
  try {
    const { refresh_token } = await request.json();

    if (!refresh_token) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Refresh token обязателен', 400, origin);
    }

    // Подключение к Redis
    await connectRedis();

    // В реальном приложении здесь должна быть проверка refresh token
    // Для демонстрации просто генерируем новый токен
    const newToken = generateJWTToken({
      userId: 1,
      email: 'admin@admin.com',
      firstName: 'Admin',
      lastName: 'User'
    });

    const newRefreshToken = `refresh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      success: true,
      data: {
        access_token: newToken,
        refresh_token: newRefreshToken,
        token_type: 'Bearer',
        expires_in: 3600
      }
    });

  } catch (error) {
    console.error('Ошибка обновления токена:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}
