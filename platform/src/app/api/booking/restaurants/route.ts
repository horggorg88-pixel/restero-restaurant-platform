import { NextRequest, NextResponse } from 'next/server';


// Явно указываем что это динамический route
export const dynamic = 'force-dynamic';
import { handleCorsPreflight, createCorsResponse, createCorsErrorResponse, getOriginFromHeaders } from '@/lib/cors';
// API для системы бронирований - создание ресторана

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = getOriginFromHeaders(request.headers);
  return handleCorsPreflight(origin);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Симуляция создания ресторана в системе бронирований
    const restaurantId = Math.floor(Math.random() * 1000) + 1;
    
    return NextResponse.json({
      success: true,
      data: {
        id: restaurantId,
        name: body.name || 'Новый ресторан',
        address: body.address || 'Адрес не указан',
        created_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Ошибка создания ресторана в системе бронирований:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Ошибка создания ресторана', 500, origin);
  }
}

// API для системы бронирований - получение ресторанов
export async function GET(request: NextRequest) {
  try {
    // Симуляция получения списка ресторанов
    const restaurants = [
      {
        id: 1,
        name: 'Ресторан 1',
        address: 'Адрес 1',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Ресторан 2', 
        address: 'Адрес 2',
        created_at: new Date().toISOString()
      }
    ];
    
    return NextResponse.json({
      success: true,
      data: restaurants,
      count: restaurants.length
    });

  } catch (error) {
    console.error('Ошибка получения ресторанов:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Ошибка получения ресторанов', 500, origin);
  }
}
