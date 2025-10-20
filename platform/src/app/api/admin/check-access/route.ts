import { NextRequest, NextResponse } from 'next/server';
import { RedisDataManager, connectRedis } from '@/lib/redis';
import { verifyToken } from '@/lib/auth';
import { hasPermission, ROLES } from '@/lib/types/roles';
import { handleCorsPreflight, createCorsResponse, createCorsErrorResponse, getOriginFromHeaders } from '@/lib/cors';

// Явно указываем что это динамический route
export const dynamic = 'force-dynamic';

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = getOriginFromHeaders(request.headers);
  return handleCorsPreflight(origin);
}

// Проверка доступа к админке ресторана
export async function POST(request: NextRequest) {
  try {
    const { restaurantId } = await request.json();

    if (!restaurantId) {
      const origin = getOriginFromHeaders(request.headers);
      return createCorsErrorResponse('ID ресторана обязателен', 400, origin);
    }

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

    // Подключение к Redis
    await connectRedis();

    // Проверяем, что ресторан существует
    const restaurant = await RedisDataManager.getRestaurant(restaurantId);
    if (!restaurant) {
      const origin = getOriginFromHeaders(request.headers);
      return createCorsErrorResponse('Ресторан не найден', 404, origin);
    }

    // Утилита нормализации ID: поддержка 'user:13' и '13'
    const toNumeric = (value: string | number): number => {
      const parts = String(value).split(':');
      const n = parseInt(parts[parts.length - 1] || '', 10);
      return Number.isFinite(n) ? n : NaN;
    };

    // Проверяем, является ли пользователь владельцем ресторана
    if (toNumeric(restaurant.ownerId) === toNumeric(userId)) {
      const origin = getOriginFromHeaders(request.headers);
      return createCorsResponse({
        hasAccess: true,
        role: ROLES.ADMIN,
        permissions: ['booking_list', 'gantt', 'database', 'popups', 'tables_list', 'manage_accesses'],
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          address: restaurant.address
        }
      }, 200, origin);
    }

    // Проверяем доступы пользователя к ресторану
    const accesses = await RedisDataManager.getRestaurantAccesses(restaurantId);
    const userAccess = accesses.find(access => {
      const accessUserNumeric = toNumeric(access.userId);
      const tokenUserNumeric = toNumeric(userId);
      const matchByUserId = Number.isFinite(accessUserNumeric) && accessUserNumeric === tokenUserNumeric;
      const matchByEmail = access.email && decoded.email && String(access.email).toLowerCase() === String(decoded.email).toLowerCase();
      return access.isActive && (matchByUserId || matchByEmail);
    });

    if (!userAccess) {
      const origin = getOriginFromHeaders(request.headers);
      return createCorsErrorResponse('У вас нет доступа к этому ресторану', 403, origin);
    }

    // Получаем разрешения для роли
    const permissions = userAccess.role === ROLES.ADMIN 
      ? ['booking_list', 'gantt', 'database', 'popups', 'tables_list', 'manage_accesses']
      : ['gantt']; // Только диаграмма Ганта для менеджера

    const origin = getOriginFromHeaders(request.headers);
    return createCorsResponse({
      hasAccess: true,
      role: userAccess.role,
      permissions,
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        address: restaurant.address
      }
    }, 200, origin);

  } catch (error) {
    console.error('Ошибка проверки доступа:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}


