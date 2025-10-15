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
  UserCheck, 
  UserX,
  ArrowLeft,
  Copy,
  Trash2
} from 'lucide-react';

interface Access {
  id: number;
  email: string;
  role: 'ADMIN' | 'HOSTESS';
  status: 'PENDING' | 'ACTIVE' | 'REVOKED';
  accessToken?: string;
  expiresAt?: string;
  createdAt: string;
}

interface Restaurant {
  id: number;
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
  const [newAccess, setNewAccess] = useState({
    email: '',
    role: 'HOSTESS' as 'ADMIN' | 'HOSTESS'
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
      }
    } catch (error) {
      console.error('Ошибка получения доступов:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAccess.email.trim()) {
      alert('Введите email');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/accesses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAccess)
      });

      if (response.ok) {
        const data = await response.json();
        setAccesses(prev => [...prev, data.access]);
        setNewAccess({ email: '', role: 'HOSTESS' });
        setShowAddForm(false);
        alert('Доступ успешно создан! Ссылка отправлена на email.');
      } else {
        const error = await response.json();
        alert(error.message || 'Ошибка создания доступа');
      }
    } catch (error) {
      console.error('Ошибка создания доступа:', error);
      alert('Ошибка создания доступа');
    }
  };

  const handleRevokeAccess = async (accessId: number) => {
    if (!confirm('Вы уверены, что хотите отозвать доступ?')) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/accesses/${accessId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setAccesses(prev => prev.filter(access => access.id !== accessId));
      } else {
        alert('Ошибка отзыва доступа');
      }
    } catch (error) {
      console.error('Ошибка отзыва доступа:', error);
      alert('Ошибка отзыва доступа');
    }
  };

  const copyAccessLink = (accessToken: string) => {
    const link = `${window.location.origin}/access/${accessToken}`;
    navigator.clipboard.writeText(link);
    alert('Ссылка скопирована в буфер обмена');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REVOKED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Активен';
      case 'PENDING': return 'Ожидает';
      case 'REVOKED': return 'Отозван';
      default: return status;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Администратор';
      case 'HOSTESS': return 'Хостес';
      default: return role;
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
                    <Label htmlFor="role" className="text-sm sm:text-base">Роль</Label>
                    <select
                      id="role"
                      value={newAccess.role}
                      onChange={(e) => setNewAccess(prev => ({ ...prev, role: e.target.value as 'ADMIN' | 'HOSTESS' }))}
                      className="flex h-10 sm:h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="HOSTESS">Хостес</option>
                      <option value="ADMIN">Администратор</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <Button type="submit" variant="restero" className="w-full sm:w-auto h-10 sm:h-11">
                    Создать доступ
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
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
                  <div key={access.id} className="border rounded-lg p-3 sm:p-4 hover-lift">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                          {access.role === 'ADMIN' ? (
                            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                          ) : (
                            <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{access.email}</p>
                          <p className="text-xs sm:text-sm text-gray-600">{getRoleText(access.role)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(access.status)}`}>
                          {getStatusText(access.status)}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          {access.accessToken && access.status === 'ACTIVE' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyAccessLink(access.accessToken!)}
                              className="h-8 sm:h-9 px-2 sm:px-3"
                            >
                              <Copy className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                              <span className="hidden sm:inline">Ссылка</span>
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRevokeAccess(access.id)}
                            className="text-red-600 hover:text-red-700 h-8 sm:h-9 px-2 sm:px-3"
                          >
                            <UserX className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500 flex flex-col sm:flex-row sm:space-x-4">
                      <span>Создан: {new Date(access.createdAt).toLocaleDateString('ru-RU')}</span>
                      {access.expiresAt && (
                        <span>Истекает: {new Date(access.expiresAt).toLocaleDateString('ru-RU')}</span>
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
