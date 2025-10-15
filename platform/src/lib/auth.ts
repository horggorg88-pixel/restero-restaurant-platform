import jwt from 'jsonwebtoken';

export interface DecodedToken {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  exp?: number;
}

export function verifyToken(token: string): DecodedToken {
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production-12345';
  
  try {
    // Сначала пробуем JWT
    const decoded = jwt.verify(token, secret) as DecodedToken;
    return decoded;
  } catch (jwtError) {
    try {
      // Fallback на base64 для совместимости
      const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
      if (tokenData.exp && tokenData.exp < Date.now()) {
        throw new Error('Токен истек');
      }
      return tokenData as DecodedToken;
    } catch (base64Error) {
      throw new Error('Недействительный токен');
    }
  }
}

export function generateJWTToken(userData: {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
}): string {
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production-12345';
  
  return jwt.sign(
    {
      ...userData,
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 дней
    },
    secret
  );
}
