import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, createCorsResponse, createCorsErrorResponse, getOriginFromHeaders } from '@/lib/cors';
import { RedisDataManager, connectRedis } from '@/lib/redis';
import { verifyToken } from '@/lib/auth';

// Явно указываем что это динамический route
export const dynamic = 'force-dynamic';

// Удаление ресторана

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = getOriginFromHeaders(request.headers);
  return handleCorsPreflight(origin);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Проверяем, что ресторан существует и принадлежит пользователю
    const restaurant = await RedisDataManager.getRestaurant(restaurantId);
    if (!restaurant) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Ресторан не найден', 404, origin);
    }

    if (restaurant.ownerId !== String(userId)) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('У вас нет прав для удаления этого ресторана', 403, origin);
    }

    // Удаляем ресторан
    await RedisDataManager.deleteRestaurant(restaurantId);

    const origin = getOriginFromHeaders(request.headers);
    return createCorsResponse({
      message: 'Ресторан удален успешно'
    }, 200, origin);

  } catch (error) {
    console.error('Ошибка удаления ресторана:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}

// Обновление ресторана
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
    const body = await request.json();

    // Подключение к Redis
    await connectRedis();

    // Проверяем, что ресторан существует и принадлежит пользователю
    const existingRestaurant = await RedisDataManager.getRestaurant(restaurantId);
    if (!existingRestaurant) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Ресторан не найден', 404, origin);
    }

    if (existingRestaurant.ownerId !== String(userId)) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('У вас нет прав для редактирования этого ресторана', 403, origin);
    }

    // Обновляем ресторан
    const updatedRestaurant = {
      ...existingRestaurant,
      name: body.name || existingRestaurant.name,
      description: body.description || existingRestaurant.description,
      address: body.address || existingRestaurant.address,
      phone: body.phone || existingRestaurant.phone,
      email: body.email || existingRestaurant.email,
      website: body.website || existingRestaurant.website,
      updatedAt: new Date().toISOString()
    };

    await RedisDataManager.updateRestaurant(restaurantId, updatedRestaurant);

    return NextResponse.json({
      message: 'Ресторан обновлен успешно',
      restaurant: updatedRestaurant
    });

  } catch (error) {
    console.error('Ошибка обновления ресторана:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}

// Получение информации о ресторане
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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
    
    // Получаем ресторан
    const restaurant = await RedisDataManager.getRestaurant(restaurantId);
    if (!restaurant) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Ресторан не найден', 404, origin);
    }

    if (restaurant.ownerId !== String(userId)) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('У вас нет прав для просмотра этого ресторана', 403, origin);
    }

    // Получаем статистику ресторана
    const bookings = await RedisDataManager.getRestaurantBookings(restaurantId);
    const accesses = await RedisDataManager.getRestaurantAccesses(restaurantId);

    return NextResponse.json({
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      description: restaurant.description,
      phone: restaurant.phone,
      email: restaurant.email,
      website: restaurant.website,
      photo: restaurant.photo,
      isActive: restaurant.isActive,
      createdAt: restaurant.createdAt,
      updatedAt: restaurant.updatedAt,
      bookingsCount: bookings.length,
      accessesCount: accesses.length
    });

  } catch (error) {
    console.error('Ошибка получения ресторана:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}