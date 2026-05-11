"use client";

import { motion, Transition } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const snapTransition: Transition = { type: "spring", stiffness: 120, damping: 20 };

export default function NavbarUtilitarian({ 
  data, 
  projectName = "Projekt",
  allPages = [], // PŘIDÁNO: Přijímáme seznam stránek
  projectSlug    // PŘIDÁNO: Přijímáme slug projektu
}: { 
  data?: any, 
  projectName?: string,
  allPages?: any[],
  projectSlug?: string 
}) {

  // PŘIDÁNO: Převod stránek z DB na formát odkazů pro menu
  const dynamicLinks = allPages.map(page => ({
    name: page.title,
    url: page.is_homepage ? `/demo/${projectSlug}` : `/demo/${projectSlug}/${page.slug}`
  }));

  const content = {
    logoName: data?.logoName || projectName,
    certText: data?.certText || "ISO 9001 | ISO 3834-2",
    tagline: data?.tagline || "HEAVY INDUSTRY ENG.",
    // OPRAVENO: Pokud nejsou linky v datech natvrdo, použijeme ty z databáze (dynamicLinks), 
    // jinak se fallbackuje na prázdné pole, abys tam neměl nesmysly z jiných projektů.
    links: (data?.links && data.links.length > 0) ? data.links : (dynamicLinks.length > 0 ? dynamicLinks : []),
    btnText: data?.btnText || "KONTAKT"
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={snapTransition}
      className="sticky top-0 z-50 bg-[var(--color-dt-bg)]/90 backdrop-blur-md border-b border-[var(--color-dt-text)]/20"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className="text-2xl font-black tracking-tighter uppercase text-[var(--color-dt-text)]"
            style={{ fontFamily: 'var(--dt-font-heading)' }}
          >
            {content.logoName}
          </Link>
          
          <div className="hidden md:flex flex-col border-l border-[var(--color-dt-text)]/20 pl-6">
            <span className="text-[10px] font-mono text-[var(--color-dt-text)]/50 uppercase tracking-widest">{content.certText}</span>
            <span className="text-xs font-bold text-[var(--color-dt-text)] tracking-tight">{content.tagline}</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {content.links.map((link: any, i: number) => (
            <Link key={i} href={link.url} className="text-[var(--color-dt-text)]/80 hover:text-[var(--color-dt-accent)] transition-colors">
              {link.name}
            </Link>
          ))}
          <button 
            className="px-5 py-2.5 text-sm font-mono tracking-tight transition-colors flex items-center gap-2 hover:opacity-90"
            style={{ 
              backgroundColor: 'var(--color-dt-text)', 
              color: 'var(--color-dt-bg)',
              borderRadius: 'var(--dt-radius)' 
            }}
          >
            {content.btnText} <ArrowUpRight className="w-4 h-4" />
          </button>
        </nav>
      </div>
    </motion.header>
  );
}