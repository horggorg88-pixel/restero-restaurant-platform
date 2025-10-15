import { NextRequest, NextResponse } from 'next/server';
import { RedisDataManager, connectRedis } from '@/lib/redis';
import { verifyToken } from '@/lib/auth';
import { BookingApiService } from '@/lib/booking-api';

// Получение списка ресторанов пользователя
export async function GET(request: NextRequest) {
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

    // Подключение к Redis
    await connectRedis();

    // Получаем рестораны пользователя
    const restaurants = await RedisDataManager.getUserRestaurants(String(userId));

    // Форматируем данные для фронтенда
    const formattedRestaurants = restaurants.map(restaurant => ({
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
      bookingsCount: 0,
      accessesCount: 0
    }));

    return NextResponse.json(formattedRestaurants);

  } catch (error) {
    console.error('Ошибка получения ресторанов:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// Создание нового ресторана
export async function POST(request: NextRequest) {
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
      return NextResponse.json(
        { message: 'Название и адрес обязательны' },
        { status: 400 }
      );
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
    const restaurant = {
      id: restaurantId,
      name,
      address,
      description: description || null,
      phone: phone || null,
      email: email || null,
      website: website || null,
      photo: photoUrl,
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
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}