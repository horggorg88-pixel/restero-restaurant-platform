import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, createCorsResponse, createCorsErrorResponse, getOriginFromHeaders } from '@/lib/cors';
import { BookingApiService } from '@/lib/booking-api';


// Явно указываем что это динамический route
export const dynamic = 'force-dynamic';
// Проверка статуса интеграции с системой бронирований

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = getOriginFromHeaders(request.headers);
  return handleCorsPreflight(origin);
}

export async function GET(request: NextRequest) {
  try {
    console.log('Проверка статуса интеграции с системой бронирований...');
    
    // Проверяем доступность API бронирований
    const apiStatus = await BookingApiService.checkApiStatus();
    
    // Получаем список ресторанов из системы бронирований
    const restaurantsResult = await BookingApiService.getRestaurants();
    
    return NextResponse.json({
      success: true,
      integration: {
        bookingApi: {
          status: apiStatus.success ? 'connected' : 'disconnected',
          url: process.env.BOOKING_API_URL || 'http://localhost:3000/api/booking',
          error: apiStatus.error
        },
        restaurants: {
          count: restaurantsResult.success ? restaurantsResult.data?.count || restaurantsResult.data?.data?.length || 0 : 0,
          error: restaurantsResult.error
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Ошибка проверки статуса интеграции:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Ошибка проверки статуса интеграции',
        error: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
}
