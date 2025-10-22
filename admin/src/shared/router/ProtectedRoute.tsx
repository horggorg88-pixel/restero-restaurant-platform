import { useAuth } from "@shared/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { getPlatformUrl } from '@/config/api';

interface ProtectedRouteProps {
  element: ReactNode;
}

const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("userRole");
      
      if (!token) {
        setHasAccess(false);
        setIsLoading(false);
        return;
      }

      // Если это сотрудник, проверяем доступ к выбранному ресторану
      if (userRole) {
        try {
          const platformUrl = getPlatformUrl();
          // Берем restaurantId из localStorage (поддерживаем оба ключа на всякий случай)
          const restaurantId = localStorage.getItem('restaurant_id') || localStorage.getItem('restaurantId') || '';

          // Если ресторан не выбран, не блокируем доступ (дальше в UI будет выбор ресторана)
          if (!restaurantId) {
            setHasAccess(true);
            setIsLoading(false);
            return;
          }

          const response = await fetch(`${platformUrl}/api/admin/check-access`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ restaurantId })
          });

          if (response.ok) {
            const data = await response.json();
            setHasAccess(data.hasAccess);
          } else {
            setHasAccess(false);
          }
        } catch (error) {
          console.error('Ошибка проверки доступа:', error);
          setHasAccess(false);
        }
      } else {
        // Обычный администратор
        setHasAccess(true);
      }
      
      setIsLoading(false);
    };

    checkAccess();
    // Проверяем доступ по факту изменения токена/роли, а не на каждый переход,
    // чтобы избежать лишних запросов и мерцаний
  }, [isAuthenticated]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Загрузка...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (hasAccess === false) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Доступ запрещен</h2>
          <p className="text-gray-600">У вас нет прав для доступа к этому разделу.</p>
          <p className="text-sm text-gray-500 mt-2">
            Ваша роль: {localStorage.getItem('userRole') === 'admin' ? 'Администратор' : 'Менеджер'}
          </p>
        </div>
      </div>
    );
  }

  return <>{element}</>;
};

export default ProtectedRoute;
