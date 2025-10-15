import { NextRequest, NextResponse } from 'next/server';

// Активация доступа по токену
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: 'Токен доступа обязателен' },
        { status: 400 }
      );
    }

    // Демо-ответ
    return NextResponse.json({
      message: 'Доступ успешно активирован',
      access: {
        id: 'access:1',
        email: 'demo@example.com',
        role: 'HOSTESS',
        status: 'ACTIVE',
        restaurantId: 'restaurant:1',
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Ошибка активации доступа:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}