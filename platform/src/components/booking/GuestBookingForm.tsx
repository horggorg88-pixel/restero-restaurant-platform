'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  Clock, 
  Users, 
  Phone, 
  User, 
  X,
  CheckCircle
} from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  capacity: number;
}

interface GuestBookingFormProps {
  restaurant: Restaurant;
  onClose: () => void;
}

interface BookingData {
  date: string;
  time: string;
  duration: string;
  guests: number;
  name: string;
  phone: string;
  email: string;
  comment: string;
}

interface BookingErrors {
  date?: string;
  time?: string;
  duration?: string;
  guests?: string;
  name?: string;
  phone?: string;
  email?: string;
  comment?: string;
}

const GuestBookingForm: React.FC<GuestBookingFormProps> = ({
  restaurant,
  onClose
}) => {
  const [bookingData, setBookingData] = useState<BookingData>({
    date: '',
    time: '',
    duration: '2',
    guests: 2,
    name: '',
    phone: '',
    email: '',
    comment: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<BookingErrors>({});

  // Устанавливаем сегодняшнюю дату по умолчанию
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setBookingData(prev => ({ ...prev, date: today }));
  }, []);

  const validateForm = (): boolean => {
    const newErrors: BookingErrors = {};

    if (!bookingData.date) newErrors.date = 'Выберите дату';
    if (!bookingData.time) newErrors.time = 'Выберите время';
    if (!bookingData.name.trim()) newErrors.name = 'Введите ваше имя';
    if (!bookingData.phone.trim()) newErrors.phone = 'Введите номер телефона';
    if (!bookingData.email.trim()) newErrors.email = 'Введите email';
    if (bookingData.guests < 1) newErrors.guests = 'Количество гостей должно быть больше 0';
    if (bookingData.guests > restaurant.capacity) newErrors.guests = `Максимум ${restaurant.capacity} гостей`;

    // Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (bookingData.email && !emailRegex.test(bookingData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    // Проверка формата телефона
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (bookingData.phone && !phoneRegex.test(bookingData.phone)) {
      newErrors.phone = 'Введите корректный номер телефона';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/bookings/guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantId: restaurant.id,
          date: bookingData.date,
          time: bookingData.time,
          duration: bookingData.duration,
          guests: bookingData.guests,
          name: bookingData.name,
          phone: bookingData.phone,
          email: bookingData.email,
          comment: bookingData.comment
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        
        // Автоматически закрываем форму через 3 секунды
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        alert(result.message || 'Произошла ошибка при создании бронирования');
      }

    } catch (error) {
      console.error('Ошибка при создании бронирования:', error);
      alert('Произошла ошибка при создании бронирования. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof BookingData, value: string | number) => {
    const processedValue = field === 'guests' ? Number(value) : value;
    setBookingData(prev => ({ ...prev, [field]: processedValue }));
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Бронирование подтверждено!
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Ваше бронирование в ресторане <strong>{restaurant.name}</strong> успешно создано.
            </p>
            <p className="text-sm text-gray-500">
              Мы свяжемся с вами для подтверждения деталей.
            </p>
            <Button onClick={onClose} className="w-full">
              Закрыть
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <Calendar className="h-6 w-6 text-restero-green" />
            <span>Бронирование столика</span>
          </DialogTitle>
          <p className="text-gray-600">
            Забронируйте столик в ресторане <strong>{restaurant.name}</strong>
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Дата и время */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Дата бронирования *</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={bookingData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={errors.date ? 'border-red-500' : ''}
              />
              {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Время *</span>
              </Label>
              <Input
                id="time"
                type="time"
                value={bookingData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className={errors.time ? 'border-red-500' : ''}
              />
              {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}
            </div>
          </div>

          {/* Продолжительность и количество гостей */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Продолжительность (часы)</Label>
              <select
                id="duration"
                value={bookingData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restero-green"
              >
                <option value="1">1 час</option>
                <option value="2">2 часа</option>
                <option value="3">3 часа</option>
                <option value="4">4 часа</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guests" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Количество гостей *</span>
              </Label>
              <Input
                id="guests"
                type="number"
                min="1"
                max={restaurant.capacity}
                value={bookingData.guests}
                onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                className={errors.guests ? 'border-red-500' : ''}
              />
              {errors.guests && <p className="text-red-500 text-sm">{errors.guests}</p>}
            </div>
          </div>

          {/* Контактная информация */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Контактная информация</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Ваше имя *</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Иван Иванов"
                  value={bookingData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Телефон *</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  value={bookingData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="ivan@example.com"
                value={bookingData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Комментарий к бронированию</Label>
              <Textarea
                id="comment"
                placeholder="Особые пожелания, празднование дня рождения, детский стульчик..."
                value={bookingData.comment}
                onChange={(e) => handleInputChange('comment', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="restero"
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Создание бронирования...
                </>
              ) : (
                'Забронировать стол'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GuestBookingForm;
