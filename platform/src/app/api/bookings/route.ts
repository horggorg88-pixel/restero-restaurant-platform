import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, createCorsResponse, createCorsErrorResponse, getOriginFromHeaders } from '@/lib/cors';
import { RedisDataManager, connectRedis } from '@/lib/redis';
import { verifyToken } from '@/lib/auth';
import { Booking, CreateBookingData } from '@/lib/types';

// Явно указываем что это динамический route
export const dynamic = 'force-dynamic';

// Получение бронирований ресторана

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
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');

    // Подключение к Redis
    await connectRedis();

    let bookings: Booking[] = [];

    if (restaurantId) {
      // Проверяем, что ресторан принадлежит пользователю
      const restaurant = await RedisDataManager.getRestaurant(restaurantId);
      if (!restaurant || restaurant.ownerId !== String(userId)) {
        const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Ресторан не найден или не принадлежит вам', 404, origin);
      }
      
      // Получаем бронирования конкретного ресторана
      bookings = await RedisDataManager.getRestaurantBookings(restaurantId);
    } else {
      // Получаем все рестораны пользователя и их бронирования
      const userRestaurants = await RedisDataManager.getUserRestaurants(String(userId));
      for (const restaurant of userRestaurants) {
        const restaurantBookings = await RedisDataManager.getRestaurantBookings(restaurant.id);
        bookings.push(...restaurantBookings);
      }
    }

    // Сортируем по дате
    bookings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Форматируем данные для фронтенда
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      restaurantId: booking.restaurantId,
      customerName: booking.customerName,
      customerPhone: booking.customerPhone,
      customerEmail: booking.customerEmail,
      date: booking.date,
      time: booking.time,
      guests: booking.guests,
      status: booking.status,
      notes: booking.notes,
      createdAt: booking.createdAt
    }));

    const origin = getOriginFromHeaders(request.headers);
    return createCorsResponse(formattedBookings, 200, origin);

  } catch (error) {
    console.error('Ошибка получения бронирований:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}

// Создание нового бронирования
export async function POST(request: NextRequest) {
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

    // Получаем данные из запроса
    const data: CreateBookingData = await request.json();

    // Валидация
    if (!data.restaurantId || !data.customerName || !data.customerPhone || !data.date || !data.time || !data.guests) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Все поля обязательны', 400, origin);
    }

    // Подключение к Redis
    await connectRedis();

    // Проверяем, что ресторан принадлежит пользователю
    const restaurant = await RedisDataManager.getRestaurant(data.restaurantId);
    if (!restaurant || restaurant.ownerId !== String(userId)) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Ресторан не найден или не принадлежит вам', 404, origin);
    }

    // Генерируем ID бронирования
    const bookingId = await RedisDataManager.generateId('booking');

    // Создаем бронирование
    const booking: Booking = {
      id: bookingId,
      restaurantId: data.restaurantId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      date: data.date,
      time: data.time,
      guests: data.guests,
      status: 'PENDING',
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Сохраняем бронирование в Redis
    await RedisDataManager.saveBooking(booking);

    return NextResponse.json({
      message: 'Бронирование создано успешно',
      booking: {
        id: booking.id,
        restaurantId: booking.restaurantId,
        customerName: booking.customerName,
        customerPhone: booking.customerPhone,
        customerEmail: booking.customerEmail,
        date: booking.date,
        time: booking.time,
        guests: booking.guests,
        status: booking.status,
        notes: booking.notes,
        createdAt: booking.createdAt
      }
    });

  } catch (error) {
    console.error('Ошибка создания бронирования:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}


