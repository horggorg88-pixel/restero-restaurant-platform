import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Получаем токен из заголовков
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Здесь можно добавить проверку токена и получение данных из API
    // Пока возвращаем моковые данные, но с реальной структурой
    
    // В будущем здесь будет запрос к Laravel API
    const activeBookings = {
      count: 0
    };

    return NextResponse.json(activeBookings);
  } catch (error) {
    console.error('Ошибка получения активных бронирований:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
