// src/components/themes/header/NavbarNeon.tsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function NavbarNeon({ 
  data, 
  projectName = "Projekt",
  allPages = [], // Přijímáme seznam stránek
  projectSlug    // Přijímáme slug projektu
}: { 
  data?: any, 
  projectName?: string,
  allPages?: any[],
  projectSlug?: string 
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Převod stránek z DB na formát odkazů pro menu
  const dynamicLinks = allPages.map(page => ({
    name: page.title,
    url: page.is_homepage ? `/demo/${projectSlug}` : `/demo/${projectSlug}/${page.slug}`
  }));

  const content = {
    logoName: data?.logoName || projectName,
    // Pokud máme v DB nastavené vlastní linky, použijeme je, jinak použijeme dynamické stránky
    links: (data?.links && data.links.length > 0) ? data.links : dynamicLinks,
    btnText: data?.btnText || "Kontakt"
  };

  return (
    <header className="fixed top-6 inset-x-0 z-50 px-6 flex justify-center">
      <nav 
        className="w-full max-w-5xl bg-[var(--color-dt-surface)]/80 backdrop-blur-xl border border-[var(--color-dt-accent)]/30 px-6 py-4 flex items-center justify-between transition-all"
        style={{ 
          borderRadius: 'var(--dt-radius)',
          boxShadow: '0 10px 30px -10px var(--color-dt-accent)'
        }}
      >
        <Link href={`/demo/${projectSlug}`} className="text-xl font-black tracking-widest uppercase text-[var(--color-dt-text)]" style={{ fontFamily: 'var(--dt-font-heading)' }}>
          {content.logoName}
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {content.links.map((link: any, i: number) => (
            <Link key={i} href={link.url} className="text-sm font-medium text-[var(--color-dt-text)]/70 hover:text-[var(--color-dt-accent)] transition-colors">
              {link.name}
            </Link>
          ))}
        </div>
        
        {/* Zbytek kódu zůstává stejný... */}
        <button className="hidden md:block px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all hover:scale-105" style={{ backgroundColor: 'var(--color-dt-accent)', color: 'var(--color-dt-bg)', borderRadius: 'var(--dt-radius)' }}>{content.btnText}</button>
        <button className="md:hidden text-[var(--color-dt-text)]" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
      </nav>
      {/* Mobile Menu Dropdown ... */}
    </header>
  );
}