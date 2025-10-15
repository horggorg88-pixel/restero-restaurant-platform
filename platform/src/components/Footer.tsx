'use client';

import React from 'react';
import { Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          {/* Логотип и навигация */}
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
            <h2 className="text-2xl font-bold text-gray-600">Restero</h2>
            
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
              <a href="#about" className="text-gray-600 hover:text-restero-green transition-colors">
                О проекте
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-restero-green transition-colors">
                Тарифы
              </a>
              <a href="#reviews" className="text-gray-600 hover:text-restero-green transition-colors">
                Отзывы
              </a>
              <a href="#contacts" className="text-gray-600 hover:text-restero-green transition-colors">
                Контакты
              </a>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
              <a href="#privacy" className="text-gray-600 hover:text-restero-green transition-colors">
                Политика конфиденциальности
              </a>
              <a href="#terms" className="text-gray-600 hover:text-restero-green transition-colors">
                Пользовательское соглашение
              </a>
            </div>
          </div>

          {/* Контактная информация */}
          <div className="flex flex-col space-y-2 mt-4 md:mt-0">
            <div className="flex items-center space-x-2 text-gray-600">
              <Phone className="h-4 w-4" />
              <span>+7 (000) 000-00-00</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="h-4 w-4" />
              <span>restoran@yandex.ru</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
