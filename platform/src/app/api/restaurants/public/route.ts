import { NextRequest, NextResponse } from 'next/server';

import { handleCorsPreflight, createCorsResponse, createCorsErrorResponse, getOriginFromHeaders } from '@/lib/cors';
// Явно указываем что это динамический route
export const dynamic = 'force-dynamic';

// Моковые данные ресторанов для демонстрации
const mockRestaurants = [
  {
    id: '1',
    name: "Ресторан 'Золотой Дракон'",
    description: "Уютный ресторан с традиционной китайской кухней в центре города. Мы предлагаем широкий выбор блюд, приготовленных по старинным рецептам с использованием только свежих ингредиентов.",
    address: "ул. Тверская, 15, Москва",
    phone: "+7 (495) 123-45-67",
    email: "info@goldendragon.ru",
    workingHours: "Пн-Вс: 11:00 - 23:00",
    rating: 4.8,
    photos: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600"
    ],
    cuisine: "Китайская кухня",
    priceRange: "$$$",
    capacity: 120,
    isOpen: true,
    viewCount: 156,
    bookingCount: 23
  },
  {
    id: '2',
    name: "Bella Vista",
    description: "Итальянский ресторан с панорамным видом на город и аутентичной кухней. Наши повара готовят блюда по традиционным итальянским рецептам.",
    address: "пр. Мира, 25, Москва",
    phone: "+7 (495) 234-56-78",
    email: "info@bellavista.ru",
    workingHours: "Пн-Вс: 12:00 - 24:00",
    rating: 4.6,
    photos: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600"
    ],
    cuisine: "Итальянская кухня",
    priceRange: "$$$$",
    capacity: 80,
    isOpen: true,
    viewCount: 89,
    bookingCount: 15
  },
  {
    id: '3',
    name: "Сакура",
    description: "Японский ресторан с суши-баром и традиционными блюдами. Свежие морепродукты и аутентичная японская атмосфера.",
    address: "ул. Арбат, 10, Москва",
    phone: "+7 (495) 345-67-89",
    email: "info@sakura.ru",
    workingHours: "Пн-Вс: 11:30 - 22:30",
    rating: 4.7,
    photos: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600"
    ],
    cuisine: "Японская кухня",
    priceRange: "$$$",
    capacity: 60,
    isOpen: false,
    viewCount: 134,
    bookingCount: 18
  },
  {
    id: '4',
    name: "Русский Двор",
    description: "Традиционная русская кухня в атмосфере старинной усадьбы. Блины, борщ, пельмени и другие классические блюда русской кухни.",
    address: "ул. Красная Площадь, 1, Москва",
    phone: "+7 (495) 456-78-90",
    email: "info@russkiydvor.ru",
    workingHours: "Пн-Вс: 10:00 - 22:00",
    rating: 4.5,
    photos: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600"
    ],
    cuisine: "Русская кухня",
    priceRange: "$$",
    capacity: 100,
    isOpen: true,
    viewCount: 201,
    bookingCount: 31
  }
];


// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = getOriginFromHeaders(request.headers);
  return handleCorsPreflight(origin);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const cuisine = searchParams.get('cuisine');
    const priceRange = searchParams.get('priceRange');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filteredRestaurants = [...mockRestaurants];

    // Фильтрация по поиску
    if (search) {
      const searchLower = search.toLowerCase();
      filteredRestaurants = filteredRestaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchLower) ||
        restaurant.description.toLowerCase().includes(searchLower) ||
        restaurant.cuisine.toLowerCase().includes(searchLower)
      );
    }

    // Фильтрация по кухне
    if (cuisine && cuisine !== 'Все') {
      filteredRestaurants = filteredRestaurants.filter(restaurant =>
        restaurant.cuisine === cuisine
      );
    }

    // Фильтрация по ценовому диапазону
    if (priceRange && priceRange !== 'Все') {
      filteredRestaurants = filteredRestaurants.filter(restaurant =>
        restaurant.priceRange === priceRange
      );
    }

    // Пагинация
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRestaurants = filteredRestaurants.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedRestaurants,
      meta: {
        total: filteredRestaurants.length,
        page,
        limit,
        totalPages: Math.ceil(filteredRestaurants.length / limit)
      }
    });

  } catch (error) {
    console.error('Ошибка получения списка ресторанов:', error);
    return NextResponse.json(
      { success: false, message: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
