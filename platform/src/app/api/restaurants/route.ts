import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, createCorsResponse, createCorsErrorResponse, getOriginFromHeaders } from '@/lib/cors';
import { RedisDataManager, connectRedis } from '@/lib/redis';
import { verifyToken } from '@/lib/auth';
import { BookingApiService } from '@/lib/booking-api';
import { Restaurant, CreateRestaurantData } from '@/lib/types';

// Явно указываем что это динамический route
export const dynamic = 'force-dynamic';

// Получение списка ресторанов пользователя

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

    // Получаем рестораны пользователя
    const restaurants = await RedisDataManager.getUserRestaurants(String(userId));

    // Форматируем данные для фронтенда с реальными счетчиками
    const formattedRestaurants = await Promise.all(restaurants.map(async restaurant => {
      // Получаем количество сотрудников для этого ресторана
      const accesses = await RedisDataManager.getRestaurantAccesses(restaurant.id);
      const accessesCount = accesses ? accesses.length : 0;
      
      // Получаем количество бронирований для этого ресторана
      const bookings = await RedisDataManager.getRestaurantBookings(restaurant.id);
      const bookingsCount = bookings ? bookings.length : 0;
      
      return {
        id: restaurant.id,
        name: restaurant.name,
        address: restaurant.address,
        photo: restaurant.photo,
        description: restaurant.description,
        phone: restaurant.phone,
        email: restaurant.email,
        website: restaurant.website,
        isActive: restaurant.isActive,
        createdAt: restaurant.createdAt,
        bookingsCount,
        accessesCount
      };
    }));

    const origin = getOriginFromHeaders(request.headers);
    return createCorsResponse(formattedRestaurants, 200, origin);

  } catch (error) {
    console.error('Ошибка получения ресторанов:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}

// Создание нового ресторана
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
    
    // Получаем данные из FormData
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;
    const description = formData.get('description') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const website = formData.get('website') as string;
    const photoFile = formData.get('photo') as File | null;

    // Валидация
    if (!name || !address) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Название и адрес обязательны', 400, origin);
    }

    // Подключение к Redis
    await connectRedis();

    // Обработка фото (пока просто сохраняем имя файла)
    let photoUrl = null;
    if (photoFile && photoFile.size > 0) {
      // В реальном приложении здесь была бы загрузка в облачное хранилище
      photoUrl = `/uploads/restaurants/${Date.now()}-${photoFile.name}`;
    }

    // Генерируем ID ресторана
    const restaurantId = await RedisDataManager.generateId('restaurant');

    // Создаем ресторан
    const restaurant: Restaurant = {
      id: restaurantId,
      name,
      address,
      description: description || undefined,
      phone: phone || undefined,
      email: email || undefined,
      website: website || undefined,
      photo: photoUrl || undefined,
      ownerId: String(userId),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Сохраняем ресторан в Redis
    await RedisDataManager.saveRestaurant(restaurant);

    // Интеграция с системой бронирований (rest-gills)
    console.log('Интеграция с системой бронирований...');
    const bookingResult = await BookingApiService.createRestaurant({
      ...restaurant,
      description: restaurant.description || undefined,
      phone: restaurant.phone || undefined,
      email: restaurant.email || undefined,
      website: restaurant.website || undefined,
      photo: restaurant.photo || undefined
    });
    
    if (bookingResult.success) {
      console.log('Ресторан успешно создан в системе бронирований:', bookingResult.data);
      
      // Сохраняем статистику бронирований
      if (bookingResult.data?.stats) {
        await RedisDataManager.saveBookingStats(restaurant.id, bookingResult.data.stats);
      }
    } else {
      console.warn('Ошибка интеграции с системой бронирований:', bookingResult.error);
      // Продолжаем работу, даже если интеграция не удалась
    }

    return NextResponse.json({
      message: 'Ресторан успешно создан',
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        address: restaurant.address,
        description: restaurant.description,
        phone: restaurant.phone,
        email: restaurant.email,
        website: restaurant.website,
        photo: restaurant.photo,
        isActive: restaurant.isActive,
        createdAt: restaurant.createdAt
      },
      integration: {
        bookingSystem: bookingResult.success,
        apiKey: bookingResult.apiKey,
        error: bookingResult.error
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Ошибка создания ресторана:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}