"use client";

import { Search, } from "lucide-react";
import Link from "next/link";

export default function HeaderIndustrial({ 
  data, 
  projectName = "INDUSTRY" 
}: { 
  data?: any, 
  projectName?: string 
}) {
  const content = {
    topLinks: data?.topLinks || ["Řešení na míru", "Klientský portál", "B2B", "Podpora"],
    mainLinks: data?.mainLinks || ["O nás", "Služby", "Projekty", "Kontakt"],
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[var(--color-dt-bg)]/95 backdrop-blur-xl border-b pt-4 pb-4 transition-colors" style={{ borderColor: 'var(--color-dt-text)1A' }}>
      <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-start">
        
        {/* TEXTOVÉ LOGO (Místo obrázku) */}
        <Link href="#" className="flex items-center mt-3">
          <span className="text-2xl md:text-3xl font-black tracking-tighter uppercase text-[var(--color-dt-text)]">
            {projectName}
            <span style={{ color: 'var(--color-dt-accent)' }}>.</span>
          </span>
        </Link>
        
        {/* NAVIGACE VPRAVO */}
        <div className="hidden md:flex flex-col items-end gap-5">
          
          {/* Top Bar (Malé odkazy + Soc. sítě) */}
          <div className="flex items-center gap-6 text-[11px] font-medium uppercase tracking-widest text-[var(--color-dt-text)]/70">
            <button className="hover:text-[var(--color-dt-accent)] transition-colors">
              <Search className="w-4 h-4" strokeWidth={2.5} />
            </button>
            
            {content.topLinks.map((link: string, i: number) => (
              <Link key={i} href="#" className="hover:text-[var(--color-dt-accent)] transition-colors">{link}</Link>
            ))}
            
            <div className="flex items-center gap-4 ml-4 text-[var(--color-dt-text)]/50">
    
            </div>
          </div>

          {/* Main Bar (Hlavní odkazy) */}
          <nav className="flex items-center gap-10 text-[14px] font-medium text-[var(--color-dt-text)]">
            {content.mainLinks.map((link: string, i: number) => (
              <Link 
                key={i} 
                href="#" 
                className="transition-colors hover:opacity-80"
                style={{ ':hover': { color: 'var(--color-dt-accent)' } } as any} // Inline hack nebo řešeno přes globální styly/třídy
              >
                {link}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}