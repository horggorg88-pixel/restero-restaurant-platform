'use client';

import React from 'react';

const TrustSection = () => {
  const logos = [
    "Белый кролик",
    "Соколов", 
    "У Елены",
    "Ресторан №1",
    "Гастрономия",
    "Вкусная еда",
    "Домашняя кухня",
    "Семейный ресторан"
  ];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Нам доверяют
          </h2>
        </div>

        {/* Логотипы клиентов */}
        <div className="overflow-hidden">
          <div className="flex space-x-8 animate-scroll">
            {[...logos, ...logos].map((logo, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 text-gray-400 text-lg font-light whitespace-nowrap"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="text-center mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-restero-green mb-2">500+</div>
              <div className="text-gray-600">Довольных клиентов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-restero-green mb-2">3 года</div>
              <div className="text-gray-600">На рынке</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-restero-green mb-2">99.9%</div>
              <div className="text-gray-600">Время работы</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
