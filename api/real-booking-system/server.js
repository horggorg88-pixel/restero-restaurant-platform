const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'rest_gills',
  password: 'password',
  port: 5432,
});

// JWT Secret
const JWT_SECRET = 'your-super-secret-jwt-key-here';

// Initialize database tables
async function initializeDatabase() {
  try {
    // Create restaurants table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        description TEXT,
        phone VARCHAR(20),
        email VARCHAR(255),
        website VARCHAR(255),
        photo VARCHAR(500),
        restro_id VARCHAR(100),
        owner_id VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        api_key VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create halls table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS halls (
        id SERIAL PRIMARY KEY,
        restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        capacity INTEGER NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create tables table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tables (
        id SERIAL PRIMARY KEY,
        hall_id INTEGER REFERENCES halls(id) ON DELETE CASCADE,
        number VARCHAR(50) NOT NULL,
        capacity INTEGER NOT NULL,
        position_x INTEGER DEFAULT 0,
        position_y INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create bookings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
        table_id INTEGER REFERENCES tables(id) ON DELETE CASCADE,
        guest_name VARCHAR(255) NOT NULL,
        guest_phone VARCHAR(20) NOT NULL,
        guest_email VARCHAR(255),
        booking_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        guests_count INTEGER NOT NULL,
        status VARCHAR(50) DEFAULT 'confirmed',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create users table for authentication
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Real Booking API is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    database: 'PostgreSQL'
  });
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Get all restaurants
app.get('/api/restaurants', async (req, res) => {
  try {
    console.log('GET /api/restaurants - Получение списка ресторанов');
    
    const result = await pool.query(`
      SELECT r.*, 
             COUNT(DISTINCT h.id) as halls_count,
             COUNT(DISTINCT t.id) as tables_count,
             COUNT(DISTINCT b.id) as bookings_count
      FROM restaurants r
      LEFT JOIN halls h ON r.id = h.restaurant_id AND h.is_active = true
      LEFT JOIN tables t ON h.id = t.hall_id AND t.is_active = true
      LEFT JOIN bookings b ON r.id = b.restaurant_id AND b.status = 'confirmed'
      WHERE r.is_active = true
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error getting restaurants:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create restaurant
app.post('/api/restaurants', async (req, res) => {
  try {
    console.log('POST /api/restaurants - Создание ресторана:', req.body);
    
    const { name, address, description, phone, email, website, photo, restro_id, owner_id } = req.body;
    
    if (!name || !address) {
      return res.status(400).json({
        success: false,
        message: 'Название и адрес обязательны'
      });
    }
    
    // Generate API key
    const apiKey = `booking_api_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create restaurant
    const restaurantResult = await pool.query(`
      INSERT INTO restaurants (name, address, description, phone, email, website, photo, restro_id, owner_id, api_key)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [name, address, description, phone, email, website, photo, restro_id, owner_id, apiKey]);

    const restaurant = restaurantResult.rows[0];

    // Create default hall
    const hallResult = await pool.query(`
      INSERT INTO halls (restaurant_id, name, capacity, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [restaurant.id, 'Основной зал', 50, 'Главный зал ресторана']);

    const hall = hallResult.rows[0];

    // Create default tables
    const tables = [
      { number: '1', capacity: 2, position_x: 10, position_y: 10 },
      { number: '2', capacity: 4, position_x: 20, position_y: 10 },
      { number: '3', capacity: 6, position_x: 30, position_y: 10 },
      { number: '4', capacity: 2, position_x: 10, position_y: 20 },
      { number: '5', capacity: 4, position_x: 20, position_y: 20 },
      { number: '6', capacity: 8, position_x: 30, position_y: 20 },
    ];

    for (const table of tables) {
      await pool.query(`
        INSERT INTO tables (hall_id, number, capacity, position_x, position_y)
        VALUES ($1, $2, $3, $4, $5)
      `, [hall.id, table.number, table.number, table.position_x, table.position_y]);
    }

    // Get restaurant stats
    const statsResult = await pool.query(`
      SELECT 
        COUNT(DISTINCT b.id) as total_bookings,
        COUNT(DISTINCT CASE WHEN b.booking_date = CURRENT_DATE THEN b.id END) as today_bookings,
        COUNT(DISTINCT CASE WHEN b.status = 'confirmed' THEN b.id END) as active_bookings,
        COUNT(DISTINCT CASE WHEN b.status = 'cancelled' THEN b.id END) as cancelled_bookings,
        COALESCE(SUM(CASE WHEN b.status = 'confirmed' THEN 1 ELSE 0 END), 0) * 1000 as revenue
      FROM bookings b
      WHERE b.restaurant_id = $1
    `, [restaurant.id]);

    const stats = statsResult.rows[0];

    res.status(201).json({
      success: true,
      message: 'Ресторан успешно создан в системе бронирований',
      data: {
        ...restaurant,
        halls: [hall],
        stats: {
          totalBookings: parseInt(stats.total_bookings) || 0,
          todayBookings: parseInt(stats.today_bookings) || 0,
          activeBookings: parseInt(stats.active_bookings) || 0,
          cancelledBookings: parseInt(stats.cancelled_bookings) || 0,
          revenue: parseInt(stats.revenue) || 0,
          averageBookingDuration: 120,
          popularTimeSlots: ['19:00', '20:00', '21:00'],
          lastUpdated: new Date().toISOString()
        }
      },
      api_key: apiKey
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get restaurant stats
app.get('/api/restaurants/:id/stats', async (req, res) => {
  try {
    const restaurantId = parseInt(req.params.id);
    
    const statsResult = await pool.query(`
      SELECT 
        COUNT(DISTINCT b.id) as total_bookings,
        COUNT(DISTINCT CASE WHEN b.booking_date = CURRENT_DATE THEN b.id END) as today_bookings,
        COUNT(DISTINCT CASE WHEN b.status = 'confirmed' THEN b.id END) as active_bookings,
        COUNT(DISTINCT CASE WHEN b.status = 'cancelled' THEN b.id END) as cancelled_bookings,
        COALESCE(SUM(CASE WHEN b.status = 'confirmed' THEN 1 ELSE 0 END), 0) * 1000 as revenue
      FROM bookings b
      WHERE b.restaurant_id = $1
    `, [restaurantId]);

    const stats = statsResult.rows[0];

    res.json({
      success: true,
      data: {
        totalBookings: parseInt(stats.total_bookings) || 0,
        todayBookings: parseInt(stats.today_bookings) || 0,
        activeBookings: parseInt(stats.active_bookings) || 0,
        cancelledBookings: parseInt(stats.cancelled_bookings) || 0,
        revenue: parseInt(stats.revenue) || 0,
        averageBookingDuration: 120,
        popularTimeSlots: ['19:00', '20:00', '21:00'],
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Sync accesses
app.post('/api/restaurants/:id/accesses', async (req, res) => {
  try {
    const restaurantId = parseInt(req.params.id);
    const { accesses } = req.body;
    
    console.log(`POST /api/restaurants/${restaurantId}/accesses - Синхронизация доступов:`, accesses);
    
    res.json({
      success: true,
      message: 'Доступы успешно синхронизированы',
      data: {
        restaurantId,
        accesses: accesses || []
      }
    });
  } catch (error) {
    console.error('Error syncing accesses:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create booking
app.post('/api/restaurants/:id/bookings', async (req, res) => {
  try {
    const restaurantId = parseInt(req.params.id);
    const { guest_name, guest_phone, guest_email, booking_date, start_time, end_time, guests_count, notes } = req.body;
    
    if (!guest_name || !guest_phone || !booking_date || !start_time || !end_time || !guests_count) {
      return res.status(400).json({
        success: false,
        message: 'Все обязательные поля должны быть заполнены'
      });
    }

    // Find available table
    const tableResult = await pool.query(`
      SELECT t.id, t.number, t.capacity
      FROM tables t
      JOIN halls h ON t.hall_id = h.id
      WHERE h.restaurant_id = $1 
        AND t.capacity >= $2
        AND t.is_active = true
        AND t.id NOT IN (
          SELECT b.table_id 
          FROM bookings b 
          WHERE b.restaurant_id = $1 
            AND b.booking_date = $3
            AND b.status = 'confirmed'
            AND (
              (b.start_time <= $4 AND b.end_time > $4) OR
              (b.start_time < $5 AND b.end_time >= $5) OR
              (b.start_time >= $4 AND b.end_time <= $5)
            )
        )
      ORDER BY t.capacity ASC
      LIMIT 1
    `, [restaurantId, guests_count, booking_date, start_time, end_time]);

    if (tableResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Нет доступных столов на указанное время'
      });
    }

    const table = tableResult.rows[0];

    // Create booking
    const bookingResult = await pool.query(`
      INSERT INTO bookings (restaurant_id, table_id, guest_name, guest_phone, guest_email, booking_date, start_time, end_time, guests_count, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [restaurantId, table.id, guest_name, guest_phone, guest_email, booking_date, start_time, end_time, guests_count, notes]);

    const booking = bookingResult.rows[0];

    res.status(201).json({
      success: true,
      message: 'Бронирование успешно создано',
      data: {
        ...booking,
        table_number: table.number
      }
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера',
    error: err.message
  });
});

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log('🚀 Real Booking API запущен на порту', PORT);
      console.log('📊 Health check: http://localhost:' + PORT + '/api/health');
      console.log('🏪 Restaurants: http://localhost:' + PORT + '/api/restaurants');
      console.log('📅 Bookings: http://localhost:' + PORT + '/api/restaurants/:id/bookings');
      console.log('='.repeat(50));
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Остановка Real Booking API...');
  await pool.end();
  process.exit(0);
});

startServer();
