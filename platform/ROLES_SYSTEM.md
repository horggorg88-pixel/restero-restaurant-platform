# 🎭 Система ролей и доступов

## Обзор

Система управления доступами позволяет владельцам ресторанов предоставлять доступ к админке своим сотрудникам с различными уровнями прав.

## Роли

### 1. **Администратор** (`admin`)
- **Описание**: Полный доступ ко всем функциям админки
- **Права доступа**:
  - ✅ Список бронирований (`booking_list`)
  - ✅ Диаграмма Ганта (`gantt`)
  - ✅ База данных (`database`)
  - ✅ Попапы (`popups`)
  - ✅ Список столов (`tables_list`)
  - ✅ Управление доступами (`manage_accesses`)

### 2. **Менеджер** (`manager`)
- **Описание**: Ограниченный доступ к функциям
- **Права доступа**:
  - ❌ Список бронирований
  - ✅ Диаграмма Ганта (`gantt`) - **единственная доступная функция**
  - ❌ База данных
  - ❌ Попапы
  - ❌ Список столов
  - ❌ Управление доступами

## API Endpoints

### Управление доступами

#### `GET /api/restaurants/[id]/accesses`
Получение списка доступов к ресторану

**Ответ:**
```json
[
  {
    "id": "access:1",
    "userId": "user:1",
    "restaurantId": "restaurant:1",
    "role": "admin",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "user:1",
      "firstName": "Иван",
      "lastName": "Иванов",
      "email": "ivan@example.com"
    }
  }
]
```

#### `POST /api/restaurants/[id]/accesses`
Создание нового доступа

**Тело запроса:**
```json
{
  "email": "employee@example.com",
  "role": "manager"
}
```

#### `DELETE /api/restaurants/[id]/accesses/delete?accessId=[id]`
Удаление доступа

### Проверка доступа к админке

#### `POST /api/admin/check-access`
Проверка доступа пользователя к конкретному ресторану

**Тело запроса:**
```json
{
  "restaurantId": "restaurant:1"
}
```

**Ответ:**
```json
{
  "hasAccess": true,
  "role": "admin",
  "permissions": ["booking_list", "gantt", "database", "popups", "tables_list", "manage_accesses"],
  "restaurant": {
    "id": "restaurant:1",
    "name": "Мой ресторан",
    "address": "ул. Примерная, 1"
  }
}
```

#### `GET /api/admin/restaurants`
Получение списка ресторанов, к которым у пользователя есть доступ

**Ответ:**
```json
{
  "restaurants": [
    {
      "id": "restaurant:1",
      "name": "Мой ресторан",
      "address": "ул. Примерная, 1",
      "accessRole": "admin",
      "isOwner": true
    }
  ]
}
```

## Использование в коде

### Проверка ролей
```typescript
import { ROLES, hasPermission, isAdmin, isManager } from '@/lib/types/roles';

// Проверка конкретного права
if (hasPermission(userRole, 'booking_list')) {
  // Показать список бронирований
}

// Проверка роли
if (isAdmin(userRole)) {
  // Полный доступ
}

if (isManager(userRole)) {
  // Ограниченный доступ
}
```

### Создание доступа
```typescript
const response = await fetch(`/api/restaurants/${restaurantId}/accesses`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'employee@example.com',
    role: 'manager'
  })
});
```

## Логика работы

1. **Владелец ресторана** автоматически имеет роль `admin` для всех своих ресторанов
2. **Сотрудники** получают доступ через систему ролей с ограниченными правами
3. **Проверка доступа** происходит при каждом запросе к админке
4. **Роли наследуются** из системы админки (`admin` и `manager`)

## Безопасность

- Все API endpoints требуют JWT токен
- Проверка прав происходит на сервере
- Пользователи могут получить доступ только к ресторанам, к которым им предоставлен доступ
- Владельцы ресторанов могут управлять доступами только для своих ресторанов


