import { createClient } from 'redis'
import { 
  User, 
  Restaurant, 
  Network, 
  Access, 
  Booking, 
  Payment, 
  Stats,
  CreateUserData,
  CreateRestaurantData,
  CreateNetworkData,
  CreateAccessData,
  CreateBookingData,
  CreatePaymentData
} from './types'

// Используем только облачный Redis - без fallback на локальный
const redisUrl = process.env.REDIS_URL

if (!redisUrl) {
  throw new Error('REDIS_URL environment variable is required')
}

export const redis = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500)
  }
})

// Подключение к Redis
redis.on('error', (err) => {
  console.error('Redis Client Error:', err)
})

redis.on('connect', () => {
  console.log('Redis Client Connected')
})

redis.on('ready', () => {
  console.log('Redis Client Ready')
})

// Функция для подключения к Redis
export async function connectRedis() {
  try {
    if (!redis.isOpen) {
      await redis.connect()
    }
    return true
  } catch (error) {
    console.error('Failed to connect to Redis:', error)
    return false
  }
}

// Функция для отключения от Redis
export async function disconnectRedis() {
  try {
    if (redis.isOpen) {
      await redis.disconnect()
    }
    return true
  } catch (error) {
    console.error('Failed to disconnect from Redis:', error)
    return false
  }
}

// Утилиты для работы с данными
export class RedisDataManager {
  // Сохранение пользователя
  static async saveUser(user: User) {
    const key = `user:${user.id}`
    await redis.setEx(key, 86400, JSON.stringify(user)) // TTL 24 часа
    
    // Сохраняем индекс для поиска по email
    const emailKey = `user:email:${user.email}`
    await redis.setEx(emailKey, 86400, user.id) // TTL 24 часа
    
    return user
  }

  // Получение пользователя
  static async getUser(id: string): Promise<User | null> {
    const key = `user:${id}`
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  }

  // Поиск пользователя по email
  static async getUserByEmail(email: string): Promise<User | null> {
    const key = `user:email:${email}`
    const userId = await redis.get(key)
    if (userId) {
      return await this.getUser(userId)
    }
    return null
  }

  // Сохранение ресторана
  static async saveRestaurant(restaurant: Restaurant) {
    const key = `restaurant:${restaurant.id}`
    await redis.setEx(key, 86400, JSON.stringify(restaurant))
    
    // Добавляем ресторан в список ресторанов пользователя
    const userRestaurantsKey = `user:${restaurant.ownerId}:restaurants`
    await redis.sAdd(userRestaurantsKey, restaurant.id)
    await redis.expire(userRestaurantsKey, 86400) // TTL 24 часа
    
    // Создаем поисковый индекс по названию
    await this.createSearchIndex('restaurant', 'name', restaurant.name, restaurant.id)
    
    return restaurant
  }

  // Получение ресторанов пользователя
  static async getUserRestaurants(userId: string): Promise<Restaurant[]> {
    const key = `user:${userId}:restaurants`
    const restaurantIds = await redis.sMembers(key)
    const restaurants: Restaurant[] = []
    
    for (const id of restaurantIds) {
      const restaurant = await this.getRestaurant(id)
      if (restaurant) {
        restaurants.push(restaurant)
      }
    }
    
    return restaurants
  }

  // Получение ресторана
  static async getRestaurant(id: string): Promise<Restaurant | null> {
    const key = `restaurant:${id}`
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  }

  // Обновление ресторана
  static async updateRestaurant(id: string, restaurant: Restaurant): Promise<Restaurant> {
    const key = `restaurant:${id}`
    await redis.setEx(key, 86400, JSON.stringify(restaurant))
    return restaurant
  }

  // Сохранение доступа
  static async saveAccess(access: Access) {
    const key = `access:${access.id}`
    await redis.setEx(key, 86400, JSON.stringify(access))
    
    // Добавляем доступ в список доступов ресторана
    const restaurantAccessesKey = `restaurant:${access.restaurantId}:accesses`
    await redis.sAdd(restaurantAccessesKey, access.id)
    await redis.expire(restaurantAccessesKey, 86400)
    
    return access
  }

  // Получение доступа по email
  static async getAccessByEmail(email: string): Promise<Access | null> {
    // Сначала пробуем быстрый индекс, если когда-то создавался
    const emailIndexKey = `access:email:${email}`
    const indexedAccessId = await redis.get(emailIndexKey)
    if (indexedAccessId) {
      const access = await this.getAccess(indexedAccessId)
      if (access) return access
    }

    // Фолбэк: обходим все access:* и аккуратно парсим
    const pattern = `access:*`
    const keys = await redis.keys(pattern)

    for (const key of keys) {
      const value = await redis.get(key)
      if (!value) continue

      try {
        const parsed = JSON.parse(value)
        if (parsed && parsed.email === email) {
          return parsed
        }
      } catch {
        // Значение может быть ссылкой вида 'access:123' — загрузим сам объект
        if (value.startsWith('access:')) {
          const maybe = await this.getAccess(value)
          if (maybe && maybe.email === email) {
            return maybe
          }
        }
        // Игнорируем и идём дальше
      }
    }

    return null
  }

  // Получение доступа по ID
  static async getAccess(id: string): Promise<Access | null> {
    const key = `access:${id}`
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  }

  // Получение доступов ресторана
  static async getRestaurantAccesses(restaurantId: string): Promise<Access[]> {
    const key = `restaurant:${restaurantId}:accesses`
    const accessIds = await redis.sMembers(key)
    const accesses: Access[] = []
    
    for (const id of accessIds) {
      const access = await this.getAccess(id)
      if (access) {
        accesses.push(access)
      }
    }
    
    return accesses
  }

  // Получение всех доступов пользователя
  static async getAllUserAccesses(userId: string): Promise<Access[]> {
    const pattern = `access:*`
    const keys = await redis.keys(pattern)
    const accesses: Access[] = []
    
    for (const key of keys) {
      const data = await redis.get(key)
      if (data) {
        const access = JSON.parse(data)
        if (access.userId === userId) {
          accesses.push(access)
        }
      }
    }
    
    return accesses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Генерация ID
  static async generateId(prefix: string) {
    const key = `counter:${prefix}`
    const id = await redis.incr(key)
    return `${prefix}:${id}`
  }

  // Удаление данных
  static async deleteUser(id: string) {
    const user = await this.getUser(id)
    if (user) {
      await redis.del(`user:${id}`)
      await redis.del(`user:email:${user.email}`)
      
      // Удаляем рестораны пользователя
      const restaurants = await this.getUserRestaurants(id)
      for (const restaurant of restaurants) {
        await this.deleteRestaurant(restaurant.id)
      }
      
      // Удаляем сети пользователя
      const networks = await this.getUserNetworks(id)
      for (const network of networks) {
        await this.deleteNetwork(network.id)
      }
    }
  }

  static async deleteRestaurant(id: string) {
    const restaurant = await this.getRestaurant(id)
    if (restaurant) {
      await redis.del(`restaurant:${id}`)
      
      // Удаляем из списка пользователя
      const userRestaurantsKey = `user:${restaurant.ownerId}:restaurants`
      await redis.sRem(userRestaurantsKey, id)
      
      // Удаляем поисковый индекс
      await redis.del(`restaurant:search:name:${restaurant.name.toLowerCase()}`)
      
      // Удаляем доступы ресторана
      const accesses = await this.getRestaurantAccesses(id)
      for (const access of accesses) {
        await this.deleteAccess(access.id)
      }
    }
  }

  static async deleteAccess(id: string) {
    const access = await this.getAccess(id)
    if (access) {
      await redis.del(`access:${id}`)
      
      // Удаляем из списка ресторана
      const restaurantAccessesKey = `restaurant:${access.restaurantId}:accesses`
      await redis.sRem(restaurantAccessesKey, id)
    }
  }

  // Сохранение API ключа ресторана
  static async saveRestaurantApiKey(restaurantId: string, apiKey: string) {
    const key = `restaurant:${restaurantId}:api_key`
    await redis.setEx(key, 86400, apiKey) // TTL 24 часа
  }

  // Получение API ключа ресторана
  static async getRestaurantApiKey(restaurantId: string) {
    const key = `restaurant:${restaurantId}:api_key`
    return await redis.get(key)
  }

  // Сохранение статистики бронирований
  static async saveBookingStats(restaurantId: string, stats: any) {
    const key = `restaurant:${restaurantId}:stats`
    await redis.setEx(key, 3600, JSON.stringify(stats)) // TTL 1 час
  }

  // Получение статистики бронирований
  static async getBookingStats(restaurantId: string) {
    const key = `restaurant:${restaurantId}:stats`
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  }

  // ==================== СЕТИ РЕСТОРАНОВ ====================
  
  // Сохранение сети ресторанов
  static async saveNetwork(network: Network) {
    const key = `network:${network.id}`
    await redis.setEx(key, 86400, JSON.stringify(network))
    
    // Добавляем сеть в список сетей пользователя
    const userNetworksKey = `user:${network.ownerId}:networks`
    await redis.sAdd(userNetworksKey, network.id)
    await redis.expire(userNetworksKey, 86400)
    
    // Добавляем рестораны в сеть
    for (const restaurantId of network.restaurantIds) {
      const restaurantNetworkKey = `restaurant:${restaurantId}:network`
      await redis.setEx(restaurantNetworkKey, 86400, network.id)
    }
    
    return network
  }

  // Получение сетей пользователя
  static async getUserNetworks(userId: string): Promise<Network[]> {
    const key = `user:${userId}:networks`
    const networkIds = await redis.sMembers(key)
    const networks: Network[] = []
    
    for (const id of networkIds) {
      const network = await this.getNetwork(id)
      if (network) {
        networks.push(network)
      }
    }
    
    return networks
  }

  // Получение сети
  static async getNetwork(id: string): Promise<Network | null> {
    const key = `network:${id}`
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  }

  // Удаление сети
  static async deleteNetwork(id: string) {
    const network = await this.getNetwork(id)
    if (network) {
      await redis.del(`network:${id}`)
      
      // Удаляем из списка пользователя
      const userNetworksKey = `user:${network.ownerId}:networks`
      await redis.sRem(userNetworksKey, id)
      
      // Удаляем связи с ресторанами
      for (const restaurantId of network.restaurantIds) {
        await redis.del(`restaurant:${restaurantId}:network`)
      }
    }
  }

  // ==================== БРОНИРОВАНИЯ ====================
  
  // Сохранение бронирования
  static async saveBooking(booking: Booking) {
    const key = `booking:${booking.id}`
    await redis.setEx(key, 86400, JSON.stringify(booking))
    
    // Добавляем бронирование в список ресторана
    const restaurantBookingsKey = `restaurant:${booking.restaurantId}:bookings`
    await redis.sAdd(restaurantBookingsKey, booking.id)
    await redis.expire(restaurantBookingsKey, 86400)
    
    // Добавляем в индекс по дате
    const dateKey = `bookings:date:${booking.date}`
    await redis.sAdd(dateKey, booking.id)
    await redis.expire(dateKey, 86400)
    
    return booking
  }

  // Получение бронирований ресторана
  static async getRestaurantBookings(restaurantId: string): Promise<Booking[]> {
    const key = `restaurant:${restaurantId}:bookings`
    const bookingIds = await redis.sMembers(key)
    const bookings: Booking[] = []
    
    for (const id of bookingIds) {
      const booking = await this.getBooking(id)
      if (booking) {
        bookings.push(booking)
      }
    }
    
    return bookings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  // Получение бронирования
  static async getBooking(id: string): Promise<Booking | null> {
    const key = `booking:${id}`
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  }

  // Получение активных бронирований
  static async getActiveBookings(restaurantId?: string): Promise<Booking[]> {
    const today = new Date().toISOString().split('T')[0]
    const dateKey = `bookings:date:${today}`
    const bookingIds = await redis.sMembers(dateKey)
    const activeBookings: Booking[] = []
    
    for (const id of bookingIds) {
      const booking = await this.getBooking(id)
      if (booking && 
          (booking.status === 'PENDING' || booking.status === 'CONFIRMED') &&
          (!restaurantId || booking.restaurantId === restaurantId)) {
        activeBookings.push(booking)
      }
    }
    
    return activeBookings
  }

  // Удаление бронирования
  static async deleteBooking(id: string) {
    const booking = await this.getBooking(id)
    if (booking) {
      await redis.del(`booking:${id}`)
      
      // Удаляем из списка ресторана
      const restaurantBookingsKey = `restaurant:${booking.restaurantId}:bookings`
      await redis.sRem(restaurantBookingsKey, id)
      
      // Удаляем из индекса по дате
      const dateKey = `bookings:date:${booking.date}`
      await redis.sRem(dateKey, id)
    }
  }

  // ==================== ПЛАТЕЖИ ====================
  
  // Сохранение платежа
  static async savePayment(payment: Payment) {
    const key = `payment:${payment.id}`
    await redis.setEx(key, 86400, JSON.stringify(payment))
    
    // Добавляем платеж в список пользователя
    const userPaymentsKey = `user:${payment.userId}:payments`
    await redis.sAdd(userPaymentsKey, payment.id)
    await redis.expire(userPaymentsKey, 86400)
    
    return payment
  }

  // Получение платежей пользователя
  static async getUserPayments(userId: string): Promise<Payment[]> {
    const key = `user:${userId}:payments`
    const paymentIds = await redis.sMembers(key)
    const payments: Payment[] = []
    
    for (const id of paymentIds) {
      const payment = await this.getPayment(id)
      if (payment) {
        payments.push(payment)
      }
    }
    
    return payments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Получение платежа
  static async getPayment(id: string): Promise<Payment | null> {
    const key = `payment:${id}`
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  }

  // ==================== ПОИСК И ИНДЕКСЫ ====================
  
  // Создание поискового индекса
  static async createSearchIndex(entityType: string, field: string, value: string, entityId: string) {
    const key = `${entityType}:search:${field}:${value.toLowerCase()}`
    await redis.setEx(key, 86400, entityId)
  }

  // Поиск ресторанов по названию
  static async searchRestaurantsByName(query: string): Promise<Restaurant[]> {
    const pattern = `restaurant:search:name:*${query.toLowerCase()}*`
    const keys = await redis.keys(pattern)
    const restaurants: Restaurant[] = []
    
    for (const key of keys) {
      const restaurantId = await redis.get(key)
      if (restaurantId) {
        const restaurant = await this.getRestaurant(restaurantId)
        if (restaurant) restaurants.push(restaurant)
      }
    }
    
    return restaurants
  }

  // ==================== СЧЕТЧИКИ И СТАТИСТИКА ====================
  
  // Увеличение счетчика
  static async incrementCounter(key: string, increment = 1): Promise<number> {
    return await redis.incrBy(`counter:${key}`, increment)
  }

  // Получение счетчика
  static async getCounter(key: string): Promise<number> {
    const value = await redis.get(`counter:${key}`)
    return value ? parseInt(value) : 0
  }

  // Обновление статистики
  static async updateStats(entityType: string, entityId: string, stats: Stats) {
    const key = `stats:${entityType}:${entityId}`
    await redis.setEx(key, 3600, JSON.stringify(stats)) // TTL 1 час
  }

  // Получение статистики
  static async getStats(entityType: string, entityId: string): Promise<Stats | null> {
    const key = `stats:${entityType}:${entityId}`
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  }

  // ==================== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ====================
  
  // Получение всех ключей по паттерну
  static async getKeysByPattern(pattern: string): Promise<string[]> {
    return await redis.keys(pattern)
  }

  // Очистка всех данных (только для разработки!)
  static async clearAllData() {
    const keys = await redis.keys('*')
    if (keys.length > 0) {
      await redis.del(keys)
    }
  }

  // Получение размера базы данных
  static async getDatabaseSize(): Promise<number> {
    return await redis.dbSize()
  }
}
