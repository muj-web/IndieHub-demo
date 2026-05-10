import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host') || '';

  // 1. Propustíme statiku, API a soubory (aby fungovaly styly a obrázky)
  if (
    url.pathname.startsWith('/_next') || 
    url.pathname.startsWith('/api') ||
    url.pathname.match(/\.(.*)$/)
  ) {
    return NextResponse.next();
  }

  const isAppSubdomain = hostname.startsWith('app.');

  // --- LOGIKA PRO CHAMELEON OS (Subdoména app.) ---
  if (isAppSubdomain) {
    // Pokud uživatel zadá čistou subdoménu, podstrčíme mu obsah složky /dashboard
    if (url.pathname === '/') {
      url.pathname = '/dashboard';
      return NextResponse.rewrite(url);
    }
    // Všechny ostatní cesty na subdoméně (např. /builder, /klienti) propustíme
    return NextResponse.next();
  }

  // --- LOGIKA PRO MARKETING (Hlavní doména) ---
  // Seznam cest, které patří výhradně do OS a nesmí být na marketingovém webu.
const protectedPaths = [
    '/dashboard', '/projects', '/builder', '/klienti', 
    '/nova-faktura', '/upravit-fakturu', '/faktura', 
    '/prehled', '/rezervace', '/detail', '/settings', 
    '/novy-web', '/web-detail', '/upravit', '/upravit-web',
    '/login', '/register' // <--- PŘIDÁNO: Login a registrace běží vždy na subdoméně
  ];
  
  const isProtected = protectedPaths.some(path => url.pathname.startsWith(path));

  // Pokud jde někdo na chráněnou cestu přes hlavní doménu, přesměrujeme ho na subdoménu.
  if (isProtected || url.pathname === '/admin') {
    const newUrl = req.nextUrl.clone();
    const baseHost = hostname.replace('www.', '');
    newUrl.host = `app.${baseHost}`;
    
    // Pokud chtěl na /admin nebo /dashboard, hodíme ho na root subdomény
    if (url.pathname === '/admin' || url.pathname === '/dashboard') {
       newUrl.pathname = '/'; 
    }

    return NextResponse.redirect(newUrl);
  }

  // Vše ostatní na hlavní doméně (hlavně '/') propustíme pro marketing
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};