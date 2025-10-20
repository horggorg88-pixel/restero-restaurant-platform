import { NextRequest, NextResponse } from 'next/server';
import { RedisDataManager, connectRedis } from '@/lib/redis';
import { verifyToken } from '@/lib/auth';
import { Booking } from '@/lib/types';
import { handleCorsPreflight, createCorsResponse, createCorsErrorResponse, getOriginFromHeaders } from '@/lib/cors';

// Явно указываем что это динамический route
export const dynamic = 'force-dynamic';

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = getOriginFromHeaders(request.headers);
  return handleCorsPreflight(origin);
}

// Получение всех бронирований для админки
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
      return createCorsErrorResponse(
        error instanceof Error ? error.message : 'Недействительный токен', 
        401, 
        origin
      );
    }

    const { userId } = decoded;
    const { searchParams } = new URL(request.url);
    
    // Получаем restaurantId из параметров запроса (поддерживаем оба варианта имени)
    const restaurantId = searchParams.get('restaurant_id') || searchParams.get('restaurantId');
    
    // Получаем параметры запроса
    const status = searchParams.get('status') || '0';
    const booking_date_from = searchParams.get('booking_date_from');
    const booking_date_to = searchParams.get('booking_date_to');
    const query = searchParams.get('query');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Подключение к Redis
    await connectRedis();

    let bookings: Booking[] = [];

    try {
      if (restaurantId) {
        // Если указан restaurantId — возвращаем бронирования конкретного ресторана;
        // если ресторан/ключа нет — отдаём пустой список (200)
        const restaurantBookings = await RedisDataManager.getRestaurantBookings(restaurantId);
        bookings = Array.isArray(restaurantBookings) ? restaurantBookings : [];
      } else {
        // Если restaurantId не указан — используем контекст пользователя (владелец может видеть свои рестораны)
        const userRestaurants = await RedisDataManager.getUserRestaurants(String(userId));
        if (Array.isArray(userRestaurants) && userRestaurants.length > 0) {
          for (const restaurant of userRestaurants) {
            const restaurantBookings = await RedisDataManager.getRestaurantBookings(restaurant.id);
            if (Array.isArray(restaurantBookings) && restaurantBookings.length > 0) {
              bookings.push(...restaurantBookings);
            }
          }
        } else {
          // Нет привязанных ресторанов — возвращаем пустой список
          bookings = [];
        }
      }
    } catch (error) {
      console.error('Ошибка получения бронирований:', error);
      bookings = [];
    }

    // Убеждаемся, что bookings - это массив
    if (!Array.isArray(bookings)) {
      bookings = [];
    }

    // Фильтрация по статусу
    if (status !== 'all') {
      const statusMap: { [key: string]: string } = {
        '0': 'PENDING',
        '1': 'CONFIRMED', 
        '2': 'CANCELLED',
        '3': 'COMPLETED'
      };
      bookings = bookings.filter(booking => booking.status === statusMap[status]);
    }

    // Фильтрация по дате
    if (booking_date_from) {
      bookings = bookings.filter(booking => booking.date >= booking_date_from);
    }
    if (booking_date_to) {
      bookings = bookings.filter(booking => booking.date <= booking_date_to);
    }

    // Поиск по имени или телефону
    if (query) {
      const searchQuery = query.toLowerCase();
      bookings = bookings.filter(booking => 
        booking.customerName.toLowerCase().includes(searchQuery) ||
        booking.customerPhone.includes(query)
      );
    }

    // Сортируем по дате и времени
    bookings.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

    // Пагинация
    const total = bookings.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBookings = bookings.slice(startIndex, endIndex);

    // Форматируем данные для админки
    const formattedBookings = paginatedBookings.map(booking => ({
      id: booking.id,
      booking_date: booking.date,
      booking_time_from: booking.time,
      booking_time_to: booking.time, // Пока используем то же время
      client_name: booking.customerName,
      client_phone: booking.customerPhone,
      comment: booking.notes || '',
      count_people: booking.guests,
      created_at: booking.createdAt,
      room_name: 'Зал 1', // Заглушка
      histories: {
        data: [{ created_at: booking.createdAt }]
      },
      object: 'restaurant',
      room_id: 'room_1', // Заглушка
      status: booking.status === 'PENDING' ? 0 : 
              booking.status === 'CONFIRMED' ? 1 :
              booking.status === 'CANCELLED' ? 2 : 3,
      table_ids: ['table_1'], // Заглушка
      administrator: {
        id: userId,
        name: 'Администратор'
      },
      table_number: '1', // Заглушка
      composite_tables: []
    }));

    const response = createCorsResponse({
      data: formattedBookings || [],
      meta: {
        pagination: {
          page: page,
          pageSize: limit,
          pageCount: Math.ceil(total / limit),
          total: total || 0
        }
      }
    }, 200, getOriginFromHeaders(request.headers));

    return response;

  } catch (error) {
    console.error('Ошибка получения бронирований:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}
