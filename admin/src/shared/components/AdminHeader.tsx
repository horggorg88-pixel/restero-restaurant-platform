import React from 'react';
import { useLocation } from 'react-router-dom';
import { LINKS } from '@shared/router/links';
import BackToDashboard from './BackToDashboard';
import { Calendar, Database, BarChart3, Users, Settings } from 'lucide-react';

const AdminHeader: React.FC = () => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case LINKS.bookingList:
        return 'Список бронирований';
      case LINKS.gantt:
        return 'Планировщик';
      case LINKS.database:
        return 'База данных';
      case LINKS.popups:
        return 'Уведомления';
      case LINKS.tablesList:
        return 'Управление столами';
      default:
        return 'Панель управления';
    }
  };

  const getPageIcon = () => {
    switch (location.pathname) {
      case LINKS.bookingList:
        return <Calendar className="h-5 w-5" />;
      case LINKS.gantt:
        return <BarChart3 className="h-5 w-5" />;
      case LINKS.database:
        return <Database className="h-5 w-5" />;
      case LINKS.popups:
        return <Users className="h-5 w-5" />;
      case LINKS.tablesList:
        return <Settings className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Левая часть - навигация */}
          <div className="flex items-center space-x-4">
            <BackToDashboard />
            
            <div className="h-6 w-px bg-gray-300" />
            
            <div className="flex items-center space-x-2">
              {getPageIcon()}
              <h1 className="text-lg font-semibold text-gray-900">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Правая часть - информация */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Панель управления бронированиями
            </div>
            {localStorage.getItem("userRole") && (
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {localStorage.getItem("userRole") === 'admin' ? 'Администратор' : 'Менеджер'}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
