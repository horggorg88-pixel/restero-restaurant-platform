import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Удаление доступа к ресторану
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; accessId: string } }
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
    const { id, accessId } = params;

    // Демо-ответ
    return NextResponse.json({
      message: 'Доступ успешно удален'
    });

  } catch (error) {
    console.error('Ошибка удаления доступа:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}