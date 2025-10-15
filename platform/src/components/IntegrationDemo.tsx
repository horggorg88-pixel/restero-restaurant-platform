'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Calendar, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Clock,
  Smartphone,
  Monitor,
  Globe
} from 'lucide-react';

interface IntegrationDemoProps {
  restaurantId?: string;
}

const IntegrationDemo: React.FC<IntegrationDemoProps> = ({ restaurantId }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const steps = [
    {
      id: 1,
      title: "Клиент заходит на сайт ресторана",
      description: "Клиент видит красивый сайт ресторана с информацией о меню, атмосфере и возможности бронирования",
      icon: Globe,
      color: "bg-blue-100 text-blue-600",
      details: [
        "Современный дизайн сайта",
        "Информация о ресторане",
        "Кнопка 'Забронировать стол'",
        "Мобильная версия"
      ]
    },
    {
      id: 2,
      title: "Выбор даты и времени",
      description: "Клиент выбирает удобную дату и время для посещения ресторана",
      icon: Calendar,
      color: "bg-green-100 text-green-600",
      details: [
        "Календарь с доступными датами",
        "Выбор времени",
        "Количество гостей",
        "Предпочтения по столу"
      ]
    },
    {
      id: 3,
      title: "Автоматический поиск столов",
      description: "Система автоматически находит подходящие столы в реальном времени",
      icon: Building2,
      color: "bg-purple-100 text-purple-600",
      details: [
        "Проверка доступности",
        "Учет предпочтений",
        "Оптимальный подбор",
        "Мгновенный результат"
      ]
    },
    {
      id: 4,
      title: "Подтверждение бронирования",
      description: "Клиент получает подтверждение бронирования с деталями",
      icon: CheckCircle,
      color: "bg-emerald-100 text-emerald-600",
      details: [
        "Номер бронирования",
        "Детали стола",
        "Контактная информация",
        "Напоминания"
      ]
    },
    {
      id: 5,
      title: "Уведомления и напоминания",
      description: "Клиент получает уведомления о бронировании и напоминания",
      icon: Smartphone,
      color: "bg-orange-100 text-orange-600",
      details: [
        "SMS уведомления",
        "Email подтверждения",
        "Напоминания за день",
        "Мобильные push-уведомления"
      ]
    }
  ];

  const platforms = [
    {
      name: "Сайт ресторана",
      icon: Globe,
      description: "Красивый сайт с возможностью бронирования",
      color: "bg-blue-50 border-blue-200"
    },
    {
      name: "Мобильное приложение",
      icon: Smartphone,
      description: "Удобное приложение для бронирования",
      color: "bg-green-50 border-green-200"
    },
    {
      name: "Админ-панель",
      icon: Monitor,
      description: "Управление бронированиями для персонала",
      color: "bg-purple-50 border-purple-200"
    }
  ];

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % steps.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isActive, steps.length]);

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Как работает интеграция для клиентов
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Клиенты видят современный интерфейс бронирования, а за кулисами работает 
          мощная система управления рестораном
        </p>
      </div>

      {/* Платформы */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {platforms.map((platform, index) => (
          <Card key={index} className={`${platform.color} hover-lift`}>
            <CardContent className="p-6 text-center">
              <platform.icon className="h-12 w-12 mx-auto mb-4 text-gray-700" />
              <h3 className="text-xl font-semibold mb-2">{platform.name}</h3>
              <p className="text-gray-600">{platform.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Интерактивная демонстрация */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Интерактивная демонстрация процесса бронирования</span>
            <Button
              onClick={() => setIsActive(!isActive)}
              variant={isActive ? "destructive" : "default"}
              size="sm"
            >
              {isActive ? "Остановить" : "Запустить"} демо
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Прогресс-бар */}
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index <= currentStep
                        ? 'bg-restero-green text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{step.id}</span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        index < currentStep ? 'bg-restero-green' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Текущий шаг */}
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${steps[currentStep].color} mb-6`}>
                {React.createElement(steps[currentStep].icon, { className: "h-10 w-10" })}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {steps[currentStep].title}
              </h3>
              
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                {steps[currentStep].description}
              </p>

              {/* Детали шага */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {steps[currentStep].details.map((detail, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Преимущества интеграции */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-blue-600" />
              <span>Для клиентов</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Быстрое и удобное бронирование</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Мгновенное подтверждение</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Автоматические напоминания</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Работает на всех устройствах</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-purple-600" />
              <span>Для ресторана</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Автоматическое управление столами</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Снижение ошибок в бронированиях</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Увеличение загрузки ресторана</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Аналитика и отчеты</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Статус интеграции */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-green-600" />
            <span>Статус интеграции</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 mb-2">
                <CheckCircle className="h-4 w-4 mr-1" />
                Система бронирований
              </div>
              <p className="text-sm text-gray-600">Подключена и работает</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 mb-2">
                <Building2 className="h-4 w-4 mr-1" />
                2 ресторана
              </div>
              <p className="text-sm text-gray-600">В системе бронирований</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 mb-2">
                <ArrowRight className="h-4 w-4 mr-1" />
                Синхронизация
              </div>
              <p className="text-sm text-gray-600">В реальном времени</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationDemo;
