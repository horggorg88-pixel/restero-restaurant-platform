const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
let restaurants = [];
let restaurantIdCounter = 1;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Booking API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Get all restaurants
app.get('/api/restaurants', (req, res) => {
  console.log('GET /api/restaurants - Получение списка ресторанов');
  res.json({
    success: true,
    data: restaurants,
    count: restaurants.length
  });
});

// Create restaurant
app.post('/api/restaurants', (req, res) => {
  console.log('POST /api/restaurants - Создание ресторана:', req.body);
  
  const { name, address, description, phone, email, website, photo, restro_id, owner_id } = req.body;
  
  if (!name || !address) {
    return res.status(400).json({
      success: false,
      message: 'Название и адрес обязательны'
    });
  }
  
  const newRestaurant = {
    id: restaurantIdCounter++,
    name,
    address,
    description: description || null,
    phone: phone || null,
    email: email || null,
    website: website || null,
    photo: photo || null,
    restro_id: restro_id || null,
    owner_id: owner_id || null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // Mock booking data
    halls: [
      {
        id: 1,
        name: 'Основной зал',
        capacity: 50,
        tables: [
          { id: 1, number: '1', capacity: 2, position: { x: 10, y: 10 } },
          { id: 2, number: '2', capacity: 4, position: { x: 20, y: 10 } },
          { id: 3, number: '3', capacity: 6, position: { x: 30, y: 10 } }
        ]
      }
    ],
    stats: {
      totalBookings: 0,
      todayBookings: 0,
      activeBookings: 0,
      cancelledBookings: 0,
      revenue: 0,
      averageBookingDuration: 120, // minutes
      popularTimeSlots: ['19:00', '20:00', '21:00'],
      lastUpdated: new Date().toISOString()
    }
  };
  
  restaurants.push(newRestaurant);
  
  // Generate API key
  const apiKey = `booking_api_${newRestaurant.id}_${Date.now()}`;
  
  res.status(201).json({
    success: true,
    message: 'Ресторан успешно создан в системе бронирований',
    data: newRestaurant,
    api_key: apiKey
  });
});

// Get restaurant stats
app.get('/api/restaurants/:id/stats', (req, res) => {
  const restaurantId = parseInt(req.params.id);
  const restaurant = restaurants.find(r => r.id === restaurantId);
  
  if (!restaurant) {
    return res.status(404).json({
      success: false,
      message: 'Ресторан не найден'
    });
  }
  
  console.log(`GET /api/restaurants/${restaurantId}/stats - Получение статистики`);
  
  res.json({
    success: true,
    data: restaurant.stats
  });
});

// Sync accesses
app.post('/api/restaurants/:id/accesses', (req, res) => {
  const restaurantId = parseInt(req.params.id);
  const restaurant = restaurants.find(r => r.id === restaurantId);
  
  if (!restaurant) {
    return res.status(404).json({
      success: false,
      message: 'Ресторан не найден'
    });
  }
  
  console.log(`POST /api/restaurants/${restaurantId}/accesses - Синхронизация доступов:`, req.body);
  
  res.json({
    success: true,
    message: 'Доступы успешно синхронизированы',
    data: {
      restaurantId,
      accesses: req.body.accesses || []
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Ошибка API:', err);
  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера',
    error: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock Booking API запущен на порту ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🏪 Restaurants: http://localhost:${PORT}/api/restaurants`);
  console.log('='.repeat(50));
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Остановка Mock Booking API...');
  process.exit(0);
});
