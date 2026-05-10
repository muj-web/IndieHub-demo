"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

// 1. Lookup objekty pro Super-Hlavičku
const heightMap: Record<string, string> = {
  S: 'h-16', // Kompaktní
  M: 'h-20', // Standard
  L: 'h-28', // Vzdušná
};

const bgMap: Record<string, string> = {
  none: 'bg-transparent', // Čistě průhledná (např. přes fotku)
  image: 'bg-[var(--color-dt-bg)]', // Místo obrázku u hlavičky dáme plnou barvu
  gradient: 'bg-[var(--color-dt-bg)]/60 backdrop-blur-2xl border-b border-[var(--color-dt-text)]/5', // Glassmorphism
  video: 'bg-[var(--color-dt-bg)]/60 backdrop-blur-2xl border-b border-[var(--color-dt-text)]/5', // Fallback na glass
};

const menuAlignMap: Record<string, string> = {
  left: 'mr-auto ml-12', // Menu hned za logem
  center: 'mx-auto',     // Menu perfektně uprostřed
  right: 'ml-auto mr-12' // Menu vpravo u tlačítka
};

export default function NavbarCinematic({ data, projectName = "Projekt" }: { data?: any, projectName?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  // 2. Čtení přepínačů z JSON databáze
  const content = {
    logoName: data?.logoName || projectName,
    links: data?.links || [
      { name: "Divize", url: "#" },
      { name: "Certifikace", url: "#" },
      { name: "Kariéra", url: "#" }
    ],
    btnText: data?.btnText || "Kontakt",
    
    // Načítání stylů ze společných "přepínačů"
    padding: data?.padding || 'M',
    bg_type: data?.bg_type || 'gradient', 
    align: data?.align || 'center',
  };

  // 3. Překlad na Tailwind třídy
  const heightClass = heightMap[content.padding] || heightMap['M'];
  const bgClass = bgMap[content.bg_type] || bgMap['gradient'];
  const alignClass = menuAlignMap[content.align] || menuAlignMap['center'];

  return (
    // Aplikace dynamického pozadí
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${bgClass}`}>
      {/* Aplikace dynamické výšky */}
      <div className={`max-w-[1400px] mx-auto px-6 flex items-center justify-between ${heightClass}`}>
        
        {/* Logo */}
        <Link 
          href="/" 
          className="text-2xl font-bold tracking-tight text-[var(--color-dt-text)] whitespace-nowrap"
          style={{ fontFamily: 'var(--dt-font-heading)' }}
        >
          {content.logoName}
        </Link>

        {/* Desktop Menu - Aplikace dynamického zarovnání */}
        <nav className={`hidden md:flex items-center gap-10 ${alignClass}`}>
          {content.links.map((link: any, i: number) => (
            <Link key={i} href={link.url} className="text-sm font-medium tracking-wide text-[var(--color-dt-text)]/80 hover:text-[var(--color-dt-text)] transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA - striktní radius pravidlo */}
        <button 
          className="hidden md:block px-6 py-3 text-sm font-semibold transition-all hover:opacity-80 shrink-0"
          style={{ 
            backgroundColor: 'var(--color-dt-text)', 
            color: 'var(--color-dt-bg)',
            borderRadius: 'var(--dt-radius)'
          }}
        >
          {content.btnText}
        </button>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2 text-[var(--color-dt-text)]" onClick={() => setIsOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Fullscreen Mobile Menu (Zůstává stejné) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] bg-[var(--color-dt-bg)] p-8 flex flex-col"
          >
            <div className="flex justify-end mb-12">
              <button onClick={() => setIsOpen(false)} className="p-2 text-[var(--color-dt-text)] border border-[var(--color-dt-text)]/10" style={{ borderRadius: 'var(--dt-radius)' }}>
                <X />
              </button>
            </div>
            <nav className="flex flex-col gap-8 text-4xl font-bold tracking-tighter text-[var(--color-dt-text)]">
              {content.links.map((link: any, i: number) => (
                <Link key={i} href={link.url} onClick={() => setIsOpen(false)}>
                  {link.name}
                </Link>
              ))}
            </nav>
            <button 
              className="mt-auto py-5 text-lg font-bold w-full"
              style={{ backgroundColor: 'var(--color-dt-text)', color: 'var(--color-dt-bg)', borderRadius: 'var(--dt-radius)' }}
            >
              {content.btnText}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}