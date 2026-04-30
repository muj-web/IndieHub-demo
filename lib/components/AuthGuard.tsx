'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';

// Seznam veřejných stránek, kam má přístup kdokoliv
const publicRoutes = ['/login', '/rezervace', '/demo'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname() || '';

  // Neprůstřelná kontrola: Zjistí, jestli aktuální adresa ZAČÍNÁ na některou z veřejných cest
  // Tohle spolehlivě vyřeší problémy s lomítky na konci i případnými parametry (např. ?test=1)
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    // TOTO NÁM POMŮŽE PŘI LADĚNÍ: Uvidíš to v konzoli prohlížeče (F12)
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

    // Reakce na odhlášení/přihlášení v reálném čase
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

  // Během prvotní kontroly ukážeme jen prázdnou černou obrazovku, aby aplikace neproblikla
  if (loading) return <div className="min-h-screen bg-slate-950"></div>;

  // Pokud není přihlášený a snaží se načíst neveřejnou stránku, nic nevykresluj (router ho už přesměrovává)
  if (!authenticated && !isPublicRoute) return null;

  return <>{children}</>;
}