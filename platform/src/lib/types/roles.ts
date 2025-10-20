// Система ролей для управления доступами
export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager"
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// Описания ролей для UI
export const ROLE_DESCRIPTIONS = {
  [ROLES.ADMIN]: "Администратор - полный доступ ко всем функциям",
  [ROLES.MANAGER]: "Менеджер - ограниченный доступ к функциям"
} as const;

// Права доступа для каждой роли
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    "booking_list",      // Список бронирований
    "gantt",            // Диаграмма Ганта
    "database",         // База данных
    "popups",           // Попапы
    "tables_list",      // Список столов
    "manage_accesses"   // Управление доступами
  ],
  [ROLES.MANAGER]: [
    "gantt"             // Только диаграмма Ганта
  ]
} as const;

// Проверка прав доступа
export const hasPermission = (userRole: Role, permission: string): boolean => {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission as any);
};

// Проверка является ли пользователь администратором
export const isAdmin = (userRole: Role): boolean => {
  return userRole === ROLES.ADMIN;
};

// Проверка является ли пользователь менеджером
export const isManager = (userRole: Role): boolean => {
  return userRole === ROLES.MANAGER;
};


