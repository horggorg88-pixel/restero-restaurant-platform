import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, createCorsResponse, createCorsErrorResponse, getOriginFromHeaders } from '@/lib/cors';
import { RedisDataManager, connectRedis } from '@/lib/redis';
import { verifyToken } from '@/lib/auth';

// Явно указываем что это динамический route
export const dynamic = 'force-dynamic';

// Удаление сети ресторанов

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
    const networkId = params.id;

    // Подключение к Redis
    await connectRedis();

    // Проверяем, что сеть существует и принадлежит пользователю
    const network = await RedisDataManager.getNetwork(networkId);
    if (!network) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Сеть не найдена', 404, origin);
    }

    if (network.ownerId !== String(userId)) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('У вас нет прав для удаления этой сети', 403, origin);
    }

    // Удаляем сеть
    await RedisDataManager.deleteNetwork(networkId);

    const origin = getOriginFromHeaders(request.headers);
    return createCorsResponse({
      message: 'Сеть ресторанов удалена успешно'
    }, 200, origin);

  } catch (error) {
    console.error('Ошибка удаления сети:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}

// Получение информации о сети
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
    const networkId = params.id;

    // Подключение к Redis
    await connectRedis();

    // Получаем сеть
    const network = await RedisDataManager.getNetwork(networkId);
    if (!network) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Сеть не найдена', 404, origin);
    }

    if (network.ownerId !== String(userId)) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('У вас нет прав для просмотра этой сети', 403, origin);
    }

    // Получаем информацию о ресторанах в сети
    const restaurants = [];
    for (const restaurantId of network.restaurantIds) {
      const restaurant = await RedisDataManager.getRestaurant(restaurantId);
      if (restaurant) {
        restaurants.push({
          id: restaurant.id,
          name: restaurant.name,
          address: restaurant.address,
          isActive: restaurant.isActive
        });
      }
    }

    return NextResponse.json({
      id: network.id,
      name: network.name,
      description: network.description,
      restaurantCount: network.restaurantIds.length,
      restaurants: restaurants,
      isActive: network.isActive,
      createdAt: network.createdAt,
      updatedAt: network.updatedAt
    });

  } catch (error) {
    console.error('Ошибка получения сети:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}