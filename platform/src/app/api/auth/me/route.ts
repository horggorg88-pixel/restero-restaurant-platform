import { NextRequest, NextResponse } from 'next/server';
import { RedisDataManager, connectRedis } from '@/lib/redis';
import { verifyToken } from '@/lib/auth';

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

    const token = authHeader.substring(7); // Убираем "Bearer "

    // Проверяем токен
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

    // Находим пользователя
    const user = await RedisDataManager.getUser(String(userId));

    if (!user) {
      return NextResponse.json(
        { message: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);

  } catch (error) {
    console.error('Ошибка получения данных пользователя:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
