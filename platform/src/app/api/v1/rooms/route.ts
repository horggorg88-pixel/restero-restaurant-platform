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

// Получение комнат/залов для админки
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

    const { userId } = decoded;

    // Подключение к Redis
    await connectRedis();

    // Для демонстрации создаем базовые комнаты
    // В реальном приложении это должно браться из базы данных
    const rooms = [
      {
        id: 'room_1',
        name: 'Основной зал',
        capacity: 50,
        comment: 'Основной зал ресторана',
        tables: {
          data: [
            { id: 'table_1', number: '1', capacity: 4 },
            { id: 'table_2', number: '2', capacity: 2 },
            { id: 'table_3', number: '3', capacity: 6 },
            { id: 'table_4', number: '4', capacity: 4 },
            { id: 'table_5', number: '5', capacity: 8 }
          ]
        }
      },
      {
        id: 'room_2', 
        name: 'VIP зал',
        capacity: 20,
        comment: 'VIP зал для особых случаев',
        tables: {
          data: [
            { id: 'table_6', number: '6', capacity: 4 },
            { id: 'table_7', number: '7', capacity: 6 }
          ]
        }
      }
    ];

    const origin = getOriginFromHeaders(request.headers);
    return createCorsResponse({
      data: rooms
    }, 200, origin);

  } catch (error) {
    console.error('Ошибка получения комнат:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}
