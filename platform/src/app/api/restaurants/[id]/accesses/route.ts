import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, createCorsResponse, createCorsErrorResponse, getOriginFromHeaders } from '@/lib/cors';
import { RedisDataManager, connectRedis } from '@/lib/redis';
import { verifyToken } from '@/lib/auth';
import { ROLES } from '@/lib/types/roles';

// Явно указываем что это динамический route
export const dynamic = 'force-dynamic';

// Получение доступов к ресторану

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = getOriginFromHeaders(request.headers);
  return handleCorsPreflight(origin);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    return createCorsErrorResponse('У вас нет прав для просмотра доступов этого ресторана', 403, origin);
    }

    // Получаем доступы к ресторану
    const accesses = await RedisDataManager.getRestaurantAccesses(restaurantId);

    // Форматируем данные доступов
    const formattedAccesses = accesses.map((access) => ({
      id: access.id,
      userId: access.userId,
      restaurantId: access.restaurantId,
      email: access.email,
      role: access.role,
      isActive: access.isActive,
      createdAt: access.createdAt,
      updatedAt: access.updatedAt,
      activatedAt: access.activatedAt
    }));

    const origin = getOriginFromHeaders(request.headers);
    return createCorsResponse(formattedAccesses, 200, origin);

  } catch (error) {
    console.error('Ошибка получения доступов:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}

// Создание нового доступа к ресторану
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { email, password, phone, role } = await request.json();

    if (!email || !password || !phone || !role) {
      return NextResponse.json(
        { message: 'Email, пароль, телефон и роль обязательны' },
        { status: 400 }
      );
    }

    // Проверяем, что роль валидна
    if (!Object.values(ROLES).includes(role)) {
      return NextResponse.json(
        { message: 'Недопустимая роль. Доступные роли: admin, manager' },
        { status: 400 }
      );
    }

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
    return createCorsErrorResponse('У вас нет прав для создания доступов к этому ресторану', 403, origin);
    }

    // Проверяем, не существует ли уже доступ для этого email к этому ресторану
    const existingAccesses = await RedisDataManager.getRestaurantAccesses(restaurantId);
    const existingAccess = existingAccesses.find(access => access.email === email);
    
    if (existingAccess) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Доступ для этого email уже существует', 409, origin);
    }

    // Создаем новый доступ (не привязываем к существующему пользователю)
    const accessId = `access:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    const accessData = {
      id: accessId,
      userId: '', // Пустой, так как это доступ для сотрудника
      restaurantId: restaurantId,
      email: email,
      password: password, // Храним пароль в открытом виде для простоты
      phone: phone, // Добавляем телефон
      role: role as 'admin' | 'manager',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const access = await RedisDataManager.saveAccess(accessData);

    return NextResponse.json({
      message: 'Доступ успешно создан',
      access: {
        id: access.id,
        userId: access.userId,
        restaurantId: access.restaurantId,
        email: access.email,
        role: access.role,
        isActive: access.isActive,
        createdAt: access.createdAt,
        updatedAt: access.updatedAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Ошибка создания доступа:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}