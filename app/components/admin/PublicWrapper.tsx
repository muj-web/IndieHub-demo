'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/app/components/web/Navbar'; 
import Link from 'next/link';

export default function PublicWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAppSubdomain, setIsAppSubdomain] = useState(false);

  // Detekce, zda jsme na subdoméně "app."
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hostname.startsWith('app.')) {
      setIsAppSubdomain(true);
    }
  }, []);
  
  // Kontrola systémových cest
  const isSystemRoute = pathname?.startsWith('/admin') || 
                        pathname?.startsWith('/login') || 
                        pathname?.startsWith('/demo') || 
                        isAppSubdomain;

  if (isSystemRoute) {
    return <>{children}</>;
  }

  // 💡 OPRAVA PRO VEŘEJNÝ WEB:
  // 1. Vynutíme světlé pozadí (bg-[#FAFAFA]) a barvu textu, aby admin Dark Mode neovlivňoval web.
  // 2. "pt-[0.1px]" je kouzelný trik, který zastaví "margin collapsing". 
  //    Díky němu "mt-6" na tvých stránkách vytvoří mezeru, ve které uvidíš barvu pozadí tohoto wrapperu.
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] text-[#1A1A1A]">
      <Navbar />
      <main className="flex-grow pt-[0.1px] bg-[#FAFAFA]">
        {children}
      </main>
      <footer className="bg-[#0F1115] text-white/50 py-12 text-center text-[10px] uppercase tracking-[0.2em] font-light">
        <p className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
          <span>
            Navrhnul <a href="https://www.digitalnitvurce.cz/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#B09B84] transition-colors font-bold">Digitální tvůrce</a>
          </span>
          <span className="hidden md:inline">|</span>
          <span>
            Copyright &copy; {new Date().getFullYear()} <Link href="/" className="text-white hover:text-[#B09B84] transition-colors font-bold">Radek Čech</Link>
          </span>
        </p>
      </footer>
    </div>
  );
}