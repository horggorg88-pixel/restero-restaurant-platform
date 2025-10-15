'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="bg-restero-gray-bg py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            {/* Заголовок */}
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Начните с бесплатной недели — без рисков
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Оцените возможности платформы и убедитесь в её эффективности для вашего заведения
              </p>
            </div>

            {/* Преимущества пробного периода */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-restero-green flex-shrink-0" />
                <span className="text-gray-700">Полный доступ ко всем функциям</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-restero-green flex-shrink-0" />
                <span className="text-gray-700">Персональное обучение</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-restero-green flex-shrink-0" />
                <span className="text-gray-700">Техническая поддержка</span>
              </div>
            </div>

            {/* CTA кнопка */}
            <div className="pt-4">
              <Button 
                variant="restero" 
                size="lg" 
                className="px-12 py-4 text-lg"
                onClick={() => window.location.href = '/auth/login'}
              >
                Зарегистрироваться
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Дополнительная информация */}
            <div className="text-sm text-gray-500">
              <p>Без обязательств • Отмена в любое время • Настройка за 15 минут</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
