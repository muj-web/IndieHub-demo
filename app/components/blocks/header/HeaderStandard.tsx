"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";

// SLOVNÍK ŠÍŘEK (Stejný jako v HeroSplit pro dokonalé lícování)
const widthMap: Record<string, string> = {
  '100': 'max-w-full',
  '80': 'max-w-[1400px]',
  '60': 'max-w-7xl',
  '50': 'max-w-5xl',
};

export default function HeaderStandard({ 
  data, 
  projectName = "Projekt",
  allPages = [],
  projectSlug,
  designConfig,
  colorPalette
}: { 
  data?: any, 
  projectName?: string,
  allPages?: any[],
  projectSlug?: string,
  designConfig?: any,
  colorPalette?: any
}) {
  const [isOpen, setIsOpen] = useState(false);

  // --- AUTOMATICKÉ MENU Z DATABÁZE ---
  const primaryPages = allPages?.filter(p => p.menu_type === 'primary') || [];
  const mainPages = primaryPages.filter(p => p.parent_id === null).sort((a, b) => a.order_index - b.order_index);

  const dynamicMenu = mainPages.map(main => {
    const subPages = primaryPages.filter(p => p.parent_id === main.id).sort((a, b) => a.order_index - b.order_index);
    return {
      name: main.title,
      url: main.is_homepage ? `/demo/${projectSlug}` : `/demo/${projectSlug}/${main.slug}`,
      sublinks: subPages.map(sub => ({
        name: sub.title,
        url: sub.is_anchor ? `#${sub.slug}` : `/demo/${projectSlug}/${sub.slug}`
      }))
    };
  });

  const content = {
    logoText: data?.logoText || projectName,
    links: dynamicMenu,
    btnText: data?.btnText || "Kontakt",
    btnUrl: data?.btnUrl || "/kontakt"
  };

  // Načtení šířky z globálního nastavení
  const targetWidth = designConfig?.content_width || '60';
  const widthClass = widthMap[targetWidth] || widthMap['60'];

  const dynamicStyles = {
    '--color-dt-bg': colorPalette?.bg || '#ffffff',
    '--color-dt-text': colorPalette?.text || '#18181B',
    '--color-dt-surface': colorPalette?.surface || '#f4f4f5',
    '--color-dt-accent': colorPalette?.accent || '#8E44ED',
    '--dt-font-heading': designConfig?.font_heading ? `"${designConfig.font_heading}", sans-serif` : 'inherit',
    '--dt-radius': designConfig?.radius || '0.5rem',
  } as React.CSSProperties;

  return (
    <header 
      className="sticky top-0 inset-x-0 z-50 bg-[var(--color-dt-bg)] border-b border-[var(--color-dt-text)]/10 transition-colors duration-500" 
      style={dynamicStyles}
    >
      {/* APLIKOVANÁ DYNAMICKÁ ŠÍŘKA: ${widthClass} místo max-w-7xl */}
      <div className={`${widthClass} mx-auto px-6 h-20 flex items-center justify-between`}>
        
        {/* LOGO */}
        <Link 
          href={`/demo/${projectSlug}`} 
          className="text-2xl font-bold tracking-tight text-[var(--color-dt-text)] relative z-50"
          style={{ fontFamily: 'var(--dt-font-heading)' }}
        >
          {content.logoText}
        </Link>
        
        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-8">
          {content.links.map((item: any, i: number) => (
            <div key={i} className="relative group">
              <Link 
                href={item.url} 
                className="flex items-center gap-1 text-sm font-medium text-[var(--color-dt-text)]/80 hover:text-[var(--color-dt-accent)] transition-colors py-8"
              >
                {item.name}
                {item.sublinks && item.sublinks.length > 0 && (
                  <ChevronDown className="w-4 h-4 opacity-50" />
                )}
              </Link>
              
              {item.sublinks && item.sublinks.length > 0 && (
                <div className="absolute top-full left-0 mt-0 w-56 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                  <div 
                    className="bg-[var(--color-dt-surface)] border border-[var(--color-dt-text)]/10 shadow-xl py-2 overflow-hidden" 
                    style={{ borderRadius: 'var(--dt-radius)' }}
                  >
                    {item.sublinks.map((sub: any, j: number) => (
                      <Link 
                        key={j} 
                        href={sub.url} 
                        className="block px-4 py-2.5 text-sm font-medium text-[var(--color-dt-text)]/70 hover:text-[var(--color-dt-accent)] hover:bg-[var(--color-dt-text)]/5 transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* CTA TLAČÍTKO */}
        <div className="hidden md:block relative z-50">
          <Link 
            href={content.btnUrl}
            className="px-6 py-2.5 text-sm font-bold transition-all hover:opacity-90"
            style={{ 
              backgroundColor: 'var(--color-dt-accent)', 
              color: 'var(--color-dt-bg)',
              borderRadius: 'var(--dt-radius)' 
            }}
          >
            {content.btnText}
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button className="md:hidden text-[var(--color-dt-text)] relative z-50" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "100vh", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden absolute top-0 left-0 w-full bg-[var(--color-dt-bg)] overflow-y-auto flex flex-col px-6 pt-24 pb-12 z-40"
          >
            <nav className="flex flex-col gap-6 text-center mt-10">
              {content.links.map((item: any, i: number) => (
                <div key={i} className="flex flex-col gap-4">
                  <Link href={item.url} onClick={() => setIsOpen(false)} className="text-2xl font-bold text-[var(--color-dt-text)]" style={{ fontFamily: 'var(--dt-font-heading)' }}>
                    {item.name}
                  </Link>
                  
                  {item.sublinks && item.sublinks.length > 0 && (
                    <div className="flex flex-col gap-3">
                      {item.sublinks.map((sub: any, j: number) => (
                        <Link 
                          key={j} 
                          href={sub.url} 
                          onClick={() => setIsOpen(false)} 
                          className="text-base text-[var(--color-dt-text)]/60 hover:text-[var(--color-dt-accent)]"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="mt-8 pt-8 border-t border-[var(--color-dt-text)]/10">
                <Link 
                  href={content.btnUrl} 
                  className="block w-full py-4 text-sm font-bold text-center" 
                  style={{ backgroundColor: 'var(--color-dt-accent)', color: 'var(--color-dt-bg)', borderRadius: 'var(--dt-radius)' }} 
                  onClick={() => setIsOpen(false)}
                >
                  {content.btnText}
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}