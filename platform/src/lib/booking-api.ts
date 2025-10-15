import { RedisDataManager } from './redis';

export interface RestaurantData {
  id: string;
  name: string;
  address: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  photo?: string;
  ownerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookingApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  apiKey?: string;
}

export class BookingApiService {
  private static readonly BOOKING_API_URL = process.env.BOOKING_API_URL || 'http://localhost:8000/api';
  private static readonly BOOKING_API_KEY = process.env.BOOKING_API_KEY || 'default-api-key';

  /**
   * Создание ресторана в системе бронирований (rest-gills)
   */
  static async createRestaurant(restaurantData: RestaurantData): Promise<BookingApiResponse> {
    try {
      console.log('Создание ресторана в системе бронирований:', restaurantData.name);
      
      const response = await fetch(`${this.BOOKING_API_URL}/restaurants`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.BOOKING_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: restaurantData.name,
          address: restaurantData.address,
          description: restaurantData.description,
          phone: restaurantData.phone,
          email: restaurantData.email,
          website: restaurantData.website,
          photo: restaurantData.photo,
          restro_id: restaurantData.id, // ID из Restro
          owner_id: restaurantData.ownerId
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.message || 'Ошибка создания ресторана'}`);
      }

      const result = await response.json();
      
      // Сохраняем API ключ в Redis
      if (result.api_key) {
        await RedisDataManager.saveRestaurantApiKey(restaurantData.id, result.api_key);
      }

      return {
        success: true,
        data: result,
        apiKey: result.api_key
      };

    } catch (error) {
      console.error('Ошибка создания ресторана в системе бронирований:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Неизвестная ошибка'
      };
    }
  }

  /**
   * Синхронизация доступов сотрудников с системой бронирований
   */
  static async syncAccesses(restaurantId: string, accesses: any[]): Promise<BookingApiResponse> {
    try {
      console.log('Синхронизация доступов для ресторана:', restaurantId);
      
      const response = await fetch(`${this.BOOKING_API_URL}/restaurants/${restaurantId}/accesses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.BOOKING_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          accesses: accesses
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.message || 'Ошибка синхронизации доступов'}`);
      }

      const result = await response.json();

      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.error('Ошибка синхронизации доступов:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Неизвестная ошибка'
      };
    }
  }

  /**
   * Получение статистики бронирований
   */
  static async getBookingStats(restaurantId: string): Promise<BookingApiResponse> {
    try {
      console.log('Получение статистики бронирований для ресторана:', restaurantId);
      
      const response = await fetch(`${this.BOOKING_API_URL}/restaurants/${restaurantId}/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.BOOKING_API_KEY}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.message || 'Ошибка получения статистики'}`);
      }

      const result = await response.json();

      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.error('Ошибка получения статистики бронирований:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Неизвестная ошибка'
      };
    }
  }

  /**
   * Проверка статуса API бронирований
   */
  static async checkApiStatus(): Promise<BookingApiResponse> {
    try {
      console.log('Проверка статуса API бронирований...');
      
      const response = await fetch(`${this.BOOKING_API_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: API недоступен`);
      }

      const result = await response.json();

      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.error('Ошибка проверки статуса API:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'API недоступен'
      };
    }
  }

  /**
   * Получение списка ресторанов из системы бронирований
   */
  static async getRestaurants(): Promise<BookingApiResponse> {
    try {
      console.log('Получение списка ресторанов из системы бронирований...');
      
      const response = await fetch(`${this.BOOKING_API_URL}/restaurants`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.message || 'Ошибка получения ресторанов'}`);
      }

      const result = await response.json();

      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.error('Ошибка получения ресторанов:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Неизвестная ошибка'
      };
    }
  }
}
