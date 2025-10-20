import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, createCorsResponse, createCorsErrorResponse, getOriginFromHeaders } from '@/lib/cors';

// Явно указываем что это динамический route
export const dynamic = 'force-dynamic';

export async function OPTIONS(request: NextRequest) {
  const origin = getOriginFromHeaders(request.headers);
  return handleCorsPreflight(origin);
}

export async function POST(request: NextRequest) {
  try {
    // Простой logout - просто возвращаем успех
    // В реальном приложении здесь можно добавить логику инвалидации токена
    const origin = getOriginFromHeaders(request.headers);
    return createCorsResponse({
      message: 'Logout successful'
    }, 200, origin);
  } catch (error) {
    console.error('Error during logout:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Internal server error', 500, origin);
  }
}
