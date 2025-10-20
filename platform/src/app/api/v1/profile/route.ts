import { NextRequest, NextResponse } from 'next/server';
import { RedisDataManager, connectRedis } from '@/lib/redis';
import { verifyToken } from '@/lib/auth';
import { handleCorsPreflight, createCorsResponse, createCorsErrorResponse, getOriginFromHeaders } from '@/lib/cors';

// Явно указываем что это динамический route
export const dynamic = 'force-dynamic';

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = getOriginFromHeaders(request.headers);
  return handleCorsPreflight(origin);
}

// Получение профиля пользователя для админки
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

    const { userId, email, firstName, lastName } = decoded;

    // Подключение к Redis
    await connectRedis();

    let userData;
    let restaurantData = null;

    // Проверяем, является ли пользователь сотрудником ресторана
    const access = await RedisDataManager.getAccessByEmail(email);
    
    if (access) {
      // Это сотрудник ресторана
      const restaurant = await RedisDataManager.getRestaurant(access.restaurantId);
      restaurantData = restaurant;
      
      userData = {
        id: userId,
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: access?.phone || '+79994033950', // Используем телефон из Access или fallback
        role: access.role,
        restaurant: {
          data: {
            id: restaurant?.id,
            name: restaurant?.name,
            address: restaurant?.address,
            phone: restaurant?.phone,
            start_time: '09:00',
            end_time: '23:00',
            timezone: 'Europe/Moscow'
          }
        }
      };
    } else {
      // Это админ платформы
      const user = await RedisDataManager.getUser(String(userId));
      
      userData = {
        id: userId,
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: user?.role || 'ADMIN',
        restaurant: null // Админ платформы не привязан к конкретному ресторану
      };
    }

    const origin = getOriginFromHeaders(request.headers);
    return createCorsResponse({
      data: userData
    }, 200, origin);

  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}
