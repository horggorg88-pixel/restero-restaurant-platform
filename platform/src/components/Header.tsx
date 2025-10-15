'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm relative">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Логотип */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-restero-dark">Restero</h1>
          </div>

          {/* Навигация для десктопа */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/restaurants" className="text-gray-700 hover:text-restero-green transition-colors">
              Рестораны
            </a>
            <a href="#about" className="text-gray-700 hover:text-restero-green transition-colors">
              О системе
            </a>
            <a href="#functions" className="text-gray-700 hover:text-restero-green transition-colors">
              Функции
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-restero-green transition-colors">
              Тарифы
            </a>
            <a href="#contacts" className="text-gray-700 hover:text-restero-green transition-colors">
              Контакты
            </a>
          </nav>

          {/* Кнопки действий */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-gray-700 hover:text-restero-green"
              onClick={() => window.location.href = '/auth/login'}
            >
              Войти
            </Button>
            <Button 
              variant="restero" 
              className="px-6"
              onClick={() => window.location.href = '/auth/login'}
            >
              Зарегистрироваться
            </Button>
          </div>

          {/* Мобильное меню */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Мобильное выпадающее меню */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t z-50">
            <div className="px-4 py-6 space-y-4">
              {/* Навигационные ссылки */}
              <nav className="space-y-4">
                <a
                  href="/restaurants"
                  className="block w-full text-left text-gray-700 hover:text-restero-green transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Рестораны
                </a>
                <button
                  onClick={() => scrollToSection('about')}
                  className="block w-full text-left text-gray-700 hover:text-restero-green transition-colors py-2"
                >
                  О системе
                </button>
                <button
                  onClick={() => scrollToSection('functions')}
                  className="block w-full text-left text-gray-700 hover:text-restero-green transition-colors py-2"
                >
                  Функции
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="block w-full text-left text-gray-700 hover:text-restero-green transition-colors py-2"
                >
                  Тарифы
                </button>
                <button
                  onClick={() => scrollToSection('contacts')}
                  className="block w-full text-left text-gray-700 hover:text-restero-green transition-colors py-2"
                >
                  Контакты
                </button>
              </nav>

              {/* Кнопки действий */}
              <div className="pt-4 border-t space-y-3">
                <Button 
                  variant="ghost" 
                  className="w-full text-gray-700 hover:text-restero-green"
                  onClick={() => {
                    window.location.href = '/auth/login';
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Войти
                </Button>
                <Button 
                  variant="restero" 
                  className="w-full"
                  onClick={() => {
                    window.location.href = '/auth/login';
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Зарегистрироваться
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
