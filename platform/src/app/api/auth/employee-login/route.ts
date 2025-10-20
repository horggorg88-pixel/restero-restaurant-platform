import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, createCorsResponse, createCorsErrorResponse, getOriginFromHeaders } from '@/lib/cors';
import { RedisDataManager, connectRedis } from '@/lib/redis';
import { generateJWTToken } from '@/lib/auth';


// Явно указываем что это динамический route
export const dynamic = 'force-dynamic';
// Аутентификация сотрудника по email и паролю

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = getOriginFromHeaders(request.headers);
  return handleCorsPreflight(origin);
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, restaurantId } = await request.json();

    if (!email || !password || !restaurantId) {
      return NextResponse.json(
        { message: 'Email, пароль и ID ресторана обязательны' },
        { status: 400 }
      );
    }

    // Подключение к Redis
    await connectRedis();

    // Ищем доступ по email и ресторану
    const access = await RedisDataManager.getAccessByEmail(email);
    
    if (!access) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Доступ не найден', 404, origin);
    }

    // Проверяем, что доступ для правильного ресторана
    if (access.restaurantId !== restaurantId) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Доступ не найден для этого ресторана', 404, origin);
    }

    // Проверяем пароль
    if (access.password !== password) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Неверный пароль', 401, origin);
    }

    // Проверяем, что доступ активен
    if (!access.isActive) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Доступ деактивирован', 403, origin);
    }

    // Получаем информацию о ресторане
    const restaurant = await RedisDataManager.getRestaurant(restaurantId);
    if (!restaurant) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Ресторан не найден', 404, origin);
    }

    // Генерируем JWT токен для сотрудника
    const token = generateJWTToken({
      userId: parseInt(access.id.split(':')[1]) || 0, // Извлекаем числовую часть из ID
      email: access.email,
      firstName: 'Сотрудник',
      lastName: access.email.split('@')[0]
    });

    // Обновляем время последнего входа
    access.activatedAt = new Date().toISOString();
    access.updatedAt = new Date().toISOString();
    await RedisDataManager.saveAccess(access);

    return NextResponse.json({
      message: 'Успешная аутентификация',
      token,
      user: {
        id: access.id,
        email: access.email,
        firstName: 'Сотрудник',
        lastName: access.email.split('@')[0],
        role: access.role,
        restaurantId: access.restaurantId,
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          address: restaurant.address
        }
      }
    });

  } catch (error) {
    console.error('Ошибка аутентификации сотрудника:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}
