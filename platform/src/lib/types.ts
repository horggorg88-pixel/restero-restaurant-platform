// TypeScript интерфейсы для всех сущностей в Redis

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface Restaurant {
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
  apiKey?: string;
}

export interface Network {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  restaurantIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Access {
  id: string;
  userId: string;
  restaurantId: string;
  email: string;
  password: string;
  phone?: string;
  role: 'admin' | 'manager';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  activatedAt?: string;
}

export interface Booking {
  id: string;
  restaurantId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  time: string;
  guests: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  restaurantId?: string;
  networkId?: string;
  amount: number;
  currency: string;
  type: 'RESTAURANT' | 'NETWORK' | 'SUBSCRIPTION';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  totalRestaurants: number;
  activeRestaurants: number;
  totalBookings: number;
  activeBookings: number;
  todayBookings: number;
  totalRevenue: number;
  monthlyRevenue: number;
  topRestaurants: Array<{
    id: string;
    name: string;
    bookings: number;
    revenue: number;
  }>;
  bookingsByMonth: Array<{
    month: string;
    count: number;
  }>;
  bookingsByDay: Array<{
    day: string;
    count: number;
  }>;
}

// Вспомогательные типы
export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CreateRestaurantData {
  name: string;
  address: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  photo?: string;
  ownerId: string;
}

export interface CreateNetworkData {
  name: string;
  description?: string;
  ownerId: string;
  restaurantIds: string[];
}

export interface CreateAccessData {
  userId: string;
  restaurantId: string;
  email: string;
  password: string;
  phone?: string;
  role: 'admin' | 'manager';
}

export interface CreateBookingData {
  restaurantId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
}

export interface CreatePaymentData {
  userId: string;
  restaurantId?: string;
  networkId?: string;
  amount: number;
  currency: string;
  type: 'RESTAURANT' | 'NETWORK' | 'SUBSCRIPTION';
  paymentMethod: string;
}
