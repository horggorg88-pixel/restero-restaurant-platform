import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, createCorsResponse, createCorsErrorResponse, getOriginFromHeaders } from '@/lib/cors';
import { RedisDataManager, connectRedis } from '@/lib/redis';
import { verifyToken } from '@/lib/auth';

// Явно указываем что это динамический route
export const dynamic = 'force-dynamic';


// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = getOriginFromHeaders(request.headers);
  return handleCorsPreflight(origin);
}

export async function GET(request: NextRequest) {
  try {
    // Получаем токен из заголовка Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Токен авторизации не предоставлен', 401, origin);
    }

    const token = authHeader.substring(7); // Убираем "Bearer "

    // Проверяем токен
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse(error instanceof Error ? error.message : 'Недействительный токен', 401, origin);
    }

    const { userId } = decoded;

    // Валидация userId
    if (!userId || !Number.isFinite(userId)) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Недействительный токен пользователя', 401, origin);
    }

    // Подключение к Redis
    await connectRedis();

    // Находим пользователя (ключи в Redis хранятся как user:user:NN)
    const redisId = `user:${userId}`
    const user = await RedisDataManager.getUser(redisId);

    if (!user) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Пользователь не найден', 404, origin);
    }

    const origin = getOriginFromHeaders(request.headers);
    return createCorsResponse(user, 200, origin);

  } catch (error) {
    console.error('Ошибка получения данных пользователя:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}
