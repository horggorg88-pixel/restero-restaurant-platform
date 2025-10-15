'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Eye, Database, MousePointer, ArrowRight, Zap } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      icon: Phone,
      title: "Гости звонят в ресторан для бронирования столика",
      description: "Клиенты обращаются к вам по телефону или через сайт"
    },
    {
      number: "02", 
      icon: Eye,
      title: "Менеджер видит все брони и свободные столы в удобной панели",
      description: "Вся информация отображается в реальном времени"
    },
    {
      number: "03",
      icon: Database,
      title: "При бронировании сервис сам подтягивает данные гостя с его пожеланиями",
      description: "Автоматическое сохранение истории клиентов"
    },
    {
      number: "04",
      icon: MousePointer,
      title: "Вы управляете бронью в несколько кликов",
      description: "Простое и быстрое управление бронированиями"
    }
  ];

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-24 overflow-hidden">
      {/* Фоновые элементы */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-restero-green opacity-3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-blue-500 opacity-3 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-restero-green/10 rounded-full text-restero-green text-sm font-medium mb-6 animate-fade-in-up">
            <Zap className="w-4 h-4 mr-2" />
            Простой процесс
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 animate-fade-in-up delay-100">
            Мы оптимизируем процессы –
          </h2>
          <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2 animate-fade-in-up delay-200">
            чтобы вы сосредоточились
          </h3>
          <h3 className="text-4xl lg:text-5xl font-bold gradient-text animate-fade-in-up delay-300">
            на заботе о гостях
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Левая часть - демонстрация интерфейса */}
          <div className="relative animate-fade-in-left delay-200">
            <Card className="bg-white border-0 shadow-2xl hover-lift">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl font-semibold text-gray-900">Бронирование</h4>
                    <div className="w-3 h-3 bg-restero-green rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Форма бронирования */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Дата брони
                        </label>
                        <div className="bg-gray-50 p-3 rounded-lg border text-sm hover-glow">02.07.2025</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Старт брони
                        </label>
                        <div className="bg-gray-50 p-3 rounded-lg border text-sm hover-glow">13:45</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Кол-во часов
                        </label>
                        <div className="bg-gray-50 p-3 rounded-lg border text-sm hover-glow">02:00</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Число гостей
                        </label>
                        <div className="bg-gray-50 p-3 rounded-lg border text-sm hover-glow">1</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Зал
                        </label>
                        <div className="bg-gray-50 p-3 rounded-lg border text-sm hover-glow">Выбрать</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Номер стола
                        </label>
                        <div className="bg-gray-50 p-3 rounded-lg border text-sm hover-glow">Выбрать</div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Телефон гостя
                      </label>
                      <div className="bg-gray-50 p-3 rounded-lg border text-sm hover-glow">+79126450818</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ФИО гостя
                      </label>
                      <div className="bg-gray-50 p-3 rounded-lg border text-sm hover-glow">ФИО гостя</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Комментарий
                      </label>
                      <div className="bg-gray-50 p-3 rounded-lg border text-sm hover-glow">Нужен стульчик для ребенка</div>
                    </div>
                    
                    <button className="w-full gradient-bg text-white py-3 rounded-lg hover-glow transition-all duration-300 flex items-center justify-center group">
                      Сохранить
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Правая часть - шаги */}
          <div className="space-y-8 animate-fade-in-right delay-300">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg hover-lift animate-fade-in-up" style={{animationDelay: `${0.4 + index * 0.1}s`}}>
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 gradient-bg rounded-full flex items-center justify-center animate-pulse-slow">
                    <span className="text-white font-bold text-lg">{step.number}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <step.icon className="h-5 w-5 text-restero-green" />
                    <h4 className="text-lg font-semibold text-gray-900">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
