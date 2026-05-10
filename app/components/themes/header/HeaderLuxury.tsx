"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function HeaderLuxury({ 
  data, 
  projectName = "Hair Play",
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

  // --- 1. LOGIKA PRO STAVBU STROMU MENU ---
  // Vyfiltrujeme jen stránky, které patří do primárního menu
  const primaryPages = allPages?.filter(p => p.menu_type === 'primary') || [];
  
  // Najdeme hlavní položky (ty, co nemají rodiče) a seřadíme je
  const mainPages = primaryPages
    .filter(p => p.parent_id === null)
    .sort((a, b) => a.order_index - b.order_index);

  // Postavíme finální pole objektů i s pododkazy (dropdown)
  const dynamicMenu = mainPages.map(main => {
    // Najdeme děti pro danou hlavní položku
    const subPages = primaryPages
      .filter(p => p.parent_id === main.id)
      .sort((a, b) => a.order_index - b.order_index);

    return {
      name: main.title,
      // Hlavní odkaz
      url: main.is_homepage ? `/demo/${projectSlug}` : `/demo/${projectSlug}/${main.slug}`,
      // Pododkazy (pokud je to kotva, dáme #slug, jinak plnou URL)
      sublinks: subPages.map(sub => ({
        name: sub.title,
        url: sub.is_anchor ? `#${sub.slug}` : `/demo/${projectSlug}/${sub.slug}`
      }))
    };
  });

  // Obsah hlavičky - pokud uživatel v builderu menu nepřebije natvrdo, použije náš dynamický strom
  const content = {
    logoName: data?.logoName || projectName,
    links: (data?.links && data.links.length > 0) ? data.links : dynamicMenu,
    btnText: data?.btnText || "Rezervace"
  };

  // Styly
  const dynamicStyles = {
    '--color-dt-bg': colorPalette?.bg || '#ffffff',
    '--color-dt-text': colorPalette?.text || '#224c45',
    '--color-dt-accent': colorPalette?.accent || '#ae9760',
    '--dt-font-heading': designConfig?.font_heading ? `"${designConfig.font_heading}", serif` : 'inherit',
    '--dt-radius': designConfig?.radius || '0px',
  } as React.CSSProperties;

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[var(--color-dt-bg)]/90 backdrop-blur-md border-b border-[var(--color-dt-accent)]/20 transition-all duration-500" style={dynamicStyles}>
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        
        {/* LOGO */}
        <Link 
          href={`/demo/${projectSlug}`} 
          className="text-3xl font-normal tracking-wide text-[var(--color-dt-text)] relative z-50"
          style={{ fontFamily: 'var(--dt-font-heading)' }}
        >
          {content.logoName}
        </Link>
        
        {/* DESKTOP MENU S DROPDOWNEM */}
        <nav className="hidden md:flex items-center gap-10">
          {content.links.map((item: any, i: number) => (
            <div key={i} className="relative group">
              <Link 
                href={item.url} 
                className="flex items-center gap-1 text-sm uppercase tracking-[0.15em] text-[var(--color-dt-text)]/80 hover:text-[var(--color-dt-accent)] transition-colors py-4"
              >
                {item.name}
                {/* Pokud má položka pododkazy, ukážeme šipku dolů */}
                {item.sublinks && item.sublinks.length > 0 && (
                  <ChevronDown className="w-3 h-3 opacity-50" />
                )}
              </Link>
              
              {/* DROPDOWN MENU */}
              {item.sublinks && item.sublinks.length > 0 && (
                <div className="absolute top-full left-0 mt-0 w-56 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
                  <div className="bg-[var(--color-dt-bg)] border border-[var(--color-dt-accent)]/20 shadow-xl py-2" style={{ borderRadius: 'var(--dt-radius)' }}>
                    {item.sublinks.map((sub: any, j: number) => (
                      <Link 
                        key={j} 
                        href={sub.url} 
                        className="block px-6 py-3 text-xs uppercase tracking-widest text-[var(--color-dt-text)]/70 hover:text-[var(--color-dt-accent)] hover:bg-[var(--color-dt-text)]/5 transition-colors"
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
          <Link href="/rezervace"
            className="px-8 py-3 text-xs uppercase tracking-widest font-bold transition-all hover:opacity-90"
            style={{ 
              backgroundColor: 'var(--color-dt-accent)', 
              color: '#ffffff',
              borderRadius: 'var(--dt-radius)' 
            }}
          >
            {content.btnText}
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button className="md:hidden text-[var(--color-dt-text)] relative z-50" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* MOBILE MENU S VYKRESLENÍM PODODKAZŮ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} animate={{ height: "100vh", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="md:hidden absolute top-0 left-0 w-full bg-[var(--color-dt-bg)] overflow-y-auto flex flex-col px-6 pt-24 pb-12 z-40"
          >
            <nav className="flex flex-col gap-6 text-center mt-10">
              {content.links.map((item: any, i: number) => (
                <div key={i} className="flex flex-col gap-4">
                  <Link href={item.url} onClick={() => setIsOpen(false)} className="text-2xl text-[var(--color-dt-text)]" style={{ fontFamily: 'var(--dt-font-heading)' }}>
                    {item.name}
                  </Link>
                  
                  {/* Pododkazy v mobilu (menší a šedší) */}
                  {item.sublinks && item.sublinks.length > 0 && (
                    <div className="flex flex-col gap-3">
                      {item.sublinks.map((sub: any, j: number) => (
                        <Link 
                          key={j} 
                          href={sub.url} 
                          onClick={() => setIsOpen(false)} 
                          className="text-sm uppercase tracking-widest text-[var(--color-dt-text)]/50 hover:text-[var(--color-dt-accent)]"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="mt-10 border-t border-[var(--color-dt-accent)]/20 pt-10">
                <Link href="/rezervace" className="block w-full py-4 text-sm uppercase tracking-widest font-bold text-center" style={{ backgroundColor: 'var(--color-dt-accent)', color: '#ffffff', borderRadius: 'var(--dt-radius)' }} onClick={() => setIsOpen(false)}>
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