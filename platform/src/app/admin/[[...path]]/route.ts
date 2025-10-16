import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  const path = params.path || [];
  const adminPath = join(process.cwd(), 'platform', 'public', 'admin');
  
  try {
    // Если запрос к корню админ-панели, возвращаем index.html
    if (path.length === 0) {
      const indexPath = join(adminPath, 'index.html');
      const content = await readFile(indexPath, 'utf-8');
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }
    
    // Для статических файлов (CSS, JS, изображения)
    const filePath = join(adminPath, ...path);
    const content = await readFile(filePath);
    
    // Определяем Content-Type по расширению файла
    const ext = path[path.length - 1]?.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case 'html':
        contentType = 'text/html';
        break;
      case 'css':
        contentType = 'text/css';
        break;
      case 'js':
        contentType = 'application/javascript';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'svg':
        contentType = 'image/svg+xml';
        break;
      case 'ico':
        contentType = 'image/x-icon';
        break;
    }
    
    return new NextResponse(content, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Кеширование на год для статических файлов
      },
    });
  } catch (error) {
    // Если файл не найден, возвращаем index.html для SPA маршрутизации
    try {
      const indexPath = join(adminPath, 'index.html');
      const content = await readFile(indexPath, 'utf-8');
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    } catch (indexError) {
      return new NextResponse('Admin panel not found', { status: 404 });
    }
  }
}
