'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Plus, 
  Mail, 
  Shield, 
  Phone,
  UserCheck, 
  ArrowLeft,
  Trash2
} from 'lucide-react';
import { ROLES, ROLE_DESCRIPTIONS } from '@/lib/types/roles';

interface Access {
  id: string;
  userId: string;
  restaurantId: string;
  email: string;
  role: 'admin' | 'manager';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  activatedAt?: string;
}

interface Restaurant {
  id: string;
  name: string;
  address: string;
}

const RestaurantAccessesPage = () => {
  const router = useRouter();
  const params = useParams();
  const restaurantId = params.id as string;
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [accesses, setAccesses] = useState<Access[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [newAccess, setNewAccess] = useState({
    email: '',
    password: '',
    phone: '',
    role: 'manager' as 'admin' | 'manager'
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchRestaurantData(token);
    fetchAccesses(token);
  }, [router, restaurantId]);

  const fetchRestaurantData = async (token: string) => {
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRestaurant(data);
      }
    } catch (error) {
      console.error('Ошибка получения данных ресторана:', error);
    }
  };

  const fetchAccesses = async (token: string) => {
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/accesses`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAccesses(data);
      } else {
        const error = await response.json();
        setError(error.message || 'Ошибка загрузки доступов');
      }
    } catch (error) {
      console.error('Ошибка получения доступов:', error);
      setError('Ошибка соединения с сервером');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    if (!newAccess.email.trim()) {
      setError('Введите email');
      setIsSubmitting(false);
      return;
    }

    if (!newAccess.password.trim()) {
      setError('Введите пароль');
      setIsSubmitting(false);
      return;
    }

    if (!newAccess.phone.trim()) {
      setError('Введите телефон');
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/accesses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAccess)
      });

      const data = await response.json();

      if (response.ok) {
        setAccesses(prev => [...prev, data.access]);
        setNewAccess({ email: '', password: '', phone: '', role: 'manager' });
        setShowAddForm(false);
        setError('');
      } else {
        setError(data.message || 'Ошибка создания доступа');
      }
    } catch (error) {
      console.error('Ошибка создания доступа:', error);
      setError('Ошибка соединения с сервером');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccess = async (accessId: string) => {
    if (!confirm('Вы уверены, что хотите удалить доступ?')) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/accesses/delete?accessId=${accessId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setAccesses(prev => prev.filter(access => access.id !== accessId));
      } else {
        const error = await response.json();
        setError(error.message || 'Ошибка удаления доступа');
      }
    } catch (error) {
      console.error('Ошибка удаления доступа:', error);
      setError('Ошибка соединения с сервером');
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Администратор';
      case 'manager': return 'Менеджер';
      default: return role;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin': return 'Полный доступ ко всем функциям';
      case 'manager': return 'Ограниченный доступ к функциям';
      default: return '';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />;
      case 'manager': return <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />;
      default: return <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-restero-gray-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-restero-green mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-restero-gray-bg">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/dashboard/restaurants')}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Назад</span>
              </Button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-restero-green">Управление доступами</h1>
                <p className="text-gray-600 text-sm sm:text-base truncate">{restaurant?.name}</p>
              </div>
            </div>
            
            <Button 
              variant="restero"
              onClick={() => setShowAddForm(true)}
              size="sm"
              className="px-3 sm:px-4"
            >
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Добавить доступ</span>
              <span className="sm:hidden">Добавить</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 sm:py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Add Access Form */}
        {showAddForm && (
          <Card className="mb-6 sm:mb-8">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <Plus className="h-5 w-5 text-restero-green" />
                <span>Добавить доступ</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAccess} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm sm:text-base">Email сотрудника</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="employee@example.com"
                        value={newAccess.email}
                        onChange={(e) => setNewAccess(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10 h-10 sm:h-11 text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm sm:text-base">Пароль</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Введите пароль"
                        value={newAccess.password}
                        onChange={(e) => setNewAccess(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10 h-10 sm:h-11 text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm sm:text-base">Телефон</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+79994033950"
                        value={newAccess.phone}
                        onChange={(e) => setNewAccess(prev => ({ ...prev, phone: e.target.value }))}
                        className="pl-10 h-10 sm:h-11 text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm sm:text-base">Роль</Label>
                  <select
                    id="role"
                    value={newAccess.role}
                    onChange={(e) => setNewAccess(prev => ({ ...prev, role: e.target.value as 'admin' | 'manager' }))}
                    className="flex h-10 sm:h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="manager">Менеджер - ограниченный доступ</option>
                    <option value="admin">Администратор - полный доступ</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <Button 
                    type="submit" 
                    variant="restero" 
                    className="w-full sm:w-auto h-10 sm:h-11"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Создание...' : 'Создать доступ'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setError('');
                      setNewAccess({ email: '', password: '', phone: '', role: 'manager' });
                    }}
                    className="w-full sm:w-auto h-10 sm:h-11"
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Accesses List */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Users className="h-5 w-5 text-restero-green" />
              <span>Список доступов</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {accesses.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Доступы не созданы
                </h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  Добавьте сотрудников для работы с рестораном
                </p>
                <Button 
                  variant="restero"
                  onClick={() => setShowAddForm(true)}
                  className="w-full sm:w-auto h-10 sm:h-11"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить доступ
                </Button>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {accesses.map((access) => (
                  <div key={access.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                          {getRoleIcon(access.role)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                            {access.email}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">Сотрудник</p>
                          <p className="text-xs text-gray-500">{getRoleDescription(access.role)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          access.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {access.isActive ? 'Активен' : 'Неактивен'}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAccess(access.id)}
                            className="text-red-600 hover:text-red-700 h-8 sm:h-9 px-2 sm:px-3"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500 flex flex-col sm:flex-row sm:space-x-4">
                      <span>Создан: {new Date(access.createdAt).toLocaleDateString('ru-RU')}</span>
                      {access.activatedAt && (
                        <span>Активирован: {new Date(access.activatedAt).toLocaleDateString('ru-RU')}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default RestaurantAccessesPage;