import { NextRequest, NextResponse } from 'next/server';
import { RedisDataManager, connectRedis } from '@/lib/redis';
import { generateJWTToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { handleCorsPreflight, createCorsResponse, createCorsErrorResponse, getOriginFromHeaders } from '@/lib/cors';

// Явно указываем что это динамический route
export const dynamic = 'force-dynamic';

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = getOriginFromHeaders(request.headers);
  return handleCorsPreflight(origin);
}

// Логин для админки
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    console.log('Login attempt:', { 
      username, 
      password: password ? '[HIDDEN]' : 'undefined',
      usernameType: typeof username,
      passwordType: typeof password,
      usernameLength: username?.length,
      passwordLength: password?.length
    });

    if (!username || !password) {
      const origin = getOriginFromHeaders(request.headers);
      return createCorsErrorResponse('Username и password обязательны', 400, origin);
    }

    // Подключение к Redis
    await connectRedis();

    let userData;
    let isAuthenticated = false;

    // СНАЧАЛА проверяем, является ли это сотрудником ресторана
    const access = await RedisDataManager.getAccessByEmail(username);
    
    if (access && access.password === password && access.isActive) {
      // В токен кладем ИМЕННО userId сотрудника (а не id доступа),
      // т.к. проверка в /api/admin/check-access сравнивает restaurant.ownerId или access.userId
      const numericUserId = (() => {
        const raw = String(access.userId || '');
        const parts = raw.split(':');
        const n = parseInt(parts[parts.length - 1] || '', 10);
        return Number.isFinite(n) ? n : 0;
      })();

      userData = {
        userId: numericUserId,
        email: access.email,
        firstName: 'Employee',
        lastName: 'User'
      };
      isAuthenticated = true;
      console.log('Restaurant employee login successful:', { email: access.email, role: access.role, restaurantId: access.restaurantId });
    } else {
      // ТОЛЬКО если не найден как сотрудник, проверяем как админ платформы
      const platformAdmin = await RedisDataManager.getUserByEmail(username);
      
      if (platformAdmin) {
        // Это админ платформы - проверяем пароль через bcrypt
        const isPasswordValid = await bcrypt.compare(password, platformAdmin.password);
        
        if (isPasswordValid) {
          // Нормализуем userId: поддержка форматов 'user:13' и '13'
          const numericUserId = (() => {
            const parts = String(platformAdmin.id).split(':');
            const n = parseInt(parts[parts.length - 1] || '', 10);
            return Number.isFinite(n) ? n : 0;
          })();

          userData = {
            userId: numericUserId,
            email: platformAdmin.email,
            firstName: platformAdmin.firstName,
            lastName: platformAdmin.lastName
          };
          isAuthenticated = true;
          console.log('Platform admin login successful:', { email: platformAdmin.email, role: platformAdmin.role });
        }
      }
    }
    
    console.log('Authentication result:', { 
      isAuthenticated,
      username,
      userData: userData ? { ...userData, password: '[HIDDEN]' } : null
    });
    
    if (isAuthenticated && userData) {
      const token = generateJWTToken(userData);

      const refreshToken = `refresh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Определяем, зашел ли сотрудник ресторана (есть access)
      const access = await RedisDataManager.getAccessByEmail(username);

      const userPayload: Record<string, any> = {
        id: userData.userId,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      };
      // ВАЖНО: роль добавляем ТОЛЬКО для сотрудников, чтобы админы платформы не проходили employee-путь в админке
      if (access && access.isActive && access.email === username) {
        userPayload.role = access.role; // 'admin' | 'manager'
        userPayload.restaurantId = access.restaurantId;
      }

      const origin = getOriginFromHeaders(request.headers);
      return createCorsResponse({
        success: true,
        data: {
          access_token: token,
          refresh_token: refreshToken,
          token_type: 'Bearer',
          expires_in: 3600,
          user: userPayload
        }
      }, 200, origin);
    }

    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Неверные учетные данные', 401, origin);

  } catch (error) {
    console.error('Ошибка логина:', error);
    const origin = getOriginFromHeaders(request.headers);
    return createCorsErrorResponse('Внутренняя ошибка сервера', 500, origin);
  }
}
