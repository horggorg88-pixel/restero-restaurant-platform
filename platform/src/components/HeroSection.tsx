'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, BarChart3, ArrowRight, Play } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-white via-gray-50 to-white py-24 overflow-hidden">
      {/* Фоновые элементы */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-restero-green opacity-5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 opacity-5 rounded-full blur-3xl animate-pulse-slow delay-500"></div>
      </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Левая часть - текст */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-restero-green/10 rounded-full text-restero-green text-sm font-medium animate-fade-in-up">
                <span className="w-2 h-2 bg-restero-green rounded-full mr-2 animate-pulse"></span>
                Новое поколение управления ресторанами
              </div>
              
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight animate-fade-in-up delay-100">
                      Система управления бронированиями столиков для{' '}
                      <span className="gradient-text">ресторанов</span>
                    </h1>
              
                    <p className="text-lg sm:text-xl text-gray-600 leading-relaxed animate-fade-in-up delay-200">
                      Следите за загрузкой в реальном времени, управляйте бронированиями легко и быстро. 
                      Увеличьте эффективность вашего ресторана на 40%.
                    </p>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-3 gap-6 animate-fade-in-up delay-300">
              <div className="text-center">
                <div className="text-3xl font-bold text-restero-green">98%</div>
                <div className="text-sm text-gray-600">Точность бронирований</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-restero-green">3.5K+</div>
                <div className="text-sm text-gray-600">Бронирований в день</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-restero-green">500+</div>
                <div className="text-sm text-gray-600">Довольных клиентов</div>
              </div>
            </div>

                  {/* CTA кнопки */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up delay-400">
                  <Button 
                    variant="restero" 
                    size="lg" 
                    className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg hover-lift hover-glow group w-full sm:w-auto"
                    onClick={() => window.location.href = '/auth/login'}
                  >
                Начать бесплатно
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg hover-lift group w-full sm:w-auto"
                      onClick={() => {
                        const functionsSection = document.getElementById('functions');
                        if (functionsSection) {
                          functionsSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Смотреть демо
              </Button>
            </div>
          </div>

          {/* Правая часть - визуализация */}
          <div className="relative animate-fade-in-right delay-200">
            {/* Основная карточка */}
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 hover-lift">
              <div className="bg-gradient-to-br from-restero-green to-blue-500 rounded-2xl p-8 h-96 flex items-center justify-center relative overflow-hidden">
                {/* Анимированные элементы */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                
                <div className="text-center space-y-6 relative z-10">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto animate-float">
                    <Calendar className="h-10 w-10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-white font-semibold text-lg">Демонстрация системы</p>
                    <p className="text-white/80 text-sm">Интерактивная панель управления</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Плавающие карточки */}
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-6 animate-fade-in-up delay-500 hover-lift">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-restero-green/10 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-restero-green" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">В реальном времени</div>
                  <div className="text-sm text-gray-600">Мгновенные обновления</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 animate-fade-in-up delay-600 hover-lift">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">3500+ бронирований</div>
                  <div className="text-sm text-gray-600">Ежедневно</div>
                </div>
              </div>
            </div>

            {/* Дополнительная карточка */}
            <div className="absolute top-1/2 -left-8 bg-white rounded-xl shadow-lg p-4 animate-fade-in-left delay-700 hover-lift">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">+40%</div>
                  <div className="text-xs text-gray-600">Эффективность</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
