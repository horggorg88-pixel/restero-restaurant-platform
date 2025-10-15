import { NextRequest, NextResponse } from 'next/server';

interface GuestBookingData {
  restaurantId: string;
  date: string;
  time: string;
  duration: string;
  guests: number;
  name: string;
  phone: string;
  email: string;
  comment?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GuestBookingData = await request.json();
    console.log('Received booking data:', body);
    
    // Валидация данных
    const requiredFields = ['restaurantId', 'date', 'time', 'guests', 'name', 'phone', 'email'];
    const missingFields = requiredFields.filter(field => !body[field as keyof GuestBookingData]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Отсутствуют обязательные поля: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, message: 'Некорректный email' },
        { status: 400 }
      );
    }

    // Валидация телефона
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(body.phone)) {
      return NextResponse.json(
        { success: false, message: 'Некорректный номер телефона' },
        { status: 400 }
      );
    }

    // Валидация даты (не может быть в прошлом)
    const bookingDate = new Date(body.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      return NextResponse.json(
        { success: false, message: 'Дата бронирования не может быть в прошлом' },
        { status: 400 }
      );
    }

    // Валидация времени
    const [hours, minutes] = body.time.split(':').map(Number);
    const bookingDateTime = new Date(body.date);
    bookingDateTime.setHours(hours, minutes, 0, 0);
    
    if (bookingDateTime < new Date()) {
      return NextResponse.json(
        { success: false, message: 'Время бронирования не может быть в прошлом' },
        { status: 400 }
      );
    }

    // Валидация количества гостей
    if (body.guests < 1 || body.guests > 20) {
      return NextResponse.json(
        { success: false, message: 'Количество гостей должно быть от 1 до 20' },
        { status: 400 }
      );
    }

    // Здесь будет интеграция с реальным API бронирований
    // Пока симулируем создание бронирования
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const booking = {
      id: bookingId,
      restaurantId: body.restaurantId,
      date: body.date,
      time: body.time,
      duration: body.duration,
      guests: body.guests,
      clientName: body.name,
      clientPhone: body.phone,
      clientEmail: body.email,
      comment: body.comment || '',
      status: 'pending', // pending, confirmed, cancelled
      createdAt: new Date().toISOString(),
      // Дополнительные поля для интеграции с существующим API
      booking_time_from: body.time,
      booking_time_to: calculateEndTime(body.time, body.duration),
      count_people: body.guests.toString(),
      client_name: body.name,
      client_phone: body.phone
    };

    // В реальном приложении здесь будет:
    // 1. Отправка данных в существующий API бронирований
    // 2. Уведомление администратора ресторана
    // 3. Отправка подтверждения клиенту
    
    console.log('Создано бронирование:', booking);

    return NextResponse.json({
      success: true,
      message: 'Бронирование успешно создано',
      data: {
        bookingId: booking.id,
        status: 'pending',
        confirmationCode: `RES${bookingId.slice(-6).toUpperCase()}`
      }
    });

  } catch (error) {
    console.error('Ошибка создания бронирования:', error);
    return NextResponse.json(
      { success: false, message: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

// Вспомогательная функция для расчета времени окончания
function calculateEndTime(startTime: string, duration: string): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const durationHours = parseInt(duration);
  
  const endMinutes = minutes + (durationHours * 60);
  const endHours = hours + Math.floor(endMinutes / 60);
  const finalMinutes = endMinutes % 60;
  
  return `${endHours.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;
}
