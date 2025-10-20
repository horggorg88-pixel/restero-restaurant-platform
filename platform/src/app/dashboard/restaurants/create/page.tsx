'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Building2, Upload } from 'lucide-react';

const CreateRestaurantPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    phone: '',
    email: '',
    website: ''
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Валидация
    if (!formData.name.trim() || !formData.address.trim()) {
      setError('Название и адрес обязательны');
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      // Создаем FormData для отправки файла
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('address', formData.address);
      submitData.append('description', formData.description);
      submitData.append('phone', formData.phone);
      submitData.append('email', formData.email);
      submitData.append('website', formData.website);
      
      if (photo) {
        submitData.append('photo', photo);
      }

      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/dashboard/restaurants');
      } else {
        setError(data.message || 'Ошибка создания ресторана');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-restero-gray-bg">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/dashboard/restaurants')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Назад</span>
            </Button>
            <h1 className="text-2xl font-bold text-restero-green">Создание ресторана</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <Building2 className="h-5 w-5 text-restero-green" />
                <span>Информация о ресторане</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="px-4 sm:px-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                {/* Фото ресторана */}
                <div className="space-y-2">
                  <Label htmlFor="photo">Фото ресторана</Label>
                  <div className="flex items-center space-x-4">
                    <input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="photo"
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Выбрать фото</span>
                    </label>
                    {photo && (
                      <span className="text-sm text-gray-600">
                        {photo.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Название */}
                <div className="space-y-2">
                  <Label htmlFor="name">Название ресторана *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Введите название ресторана"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Адрес */}
                <div className="space-y-2">
                  <Label htmlFor="address">Адрес *</Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Введите адрес ресторана"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Описание */}
                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Краткое описание ресторана"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                {/* Контактная информация */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+7 (999) 123-45-67"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="restaurant@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Веб-сайт */}
                <div className="space-y-2">
                  <Label htmlFor="website">Веб-сайт</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    placeholder="https://restaurant-website.com"
                    value={formData.website}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Кнопки */}
                <div className="flex space-x-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => router.push('/dashboard/restaurants')}
                    className="flex-1"
                  >
                    Отмена
                  </Button>
                  <Button 
                    type="submit" 
                    variant="restero"
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? 'Создание...' : 'Создать ресторан'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateRestaurantPage;
