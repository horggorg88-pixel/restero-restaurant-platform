import { NextRequest, NextResponse } from 'next/server';


// Явно указываем что это динамический route
export const dynamic = 'force-dynamic';
import { handleCorsPreflight, createCorsResponse, createCorsErrorResponse, getOriginFromHeaders } from '@/lib/cors';
// Активация доступа по токену

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = getOriginFromHeaders(request.headers);
  return handleCorsPreflight(origin);
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Токен доступа обязателен', 400, origin);
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
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}