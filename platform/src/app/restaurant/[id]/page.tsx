'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Star, 
  Users, 
  Calendar,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import GuestBookingForm from '@/components/booking/GuestBookingForm';

interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  rating: number;
  photos: string[];
  cuisine: string;
  priceRange: string;
  capacity: number;
}

const RestaurantPage = () => {
  const params = useParams();
  const restaurantId = params.id as string;
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    fetchRestaurantData();
  }, [restaurantId]);

  const fetchRestaurantData = async () => {
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}`);
      const result = await response.json();
      
      if (result.success) {
        setRestaurant(result.data);
      } else {
        console.error('Ошибка API:', result.message);
        setRestaurant(null);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных ресторана:', error);
      setRestaurant(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-restero-green mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка информации о ресторане...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ресторан не найден</h1>
          <p className="text-gray-600 mb-6">К сожалению, ресторан с таким ID не существует.</p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Назад</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <span className="text-lg font-semibold text-gray-900">
                {restaurant.rating}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Section */}
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Фотографии */}
              <div className="space-y-4">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={restaurant.photos[0]} 
                    alt={restaurant.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {restaurant.photos.slice(1, 3).map((photo, index) => (
                    <div key={index} className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={photo} 
                        alt={`${restaurant.name} ${index + 2}`}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Информация */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {restaurant.name}
                  </h1>
                  <p className="text-lg text-gray-600 mb-4">
                    {restaurant.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{restaurant.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{restaurant.cuisine}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{restaurant.priceRange}</span>
                  </div>
                </div>

                {/* Контактная информация */}
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700">{restaurant.address}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-gray-500" />
                        <a 
                          href={`tel:${restaurant.phone}`}
                          className="text-restero-green hover:underline"
                        >
                          {restaurant.phone}
                        </a>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700">{restaurant.workingHours}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700">Вместимость: {restaurant.capacity} человек</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Кнопка бронирования */}
                <Button
                  onClick={() => setShowBookingForm(true)}
                  variant="restero"
                  size="lg"
                  className="w-full h-12 text-lg"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Забронировать стол
                </Button>
              </div>
            </div>
          </div>

          {/* Дополнительная информация */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Меню (заглушка) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ExternalLink className="h-5 w-5 text-restero-green" />
                  <span>Меню ресторана</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Ознакомьтесь с нашим меню и выберите понравившиеся блюда.
                </p>
                <Button variant="outline" className="w-full">
                  Посмотреть меню
                </Button>
              </CardContent>
            </Card>

            {/* Отзывы (заглушка) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>Отзывы клиентов</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">4.8 из 5</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    "Отличный ресторан с вкусной едой и приятной атмосферой!"
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Форма бронирования */}
      {showBookingForm && (
        <GuestBookingForm
          restaurant={restaurant}
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </div>
  );
};

export default RestaurantPage;
