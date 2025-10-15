import { NextRequest, NextResponse } from 'next/server';
import { RedisDataManager, connectRedis } from '@/lib/redis';
import { BookingApiService } from '@/lib/booking-api';
import { verifyToken } from '@/lib/auth';

// Получение статистики бронирований для ресторана
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Получаем токен из заголовка Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Токен авторизации не предоставлен' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        { message: error instanceof Error ? error.message : 'Недействительный токен' },
        { status: 401 }
      );
    }

    const { userId } = decoded;
    const restaurantId = params.id;

    // Подключение к Redis
    await connectRedis();

    // Проверяем, что ресторан принадлежит пользователю
    const restaurant = await RedisDataManager.getRestaurant(restaurantId);
    if (!restaurant || restaurant.ownerId !== String(userId)) {
      return NextResponse.json(
        { message: 'Ресторан не найден или доступ запрещен' },
        { status: 404 }
      );
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
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
