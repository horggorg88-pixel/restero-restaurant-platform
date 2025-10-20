import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, createCorsResponse, createCorsErrorResponse, getOriginFromHeaders } from '@/lib/cors';
import { verifyToken } from '@/lib/auth';

// Явно указываем что это динамический route
export const dynamic = 'force-dynamic';

// Получение аналитики пользователя

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = getOriginFromHeaders(request.headers);
  return handleCorsPreflight(origin);
}

export async function GET(request: NextRequest) {
  try {
    // Получаем токен из заголовка Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Токен авторизации не предоставлен', 401, origin);
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse(error instanceof Error ? error.message : 'Недействительный токен', 401, origin);
    }

    const { userId } = decoded;

    // Возвращаем демо-аналитику с правильной структурой
    const analytics = {
      totalBookings: 0,
      totalRevenue: 0,
      averageBookingDuration: 0,
      topRestaurants: [],
      bookingsByMonth: [],
      bookingsByDay: []
    };

    const origin = getOriginFromHeaders(request.headers);
    return createCorsResponse(analytics, 200, origin);

  } catch (error) {
    console.error('Ошибка получения аналитики:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}