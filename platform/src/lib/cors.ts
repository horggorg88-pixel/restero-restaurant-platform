import { NextResponse } from 'next/server';
import { getAllowedOrigins } from '@/config/dev';

const ALLOWED_ORIGINS = getAllowedOrigins();

/**
 * Добавляет CORS заголовки к ответу
 * @param response - NextResponse объект
 * @param origin - Origin заголовок из запроса (опционально)
 * @returns NextResponse с добавленными CORS заголовками
 */
export function addCorsHeaders(response: NextResponse, origin?: string | null): NextResponse {
  // Определяем разрешенный origin
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) 
    ? origin 
    : ALLOWED_ORIGINS[0]; // Fallback на первый разрешенный домен

  // Устанавливаем CORS заголовки
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Cache-Control, Pragma, X-Requested-With');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 часа
  response.headers.set('Vary', 'Origin');

  return response;
}

/**
 * Обрабатывает preflight OPTIONS запросы
 * @param origin - Origin заголовок из запроса (опционально)
 * @returns NextResponse для OPTIONS запроса
 */
export function handleCorsPreflight(origin?: string | null): NextResponse {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response, origin);
}

/**
 * Проверяет, разрешен ли origin
 * @param origin - Origin для проверки
 * @returns true если origin разрешен
 */
export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.includes(origin);
}

/**
 * Получает origin из заголовков запроса
 * @param headers - Headers объект
 * @returns origin или null
 */
export function getOriginFromHeaders(headers: Headers): string | null {
  return headers.get('origin');
}

/**
 * Создает CORS ответ с данными
 * @param data - Данные для ответа
 * @param status - HTTP статус код
 * @param origin - Origin заголовок
 * @returns NextResponse с CORS заголовками
 */
export function createCorsResponse(data: any, status: number = 200, origin?: string | null): NextResponse {
  const response = NextResponse.json(data, { status });
  return addCorsHeaders(response, origin);
}

/**
 * Создает CORS ответ с ошибкой
 * @param message - Сообщение об ошибке
 * @param status - HTTP статус код
 * @param origin - Origin заголовок
 * @returns NextResponse с CORS заголовками
 */
export function createCorsErrorResponse(message: string, status: number = 500, origin?: string | null): NextResponse {
  return createCorsResponse({ message }, status, origin);
}
