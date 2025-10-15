import { NextRequest, NextResponse } from 'next/server';

// Моковые данные ресторанов (те же что и в public route)
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
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    cuisine: "Китайская кухня",
    priceRange: "$$$",
    capacity: 120,
    isOpen: true,
    viewCount: 156,
    bookingCount: 23,
    menu: [
      {
        category: "Закуски",
        items: [
          { name: "Пекинская утка", price: 1200, description: "Традиционная пекинская утка с блинами" },
          { name: "Димсам", price: 450, description: "Парные пельмени с различными начинками" }
        ]
      },
      {
        category: "Основные блюда",
        items: [
          { name: "Кунг-пао", price: 800, description: "Острое блюдо с курицей и арахисом" },
          { name: "Свинина в кисло-сладком соусе", price: 750, description: "Классическое блюдо китайской кухни" }
        ]
      }
    ],
    reviews: [
      {
        id: 1,
        author: "Анна С.",
        rating: 5,
        text: "Отличный ресторан с вкусной едой и приятной атмосферой! Обязательно вернемся.",
        date: "2024-01-15"
      },
      {
        id: 2,
        author: "Михаил К.",
        rating: 4,
        text: "Хорошая китайская кухня, быстрый сервис. Рекомендую пекинскую утку.",
        date: "2024-01-10"
      }
    ]
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
      "/api/placeholder/400/300"
    ],
    cuisine: "Итальянская кухня",
    priceRange: "$$$$",
    capacity: 80,
    isOpen: true,
    viewCount: 89,
    bookingCount: 15,
    menu: [
      {
        category: "Паста",
        items: [
          { name: "Карбонара", price: 650, description: "Классическая паста с беконом и сливочным соусом" },
          { name: "Болоньезе", price: 700, description: "Паста с мясным соусом по-болонски" }
        ]
      }
    ],
    reviews: [
      {
        id: 1,
        author: "Елена В.",
        rating: 5,
        text: "Прекрасный вид и отличная итальянская кухня!",
        date: "2024-01-12"
      }
    ]
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
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    cuisine: "Японская кухня",
    priceRange: "$$$",
    capacity: 60,
    isOpen: false,
    viewCount: 134,
    bookingCount: 18,
    menu: [
      {
        category: "Суши и роллы",
        items: [
          { name: "Филадельфия", price: 450, description: "Классический ролл с лососем и сливочным сыром" },
          { name: "Калифорния", price: 380, description: "Ролл с крабом и авокадо" }
        ]
      }
    ],
    reviews: [
      {
        id: 1,
        author: "Дмитрий П.",
        rating: 4,
        text: "Хорошие суши, свежие ингредиенты.",
        date: "2024-01-08"
      }
    ]
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
      "/api/placeholder/400/300"
    ],
    cuisine: "Русская кухня",
    priceRange: "$$",
    capacity: 100,
    isOpen: true,
    viewCount: 201,
    bookingCount: 31,
    menu: [
      {
        category: "Русские блюда",
        items: [
          { name: "Борщ", price: 350, description: "Классический украинский борщ" },
          { name: "Пельмени", price: 450, description: "Домашние пельмени с мясом" }
        ]
      }
    ],
    reviews: [
      {
        id: 1,
        author: "Ольга М.",
        rating: 5,
        text: "Аутентичная русская кухня, очень вкусно!",
        date: "2024-01-14"
      }
    ]
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const restaurantId = params.id;
    
    // Находим ресторан по ID
    const restaurant = mockRestaurants.find(r => r.id === restaurantId);
    
    if (!restaurant) {
      return NextResponse.json(
        { success: false, message: 'Ресторан не найден' },
        { status: 404 }
      );
    }

    // Увеличиваем счетчик просмотров (в реальном приложении это будет в базе данных)
    restaurant.viewCount += 1;

    return NextResponse.json({
      success: true,
      data: restaurant
    });

  } catch (error) {
    console.error('Ошибка получения ресторана:', error);
    return NextResponse.json(
      { success: false, message: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}