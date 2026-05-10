"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function NavbarElegant({ data, projectName = "Projekt" }: { data?: any, projectName?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const content = {
    logoName: data?.logoName || projectName,
    links: data?.links || [
      { name: "Portfolio", url: "#" },
      { name: "Pro klienty", url: "#" },
      { name: "Ceník", url: "#" }
    ],
    btnText: data?.btnText || "Rezervovat termín"
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[var(--color-dt-bg)] border-b border-[var(--color-dt-text)]/10">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        
        {/* Logo a Linky vlevo */}
        <div className="flex items-center gap-12">
          <Link 
            href="/" 
            className="text-3xl font-extrabold tracking-tighter text-[var(--color-dt-text)]"
            style={{ fontFamily: 'var(--dt-font-heading)' }}
          >
            {content.logoName}
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--color-dt-text)]/60">
            {content.links.map((link: any, i: number) => (
              <Link key={i} href={link.url} className="hover:text-[var(--color-dt-accent)] transition-colors">
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* CTA vpravo */}
        <div className="hidden lg:flex items-center">
          <button 
            className="px-8 py-3 text-[11px] font-bold uppercase tracking-widest border transition-all hover:bg-[var(--color-dt-accent)] hover:text-[var(--color-dt-bg)] hover:border-[var(--color-dt-accent)]"
            style={{ 
              borderColor: 'var(--color-dt-text)', 
              color: 'var(--color-dt-text)',
              borderRadius: 'var(--dt-radius)' 
            }}
          >
            {content.btnText}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="lg:hidden text-[var(--color-dt-text)]" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown (Elegant Slide Down) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-[var(--color-dt-surface)] border-b border-[var(--color-dt-text)]/10 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {content.links.map((link: any, i: number) => (
                <Link key={i} href={link.url} className="text-xl font-bold tracking-tight text-[var(--color-dt-text)]">
                  {link.name}
                </Link>
              ))}
              <div className="pt-6 mt-2 border-t border-[var(--color-dt-text)]/10">
                <button 
                  className="w-full py-4 text-[11px] font-bold uppercase tracking-widest border"
                  style={{ borderColor: 'var(--color-dt-accent)', color: 'var(--color-dt-accent)', borderRadius: 'var(--dt-radius)' }}
                >
                  {content.btnText}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}