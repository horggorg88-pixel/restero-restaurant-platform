import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Получение доступов к ресторану
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { id } = params;

    // Возвращаем пустые доступы
    const accesses: any[] = [];

    return NextResponse.json(accesses);

  } catch (error) {
    console.error('Ошибка получения доступов:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
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
    const { id } = params;
    const { email, role } = await request.json();

    if (!email || !role) {
      return NextResponse.json(
        { message: 'Email и роль обязательны' },
        { status: 400 }
      );
    }

    // Возвращаем демо-доступ
    const access = {
      id: 'access:1',
      email,
      role,
      status: 'PENDING',
      restaurantId: id,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      message: 'Доступ успешно создан',
      access
    }, { status: 201 });

  } catch (error) {
    console.error('Ошибка создания доступа:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}