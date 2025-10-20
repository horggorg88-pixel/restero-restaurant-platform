import { ReactNode } from "react";

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const RoleBasedRoute = ({ children, allowedRoles }: RoleBasedRouteProps) => {
  const userRole = localStorage.getItem("userRole");

  // Если пользователь не аутентифицирован как сотрудник, показываем все
  if (!userRole) {
    return <>{children}</>;
  }

  // Проверяем, есть ли у пользователя доступ к текущему разделу
  const hasAccess = allowedRoles.includes(userRole);

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Доступ запрещен</h2>
          <p className="text-gray-600">
            У вас нет прав для доступа к этому разделу.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Ваша роль: {userRole === 'admin' ? 'Администратор' : 'Менеджер'}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
