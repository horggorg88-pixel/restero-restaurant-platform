import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, createCorsResponse, createCorsErrorResponse, getOriginFromHeaders } from '@/lib/cors';
import { RedisDataManager, connectRedis } from '@/lib/redis';
import { verifyToken } from '@/lib/auth';
import { Network, CreateNetworkData } from '@/lib/types';

// Явно указываем что это динамический route
export const dynamic = 'force-dynamic';

// Получение списка сетей пользователя

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

    // Получаем сети пользователя
    const networks = await RedisDataManager.getUserNetworks(String(userId));

    // Форматируем данные для фронтенда
    const formattedNetworks = networks.map(network => ({
      id: network.id,
      name: network.name,
      description: network.description,
      restaurantCount: network.restaurantIds.length,
      isActive: network.isActive,
      createdAt: network.createdAt,
      updatedAt: network.updatedAt
    }));

    const origin = getOriginFromHeaders(request.headers);
    return createCorsResponse(formattedNetworks, 200, origin);

  } catch (error) {
    console.error('Ошибка получения сетей:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}

// Создание новой сети ресторанов
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
    const data: CreateNetworkData = await request.json();

    // Валидация
    if (!data.name) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Название сети обязательно', 400, origin);
    }

    if (!data.restaurantIds || data.restaurantIds.length === 0) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Необходимо выбрать хотя бы один ресторан', 400, origin);
    }

    // Подключение к Redis
    await connectRedis();

    // Проверяем, что все рестораны принадлежат пользователю
    const userRestaurants = await RedisDataManager.getUserRestaurants(String(userId));
    const userRestaurantIds = userRestaurants.map(r => r.id);
    
    const invalidRestaurants = data.restaurantIds.filter(id => !userRestaurantIds.includes(id));
    if (invalidRestaurants.length > 0) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Некоторые рестораны не принадлежат вам', 400, origin);
    }

    // Генерируем ID сети
    const networkId = await RedisDataManager.generateId('network');

    // Создаем сеть
    const network: Network = {
      id: networkId,
      name: data.name,
      description: data.description,
      ownerId: String(userId),
      restaurantIds: data.restaurantIds,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Сохраняем сеть в Redis
    await RedisDataManager.saveNetwork(network);

    return NextResponse.json({
      message: 'Сеть ресторанов создана успешно',
      network: {
        id: network.id,
        name: network.name,
        description: network.description,
        restaurantCount: network.restaurantIds.length,
        isActive: network.isActive,
        createdAt: network.createdAt
      }
    });

  } catch (error) {
    console.error('Ошибка создания сети:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}