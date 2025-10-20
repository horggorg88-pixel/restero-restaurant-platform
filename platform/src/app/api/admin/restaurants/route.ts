import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, createCorsResponse, createCorsErrorResponse, getOriginFromHeaders } from '@/lib/cors';
import { RedisDataManager, connectRedis } from '@/lib/redis';
import { verifyToken } from '@/lib/auth';
import { ROLES } from '@/lib/types/roles';

// Явно указываем что это динамический route
export const dynamic = 'force-dynamic';

// Получение списка ресторанов, к которым у пользователя есть доступ

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

    // Получаем рестораны, которыми владеет пользователь
    const ownedRestaurants = await RedisDataManager.getUserRestaurants(String(userId));

    // Получаем все доступы пользователя
    const allAccesses = await RedisDataManager.getAllUserAccesses(String(userId));
    const activeAccesses = allAccesses.filter(access => access.isActive);

    // Получаем информацию о ресторанах из доступов
    const accessibleRestaurants = await Promise.all(
      activeAccesses.map(async (access) => {
        const restaurant = await RedisDataManager.getRestaurant(access.restaurantId);
        if (restaurant) {
          return {
            ...restaurant,
            accessRole: access.role,
            isOwner: false
          };
        }
        return null;
      })
    );

    // Объединяем рестораны владельца и доступные рестораны
    const ownedRestaurantsWithRole = ownedRestaurants.map(restaurant => ({
      ...restaurant,
      accessRole: ROLES.ADMIN,
      isOwner: true
    }));

    const allRestaurants = [
      ...ownedRestaurantsWithRole,
      ...accessibleRestaurants.filter(Boolean)
    ];

    // Убираем дубликаты (если пользователь и владелец, и имеет доступ)
    const uniqueRestaurants = allRestaurants.filter((restaurant, index, self) => 
      restaurant && index === self.findIndex(r => r && r.id === restaurant.id)
    );

    const origin = getOriginFromHeaders(request.headers);
    return createCorsResponse({
      restaurants: uniqueRestaurants.filter(Boolean).map(restaurant => ({
        id: restaurant!.id,
        name: restaurant!.name,
        address: restaurant!.address,
        accessRole: restaurant!.accessRole,
        isOwner: restaurant!.isOwner
      }))
    }, 200, origin);

  } catch (error) {
    console.error('Ошибка получения доступных ресторанов:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}


