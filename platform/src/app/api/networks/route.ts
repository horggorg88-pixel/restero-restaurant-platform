import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Получение сетей ресторанов пользователя
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

    // Возвращаем пустые сети
    const networks: any[] = [];

    return NextResponse.json(networks);

  } catch (error) {
    console.error('Ошибка получения сетей:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// Создание новой сети ресторанов
export async function POST(request: NextRequest) {
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
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json(
        { message: 'Название сети обязательно' },
        { status: 400 }
      );
    }

    // Возвращаем демо-сеть
    const network = {
      id: 'network:1',
      name,
      description: description || null,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      message: 'Сеть успешно создана',
      network
    }, { status: 201 });

  } catch (error) {
    console.error('Ошибка создания сети:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}