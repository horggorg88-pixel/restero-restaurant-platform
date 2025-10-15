'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: "БАЗОВЫЙ",
      establishments: "от 1 до 10 заведений",
      price: "0 ₽",
      period: "7 дней бесплатно, далее – 7990₽ / мес",
      features: [
        "Управление бронированиями",
        "Базовая аналитика",
        "Техподдержка",
        "Мобильное приложение"
      ],
      popular: false
    },
    {
      name: "СТАНДАРТ", 
      establishments: "от 10 до 30 заведений",
      price: "6 990 ₽",
      period: "/ мес",
      features: [
        "Все функции Базового",
        "Расширенная аналитика",
        "Интеграции с POS",
        "Приоритетная поддержка",
        "Обучение персонала"
      ],
      popular: true
    },
    {
      name: "ПРЕМИУМ",
      establishments: "от 30 заведений", 
      price: "5 990 ₽",
      period: "/ мес",
      features: [
        "Все функции Стандарта",
        "Персональный менеджер",
        "Кастомные интеграции",
        "API доступ",
        "Белый лейбл"
      ],
      popular: false
    }
  ];

  return (
    <section id="pricing" className="relative bg-gradient-to-b from-gray-50 to-white py-24 overflow-hidden">
      {/* Фоновые элементы */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-restero-green opacity-3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-500 opacity-3 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-restero-green/10 rounded-full text-restero-green text-sm font-medium mb-6 animate-fade-in-up">
            <span className="w-2 h-2 bg-restero-green rounded-full mr-2 animate-pulse"></span>
            Гибкие тарифы
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 animate-fade-in-up delay-100">
            Стоимость подключения
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up delay-200">
            Выберите подходящий тариф для вашего бизнеса. Все планы включают бесплатный пробный период.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative hover-lift animate-scale-in ${plan.popular ? 'ring-2 ring-restero-green shadow-2xl scale-105' : 'shadow-lg'}`}
              style={{animationDelay: `${0.3 + index * 0.1}s`}}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-pulse-slow">
                  <div className="gradient-bg text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                    Популярный
                  </div>
                </div>
              )}
              
              <CardHeader className={`text-center ${plan.popular ? 'gradient-bg text-white' : 'bg-white'}`}>
                <CardTitle className={`text-xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  ТАРИФ «{plan.name}»
                </CardTitle>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <Check className={`h-4 w-4 ${plan.popular ? 'text-white' : 'text-restero-green'}`} />
                  <span className={`text-sm ${plan.popular ? 'text-white/90' : 'text-gray-600'}`}>{plan.establishments}</span>
                </div>
              </CardHeader>
              
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {plan.price}
                  </div>
                  <div className="text-sm text-gray-600">
                    {plan.period}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover-glow">
                      <Check className="h-5 w-5 text-restero-green flex-shrink-0" />
                      <span className="text-sm text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  variant={plan.popular ? "restero" : "outline"} 
                  className="w-full hover-lift hover-glow group"
                  size="lg"
                  onClick={() => {
                    // Демо-функция: показываем уведомление
                    alert(`Демо: Подключение тарифа "${plan.name}" будет доступно после регистрации!`);
                  }}
                >
                  Подключить
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16 animate-fade-in-up delay-500">
          <p className="text-lg text-gray-600 mb-6">
            Все тарифы включают бесплатный пробный период
          </p>
          <Button 
            variant="resteroOutline" 
            size="lg" 
            className="hover-lift hover-glow"
            onClick={() => {
              // Демо-функция: показываем уведомление
              alert('Демо: Свяжитесь с нами по email: support@restero.ru или телефону: +7 (800) 123-45-67');
            }}
          >
            Связаться с нами
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
