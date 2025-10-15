<?php
/**
 * Простой тестовый сервер для демонстрации API интеграции
 * Запуск: php -S localhost:8000 test-server.php
 */

// Устанавливаем заголовки CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

// Обработка preflight запросов
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$requestUri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Убираем query string
$path = parse_url($requestUri, PHP_URL_PATH);

// Маршрутизация
switch ($path) {
    case '/api/health':
        handleHealth();
        break;
        
    case '/api/restaurants':
        if ($method === 'GET') {
            handleGetRestaurants();
        } elseif ($method === 'POST') {
            handleCreateRestaurant();
        }
        break;
        
    case (preg_match('/^\/api\/restaurants\/(\d+)\/stats$/', $path, $matches) ? true : false):
        handleGetStats($matches[1]);
        break;
        
    case (preg_match('/^\/api\/restaurants\/(\d+)\/accesses$/', $path, $matches) ? true : false):
        handleSyncAccesses($matches[1]);
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Not Found']);
        break;
}

function handleHealth() {
    echo json_encode([
        'status' => 'ok',
        'message' => 'Booking API is running',
        'timestamp' => date('c'),
        'version' => '1.0.0'
    ]);
}

function handleGetRestaurants() {
    // Mock данные ресторанов
    $restaurants = [
        [
            'id' => 1,
            'name' => 'Тестовый ресторан',
            'address' => 'Москва, ул. Тестовая, д. 1',
            'description' => 'Тестовый ресторан для демонстрации системы',
            'phone' => '+7 (999) 123-45-67',
            'email' => 'restaurant@test.com',
            'website' => 'https://test-restaurant.com',
            'is_active' => true,
            'created_at' => '2025-10-03T20:00:00Z'
        ],
        [
            'id' => 2,
            'name' => 'Ресторан с интеграцией',
            'address' => 'Москва, ул. Интеграционная, д. 42',
            'description' => 'Тестовый ресторан для демонстрации интеграции с системой бронирований',
            'phone' => '+7 (999) 888-77-66',
            'email' => 'integration@test.com',
            'website' => 'https://integration-restaurant.com',
            'is_active' => true,
            'created_at' => '2025-10-03T23:00:00Z'
        ]
    ];
    
    echo json_encode([
        'success' => true,
        'data' => $restaurants,
        'count' => count($restaurants)
    ]);
}

function handleCreateRestaurant() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        return;
    }
    
    // Валидация
    if (empty($input['name']) || empty($input['address'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Название и адрес обязательны']);
        return;
    }
    
    // Создаем ресторан
    $restaurant = [
        'id' => rand(100, 999),
        'name' => $input['name'],
        'address' => $input['address'],
        'description' => $input['description'] ?? null,
        'phone' => $input['phone'] ?? null,
        'email' => $input['email'] ?? null,
        'website' => $input['website'] ?? null,
        'photo' => $input['photo'] ?? null,
        'restro_id' => $input['restro_id'] ?? null,
        'owner_id' => $input['owner_id'] ?? null,
        'is_active' => true,
        'created_at' => date('c'),
        'updated_at' => date('c')
    ];
    
    // Генерируем API ключ
    $apiKey = 'booking_api_' . bin2hex(random_bytes(16)) . '_' . time();
    
    // Mock статистика
    $stats = [
        'totalBookings' => 0,
        'todayBookings' => 0,
        'activeBookings' => 0,
        'cancelledBookings' => 0,
        'revenue' => 0,
        'averageBookingDuration' => 120,
        'popularTimeSlots' => ['19:00', '20:00', '21:00'],
        'lastUpdated' => date('c')
    ];
    
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Ресторан успешно создан в системе бронирований',
        'data' => $restaurant,
        'api_key' => $apiKey,
        'stats' => $stats
    ]);
}

function handleGetStats($restaurantId) {
    // Mock статистика
    $stats = [
        'totalBookings' => rand(0, 100),
        'todayBookings' => rand(0, 20),
        'activeBookings' => rand(0, 50),
        'cancelledBookings' => rand(0, 10),
        'revenue' => rand(0, 100000),
        'averageBookingDuration' => 120,
        'popularTimeSlots' => ['19:00', '20:00', '21:00'],
        'lastUpdated' => date('c')
    ];
    
    echo json_encode([
        'success' => true,
        'data' => $stats
    ]);
}

function handleSyncAccesses($restaurantId) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    echo json_encode([
        'success' => true,
        'message' => 'Доступы успешно синхронизированы',
        'data' => [
            'restaurantId' => $restaurantId,
            'accesses' => $input['accesses'] ?? []
        ]
    ]);
}
?>
