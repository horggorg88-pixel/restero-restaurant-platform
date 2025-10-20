import { NextRequest, NextResponse } from 'next/server';


// Явно указываем что это динамический route
export const dynamic = 'force-dynamic';
import { handleCorsPreflight, createCorsResponse, createCorsErrorResponse, getOriginFromHeaders } from '@/lib/cors';
// Подтверждение email

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
    return createCorsErrorResponse('Токен подтверждения обязателен', 400, origin);
    }

    // Демо-ответ
    const origin = getOriginFromHeaders(request.headers);
    return createCorsResponse({
      message: 'Email успешно подтвержден'
    }, 200, origin);

  } catch (error) {
    console.error('Ошибка подтверждения email:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}