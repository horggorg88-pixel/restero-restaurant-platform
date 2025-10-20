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

    // Получаем все рестораны пользователя
    const userRestaurants = await RedisDataManager.getUserRestaurants(String(userId));
    
    let totalBookings = 0;
    let activeBookings = 0;
    let todayBookings = 0;
    
    const today = new Date().toISOString().split('T')[0];

    // Подсчитываем статистику по всем ресторанам
    for (const restaurant of userRestaurants) {
      const bookings = await RedisDataManager.getRestaurantBookings(restaurant.id);
      totalBookings += bookings.length;
      
      // Активные бронирования (PENDING или CONFIRMED)
      const active = bookings.filter(b => 
        b.status === 'PENDING' || b.status === 'CONFIRMED'
      );
      activeBookings += active.length;
      
      // Бронирования на сегодня
      const todayBookingsForRestaurant = bookings.filter(b => 
        b.date === today
      );
      todayBookings += todayBookingsForRestaurant.length;
    }

    return NextResponse.json({
      totalBookings,
      activeBookings,
      todayBookings
    });

  } catch (error) {
    console.error('Ошибка получения статистики бронирований:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}
