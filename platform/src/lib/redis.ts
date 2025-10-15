import { createClient } from 'redis'

const redisUrl = process.env.REDIS_URL || 'redis://default:lPz6dcqqZaZNIDtQ2f2jHeDwYAHdpPvL@redis-19619.c241.us-east-1-4.ec2.redns.redis-cloud.com:19619'

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
  static async saveUser(user: any) {
    const key = `user:${user.id}`
    await redis.setEx(key, 86400, JSON.stringify(user)) // TTL 24 часа
    
    // Сохраняем индекс для поиска по email
    const emailKey = `user:email:${user.email}`
    await redis.setEx(emailKey, 86400, user.id) // TTL 24 часа
    
    return user
  }

  // Получение пользователя
  static async getUser(id: string) {
    const key = `user:${id}`
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  }

  // Поиск пользователя по email
  static async getUserByEmail(email: string) {
    const key = `user:email:${email}`
    const userId = await redis.get(key)
    if (userId) {
      return await this.getUser(userId)
    }
    return null
  }

  // Сохранение ресторана
  static async saveRestaurant(restaurant: any) {
    const key = `restaurant:${restaurant.id}`
    await redis.setEx(key, 86400, JSON.stringify(restaurant))
    
    // Добавляем ресторан в список ресторанов пользователя
    const userRestaurantsKey = `user:${restaurant.ownerId}:restaurants`
    await redis.sAdd(userRestaurantsKey, restaurant.id)
    await redis.expire(userRestaurantsKey, 86400) // TTL 24 часа
    
    return restaurant
  }

  // Получение ресторанов пользователя
  static async getUserRestaurants(userId: string) {
    const key = `user:${userId}:restaurants`
    const restaurantIds = await redis.sMembers(key)
    const restaurants = []
    
    for (const id of restaurantIds) {
      const restaurant = await this.getRestaurant(id)
      if (restaurant) {
        restaurants.push(restaurant)
      }
    }
    
    return restaurants
  }

  // Получение ресторана
  static async getRestaurant(id: string) {
    const key = `restaurant:${id}`
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  }

  // Сохранение доступа
  static async saveAccess(access: any) {
    const key = `access:${access.id}`
    await redis.setEx(key, 86400, JSON.stringify(access))
    return access
  }

  // Получение доступов ресторана
  static async getRestaurantAccesses(restaurantId: string) {
    const key = `restaurant:${restaurantId}:accesses`
    const accessIds = await redis.sMembers(key)
    const accesses = []
    
    for (const id of accessIds) {
      const access = await this.getAccess(id)
      if (access) {
        accesses.push(access)
      }
    }
    
    return accesses
  }

  // Получение доступа
  static async getAccess(id: string) {
    const key = `access:${id}`
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
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
    }
  }

  static async deleteRestaurant(id: string) {
    await redis.del(`restaurant:${id}`)
  }

  static async deleteAccess(id: string) {
    await redis.del(`access:${id}`)
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
}
