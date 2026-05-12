import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host') || '';

  if (
    url.pathname.startsWith('/_next') || 
    url.pathname.startsWith('/api') ||
    url.pathname.match(/\.(.*)$/)
  ) {
    return NextResponse.next();
  }

  const isAppSubdomain = hostname.startsWith('app.');

  if (isAppSubdomain) {
    // 🛑 OPRAVA: Přidáno url.pathname.startsWith('/demo')
    if (
      url.pathname === '/login' || 
      url.pathname.startsWith('/builder') || 
      url.pathname.startsWith('/faktura') ||
      url.pathname.startsWith('/demo')
    ) {
      return NextResponse.next();
    }

    // Pokud adresa ještě nezačíná na /admin, podstrčíme ji tam
    if (!url.pathname.startsWith('/admin')) {
      url.pathname = `/admin${url.pathname === '/' ? '' : url.pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // Ochrana na hlavní doméně (bez změn)
  const protectedPaths = [
    '/admin', '/klienti', '/nova-faktura', '/upravit-fakturu', 
    '/faktura', '/prehled', '/detail', '/settings', 
    '/novy-web', '/web-detail', '/upravit', '/upravit-web', '/clanky', '/builder'
  ];
  
  const isProtected = protectedPaths.some(path => url.pathname.startsWith(path));

  if (isProtected) {
    const newUrl = req.nextUrl.clone();
    const baseHost = hostname.replace('www.', '');
    newUrl.host = `app.${baseHost}`;
    if (url.pathname === '/admin') newUrl.pathname = '/'; 
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};