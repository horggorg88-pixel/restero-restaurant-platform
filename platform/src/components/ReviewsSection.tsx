'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const ReviewsSection = () => {
  const reviews = [
    {
      name: "Анна Петрова",
      position: "Управляющая ресторана 'Белый кролик'",
      rating: 5,
      text: "Система кардинально изменила работу нашего ресторана. Теперь мы не теряем ни одного гостя, а персонал работает в разы эффективнее. Рекомендую всем коллегам!",
      avatar: "АП"
    },
    {
      name: "Михаил Соколов", 
      position: "Владелец сети 'Соколов'",
      rating: 5,
      text: "Управляю сетью из 5 ресторанов через одну систему. Это невероятно удобно! Все данные синхронизируются, персонал обучен за неделю. Окупилось за первый месяц.",
      avatar: "МС"
    },
    {
      name: "Елена Кузнецова",
      position: "Менеджер ресторана 'У Елены'",
      rating: 5,
      text: "Простой интерфейс, быстрая работа, отличная поддержка. Гости довольны скоростью обслуживания, а мы - отсутствием ошибок в бронированиях.",
      avatar: "ЕК"
    }
  ];

  return (
    <section id="reviews" className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Отзывы клиентов
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-6">
                {/* Иконка кавычек */}
                <div className="absolute -top-3 -left-3">
                  <div className="w-8 h-8 bg-restero-green rounded-full flex items-center justify-center">
                    <Quote className="h-4 w-4 text-white" />
                  </div>
                </div>

                {/* Рейтинг */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-restero-green text-restero-green" />
                  ))}
                </div>

                {/* Текст отзыва */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{review.text}"
                </p>

                {/* Автор */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-restero-green rounded-full flex items-center justify-center text-white font-semibold">
                    {review.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{review.name}</div>
                    <div className="text-sm text-gray-600">{review.position}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Дополнительная статистика */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-restero-green mb-2">4.9/5</div>
              <div className="text-gray-600">Средняя оценка клиентов</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-restero-green mb-2">98%</div>
              <div className="text-gray-600">Клиентов рекомендуют нас</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-restero-green mb-2">24/7</div>
              <div className="text-gray-600">Техническая поддержка</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
