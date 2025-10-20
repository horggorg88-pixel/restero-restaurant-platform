import { NextRequest, NextResponse } from 'next/server';


// Явно указываем что это динамический route
export const dynamic = 'force-dynamic';
import { handleCorsPreflight, createCorsResponse, createCorsErrorResponse, getOriginFromHeaders } from '@/lib/cors';
// API для проверки статуса системы бронирований

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = getOriginFromHeaders(request.headers);
  return handleCorsPreflight(origin);
}

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      status: 'active',
      message: 'Система бронирований работает'
    });

  } catch (error) {
    console.error('Ошибка проверки статуса системы бронирований:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Ошибка проверки статуса', 500, origin);
  }
}
