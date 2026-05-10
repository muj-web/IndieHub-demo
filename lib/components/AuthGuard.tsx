'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';

// Seznam veřejných stránek
const publicRoutes = ['/', '/login', '/rezervace', '/demo'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname() || '';

  // OPRAVENÁ LOGIKA:
  // 1. Pokud je cesta v publicRoutes '/', vyžadujeme přesnou shodu (aby /dashboard nebyl brán jako public).
  // 2. Ostatní cesty (jako /login nebo /demo) mohou být prefixy.
  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  });

  useEffect(() => {
    console.log("👀 AuthGuard vidí cestu:", pathname, "| Je veřejná?", isPublicRoute);

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setAuthenticated(true);
      } else if (!isPublicRoute) {
        console.log("🚫 Nejsi přihlášen a cesta není veřejná -> Odesílám na login");
        router.push('/login');
      }
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
        if (!isPublicRoute) {
          router.push('/login');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, isPublicRoute, router]);

  // Černá obrazovka během kontroly, aby neproblikl obsah
  if (loading) return <div className="min-h-screen bg-slate-950"></div>;

  // Pokud není přihlášen a nejde o veřejnou cestu, nic nerenderujeme (router přesměrovává)
  if (!authenticated && !isPublicRoute) return null;

  return <>{children}</>;
}