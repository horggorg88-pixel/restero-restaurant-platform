import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, createCorsResponse, createCorsErrorResponse, getOriginFromHeaders } from '@/lib/cors';
import { RedisDataManager, connectRedis } from '@/lib/redis';
import { BookingApiService } from '@/lib/booking-api';
import { verifyToken } from '@/lib/auth';

// Явно указываем что это динамический route
export const dynamic = 'force-dynamic';

// Получение статистики бронирований для ресторана

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = getOriginFromHeaders(request.headers);
  return handleCorsPreflight(origin);
}

export async function GET(
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
    const restaurantId = params.id;

    // Подключение к Redis
    await connectRedis();

    // Проверяем, что ресторан принадлежит пользователю
    const restaurant = await RedisDataManager.getRestaurant(restaurantId);
    if (!restaurant || restaurant.ownerId !== String(userId)) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Ресторан не найден или доступ запрещен', 404, origin);
    }

    // Получаем статистику из кэша
    let stats = await RedisDataManager.getBookingStats(restaurantId);
    
    // Если статистики нет в кэше, получаем из API бронирований
    if (!stats) {
      console.log('Получение статистики из API бронирований...');
      const bookingResult = await BookingApiService.getBookingStats(restaurantId);
      
      if (bookingResult.success) {
        stats = bookingResult.data;
        // Сохраняем в кэш
        await RedisDataManager.saveBookingStats(restaurantId, stats);
      } else {
        // Возвращаем базовую статистику, если API недоступен
        stats = {
          totalBookings: 0,
          todayBookings: 0,
          activeBookings: 0,
          cancelledBookings: 0,
          revenue: 0,
          averageBookingDuration: 0,
          popularTimeSlots: [],
          lastUpdated: new Date().toISOString()
        };
      }
    }

    return NextResponse.json({
      success: true,
      restaurantId: restaurantId,
      stats: stats,
      integration: {
        source: stats ? 'cache' : 'api',
        lastUpdated: stats?.lastUpdated || new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Ошибка получения статистики бронирований:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}
