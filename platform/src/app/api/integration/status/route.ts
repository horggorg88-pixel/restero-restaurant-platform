import { NextRequest, NextResponse } from 'next/server';
import { BookingApiService } from '@/lib/booking-api';

// Проверка статуса интеграции с системой бронирований
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
          url: process.env.BOOKING_API_URL || 'http://localhost:8000/api',
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
