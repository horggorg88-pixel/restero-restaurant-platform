'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, Clock, CheckCircle, Star, Award, Zap } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="relative bg-gradient-to-b from-white to-gray-50 py-24 overflow-hidden">
      {/* Фоновые элементы */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-restero-green opacity-3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500 opacity-3 rounded-full blur-3xl"></div>
      </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-restero-green/10 rounded-full text-restero-green text-sm font-medium mb-6 animate-fade-in-up">
            <Award className="w-4 h-4 mr-2" />
            Проверенное решение
          </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 animate-fade-in-up delay-100">
                  О системе
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up delay-200">
            Современная платформа для управления ресторанами, которая уже помогает сотням заведений 
            повысить эффективность и увеличить доходы
          </p>
        </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Левая часть - статистика */}
          <div className="space-y-8">
            {/* Главная статистика */}
            <Card className="gradient-bg border-0 hover-lift animate-scale-in">
              <CardContent className="p-10 text-center text-white">
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-6xl font-bold animate-pulse-slow">
                    3 500+
                  </div>
                  <div className="text-xl opacity-90">
                    успешных бронирований каждый день
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Дополнительная статистика */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center p-8 hover-lift animate-fade-in-up delay-300">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-restero-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-6 w-6 text-restero-green" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">98%</div>
                  <div className="text-sm text-gray-600">точность бронирований</div>
                </CardContent>
              </Card>
              
              <Card className="text-center p-8 hover-lift animate-fade-in-up delay-400">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
                  <div className="text-sm text-gray-600">довольных клиентов</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Правая часть - описание */}
          <div className="space-y-8 animate-fade-in-right delay-200">
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Мы создали систему бронирования столиков, которая помогает ресторанам управлять загрузкой зала легко и прозрачно.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                Наша цель — избавить менеджеров от хаоса в блокнотах, ошибок в записях и потери гостей.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                Платформа позволяет в реальном времени видеть загрузку дня, моментально находить забронированный столик в интерфейсе, доступном с любого устройства.
              </p>
            </div>

            {/* Преимущества */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ключевые преимущества:</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-white rounded-xl hover-lift">
                  <div className="w-10 h-10 bg-restero-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-restero-green" />
                  </div>
                  <span className="text-gray-700 font-medium">Простой и интуитивный интерфейс</span>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white rounded-xl hover-lift">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  </div>
                  <span className="text-gray-700 font-medium">Работает на всех устройствах</span>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white rounded-xl hover-lift">
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <span className="text-gray-700 font-medium">Обновления в реальном времени</span>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white rounded-xl hover-lift">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-purple-500" />
                  </div>
                  <span className="text-gray-700 font-medium">Техническая поддержка 24/7</span>
                </div>
              </div>
            </div>

            {/* Дополнительная информация */}
            <div className="bg-gradient-to-r from-restero-green/5 to-blue-500/5 rounded-2xl p-6 animate-fade-in-up delay-500">
              <div className="flex items-center space-x-3 mb-3">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold text-gray-900">Рейтинг клиентов</span>
              </div>
              <p className="text-gray-600 text-sm">
                Наши клиенты оценивают систему на 4.9/5 звезд и рекомендуют её коллегам в 98% случаев
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
