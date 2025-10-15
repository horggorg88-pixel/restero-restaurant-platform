import { NextRequest, NextResponse } from 'next/server';

// Подтверждение email
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: 'Токен подтверждения обязателен' },
        { status: 400 }
      );
    }

    // Демо-ответ
    return NextResponse.json({
      message: 'Email успешно подтвержден'
    });

  } catch (error) {
    console.error('Ошибка подтверждения email:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}