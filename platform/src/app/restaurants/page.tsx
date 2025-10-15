'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Users,
  Filter,
  Grid,
  List
} from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  workingHours: string;
  rating: number;
  photos: string[];
  cuisine: string;
  priceRange: string;
  capacity: number;
  isOpen: boolean;
}

const RestaurantsPage = () => {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const cuisines = ['Все', 'Китайская', 'Итальянская', 'Японская', 'Русская', 'Французская'];
  const priceRanges = ['Все', '$', '$$', '$$$', '$$$$'];

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    filterRestaurants();
  }, [restaurants, searchQuery, selectedCuisine, selectedPriceRange]);

  const fetchRestaurants = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCuisine) params.append('cuisine', selectedCuisine);
      if (selectedPriceRange) params.append('priceRange', selectedPriceRange);
      
      const response = await fetch(`/api/restaurants/public?${params.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setRestaurants(result.data);
      } else {
        console.error('Ошибка API:', result.message);
        setRestaurants([]);
      }
    } catch (error) {
      console.error('Ошибка загрузки ресторанов:', error);
      setRestaurants([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRestaurants = () => {
    let filtered = restaurants;

    // Поиск по названию
    if (searchQuery) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Фильтр по кухне
    if (selectedCuisine && selectedCuisine !== 'Все') {
      filtered = filtered.filter(restaurant => restaurant.cuisine === selectedCuisine);
    }

    // Фильтр по ценовому диапазону
    if (selectedPriceRange && selectedPriceRange !== 'Все') {
      filtered = filtered.filter(restaurant => restaurant.priceRange === selectedPriceRange);
    }

    setFilteredRestaurants(filtered);
  };

  const handleRestaurantClick = (restaurantId: string) => {
    router.push(`/restaurant/${restaurantId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-restero-green mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка ресторанов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Рестораны
            </h1>
            <p className="text-gray-600">
              Найдите идеальный ресторан для вашего вечера
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Поиск и фильтры */}
          <div className="mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  
                  {/* Поиск */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Поиск по названию, описанию или кухне..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Фильтры */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Кухня */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Кухня
                      </label>
                      <select
                        value={selectedCuisine}
                        onChange={(e) => setSelectedCuisine(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restero-green"
                      >
                        {cuisines.map(cuisine => (
                          <option key={cuisine} value={cuisine === 'Все' ? '' : cuisine}>
                            {cuisine}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Ценовой диапазон */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ценовой диапазон
                      </label>
                      <select
                        value={selectedPriceRange}
                        onChange={(e) => setSelectedPriceRange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restero-green"
                      >
                        {priceRanges.map(range => (
                          <option key={range} value={range === 'Все' ? '' : range}>
                            {range}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Режим просмотра */}
                    <div className="flex items-end">
                      <div className="flex space-x-2">
                        <Button
                          variant={viewMode === 'grid' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('grid')}
                        >
                          <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('list')}
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Результаты */}
          <div className="mb-4">
            <p className="text-gray-600">
              Найдено ресторанов: <span className="font-semibold">{filteredRestaurants.length}</span>
            </p>
          </div>

          {/* Список ресторанов */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <Card 
                  key={restaurant.id} 
                  className="hover-lift cursor-pointer"
                  onClick={() => handleRestaurantClick(restaurant.id)}
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg overflow-hidden">
                    <img 
                      src={restaurant.photos[0]} 
                      alt={restaurant.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                          {restaurant.name}
                        </h3>
                        <div className="flex items-center space-x-1 ml-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{restaurant.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {restaurant.description}
                      </p>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{restaurant.address}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-500">{restaurant.cuisine}</span>
                          <span className="text-gray-500">{restaurant.priceRange}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span className={restaurant.isOpen ? 'text-green-600' : 'text-red-600'}>
                            {restaurant.isOpen ? 'Открыто' : 'Закрыто'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRestaurants.map((restaurant) => (
                <Card 
                  key={restaurant.id} 
                  className="hover-lift cursor-pointer"
                  onClick={() => handleRestaurantClick(restaurant.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex space-x-4">
                      <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={restaurant.photos[0]} 
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {restaurant.name}
                          </h3>
                          <div className="flex items-center space-x-1 ml-2">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{restaurant.rating}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {restaurant.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{restaurant.address}</span>
                            </div>
                            <span>{restaurant.cuisine}</span>
                            <span>{restaurant.priceRange}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span className={restaurant.isOpen ? 'text-green-600' : 'text-red-600'}>
                              {restaurant.isOpen ? 'Открыто' : 'Закрыто'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Пустое состояние */}
          {filteredRestaurants.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Рестораны не найдены
                </h3>
                <p className="text-gray-600 mb-4">
                  Попробуйте изменить параметры поиска или фильтры
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCuisine('');
                    setSelectedPriceRange('');
                  }}
                >
                  Сбросить фильтры
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default RestaurantsPage;
