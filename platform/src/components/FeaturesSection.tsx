'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Users, 
  Combine, 
  Settings, 
  Shield, 
  Database, 
  BarChart3,
  Search,
  Plus,
  ArrowRight
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Calendar,
      title: "Визуализация всех броней по всем столам и залам в разрезе",
      description: "Видите всю картину загрузки на одном экране без переключений"
    },
    {
      icon: Users,
      title: "Мгновенный подбор столика по пожеланиям гостей",
      description: "Система автоматически предлагает лучшие варианты"
    },
    {
      icon: Combine,
      title: "Объединение столов одним кликом",
      description: "Легко создавайте большие столы для групп"
    },
    {
      icon: Settings,
      title: "Управление несколькими ресторанами из одного аккаунта",
      description: "Централизованное управление всей сетью"
    },
    {
      icon: Shield,
      title: "Гибкие настройки доступа для сотрудников",
      description: "Контролируйте, кто и что может делать в системе"
    },
    {
      icon: Database,
      title: "Общая база гостей и бронирований для всей сети",
      description: "Единая CRM для всех ваших заведений"
    },
    {
      icon: BarChart3,
      title: "Простая аналитика по загрузке и эффективности",
      description: "Отчеты и статистика для принятия решений"
    }
  ];

  return (
    <section id="functions" className="relative bg-gradient-to-b from-white to-gray-50 py-24 overflow-hidden">
      {/* Фоновые элементы */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-restero-green opacity-3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500 opacity-3 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Левая часть - функции */}
          <div className="space-y-8 animate-fade-in-left delay-200">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-restero-green/10 rounded-full text-restero-green text-sm font-medium mb-6 animate-fade-in-up">
                <span className="w-2 h-2 bg-restero-green rounded-full mr-2 animate-pulse"></span>
                Мощные возможности
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 animate-fade-in-up delay-100">
                Ключевые функции
              </h2>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg hover-lift animate-fade-in-up" style={{animationDelay: `${0.3 + index * 0.1}s`}}>
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 gradient-bg rounded-xl flex items-center justify-center animate-pulse-slow">
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 animate-fade-in-up delay-500">
              <Button 
                variant="restero" 
                size="lg" 
                className="px-8 hover-lift hover-glow group"
                onClick={() => window.location.href = '/auth/login'}
              >
                Зарегистрироваться
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Правая часть - демонстрация интерфейса */}
          <div className="relative animate-fade-in-right delay-300">
            <Card className="bg-white border-0 shadow-2xl hover-lift">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="space-y-4 sm:space-y-6">
                        {/* Поиск и кнопка добавления */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                          <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input 
                              type="text" 
                              placeholder="Поиск по номеру телефона"
                              className="w-full pl-10 pr-4 py-2 sm:py-3 border rounded-lg bg-gray-50 hover-glow focus:outline-none focus:ring-2 focus:ring-restero-green/20 text-sm sm:text-base"
                            />
                          </div>
                          <Button 
                            variant="restero" 
                            size="sm" 
                            className="hover-glow w-full sm:w-auto"
                            onClick={() => {
                              // Демо-функция: показываем уведомление
                              alert('Демо: Функция резервирования стола будет доступна после регистрации!');
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Зарезервировать стол</span>
                            <span className="sm:hidden">Зарезервировать</span>
                          </Button>
                        </div>

                  {/* Временная шкала */}
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-6">
                    <div className="flex space-x-1 sm:space-x-2 mb-4 sm:mb-6 overflow-x-auto">
                      {['20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'].map((time, index) => (
                        <div key={index} className="text-xs text-gray-600 min-w-8 sm:min-w-12 text-center font-medium flex-shrink-0">
                          {time}
                        </div>
                      ))}
                    </div>

                    {/* Столы и бронирования */}
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-12 sm:w-16 text-xs sm:text-sm text-gray-700 font-medium flex-shrink-0">Стол 1</div>
                        <div className="flex-1 h-8 sm:h-10 bg-gray-100 rounded-lg relative overflow-hidden min-w-0">
                          <div className="absolute left-1/4 w-1/2 h-full gradient-bg rounded-lg flex items-center justify-center animate-pulse-slow">
                            <span className="text-xs text-white font-medium hidden sm:block">20:30-22:30</span>
                            <span className="text-xs text-white font-medium sm:hidden">20:30</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-12 sm:w-16 text-xs sm:text-sm text-gray-700 font-medium flex-shrink-0">Стол 2</div>
                        <div className="flex-1 h-8 sm:h-10 bg-gray-100 rounded-lg relative overflow-hidden min-w-0">
                          <div className="absolute left-1/3 w-1/3 h-full gradient-bg rounded-lg flex items-center justify-center animate-pulse-slow">
                            <span className="text-xs text-white font-medium hidden sm:block">21:00-22:00</span>
                            <span className="text-xs text-white font-medium sm:hidden">21:00</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-12 sm:w-16 text-xs sm:text-sm text-gray-700 font-medium flex-shrink-0">Стол 3</div>
                        <div className="flex-1 h-10 bg-gray-100 rounded-lg"></div>
                      </div>
                    </div>

                    {/* Детали бронирования */}
                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white border rounded-xl shadow-sm hover-lift">
                      <div className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">20:30 - 22:30</div>
                      <div className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Сергей *5892</div>
                      <div className="text-xs sm:text-sm text-gray-600">КС хотят поближе к бару</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Слоган */}
        <div className="text-center mt-20 animate-fade-in-up delay-600">
          <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-relaxed">
            Когда в ресторане всё под контролем —{' '}
            <span className="gradient-text">гости чувствуют это с порога</span>
          </h3>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
