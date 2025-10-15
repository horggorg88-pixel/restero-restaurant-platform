import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Получение аналитики пользователя
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

    const token = authHeader.substring(7);
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

    // Возвращаем демо-аналитику
    const analytics = {
      totalRestaurants: 0,
      totalBookings: 0,
      totalRevenue: 0,
      topRestaurants: [],
      bookingsByMonth: [],
      revenueByMonth: []
    };

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Ошибка получения аналитики:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}