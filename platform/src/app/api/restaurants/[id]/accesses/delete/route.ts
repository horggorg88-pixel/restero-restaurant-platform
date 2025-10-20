import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, createCorsResponse, createCorsErrorResponse, getOriginFromHeaders } from '@/lib/cors';
import { RedisDataManager, connectRedis } from '@/lib/redis';
import { verifyToken } from '@/lib/auth';

// Явно указываем что это динамический route
export const dynamic = 'force-dynamic';

// Удаление доступа к ресторану

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = getOriginFromHeaders(request.headers);
  return handleCorsPreflight(origin);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Получаем токен из заголовка Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Токен авторизации не предоставлен', 401, origin);
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse(error instanceof Error ? error.message : 'Недействительный токен', 401, origin);
    }

    const { userId } = decoded;
    const { searchParams } = new URL(request.url);
    const accessId = searchParams.get('accessId');

    if (!accessId) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('ID доступа обязателен', 400, origin);
    }

    // Подключение к Redis
    await connectRedis();

    // Получаем доступ
    const access = await RedisDataManager.getAccess(accessId);
    if (!access) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Доступ не найден', 404, origin);
    }

    // Проверяем, что ресторан принадлежит пользователю
    const restaurant = await RedisDataManager.getRestaurant(access.restaurantId);
    if (!restaurant || restaurant.ownerId !== String(userId)) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('У вас нет прав для удаления этого доступа', 403, origin);
    }

    // Удаляем доступ
    await RedisDataManager.deleteAccess(accessId);

    const origin = getOriginFromHeaders(request.headers);
    return createCorsResponse({
      message: 'Доступ успешно удален'
    }, 200, origin);

  } catch (error) {
    console.error('Ошибка удаления доступа:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}


