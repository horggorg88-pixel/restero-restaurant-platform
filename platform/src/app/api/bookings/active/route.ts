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

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse(error instanceof Error ? error.message : 'Недействительный токен', 401, origin);
    }

    const { userId } = decoded;

    // Подключение к Redis
    await connectRedis();

    // Получаем активные бронирования для всех ресторанов пользователя
    const activeBookings = await RedisDataManager.getActiveBookings();

    // Фильтруем только бронирования ресторанов пользователя
    const userRestaurants = await RedisDataManager.getUserRestaurants(String(userId));
    const userRestaurantIds = userRestaurants.map(r => r.id);
    
    const userActiveBookings = activeBookings.filter(booking => 
      userRestaurantIds.includes(booking.restaurantId)
    );

    const origin = getOriginFromHeaders(request.headers);
    return createCorsResponse({
      count: userActiveBookings.length
    }, 200, origin);

  } catch (error) {
    console.error('Ошибка получения активных бронирований:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}
