'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Svatby', href: '/svatebni-fotograf/svatebni-fotograf-brno' },
    { name: 'B2B & Firmy', href: '/firmy' },
    { name: 'Deník', href: '/blog' },
    { name: 'O mně', href: '/o-mne' },
  ];

 return (
    <>
      <nav 
        // PŘIDÁNO: border-b je tu nastálo, aby nedělal skoky
        className={`fixed w-full z-50 transition-all duration-500 border-b ${
          scrolled 
            ? 'bg-[#FAFAFA]/95 backdrop-blur-md border-black/5 py-4 shadow-sm' 
            : 'bg-transparent border-transparent pt-8 pb-6' // PŘIDÁNO: border-transparent
        }`}
      >
        {!scrolled && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
        )}

        {/* Zvětšené boční odsazení (px-8 lg:px-12) krásně zarovná obsah s vnitřkem zakulacené fotky */}
<div className="w-full mx-auto px-8 lg:px-11 flex items-center justify-between relative z-10">

          {/* LOGO */}
          <Link href="/" className={`font-serif text-2xl tracking-wide font-medium transition-colors ${scrolled ? 'text-[#1A1A1A]' : 'text-white'}`}>
            Radek Čech<span className="text-[#B09B84]">.</span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-[11px] uppercase tracking-[0.2em] font-bold transition-colors ${
                  scrolled ? 'text-[#1A1A1A]/70 hover:text-[#B09B84]' : 'text-white/80 hover:text-white drop-shadow-md'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* KONTAKT TLAČÍTKO - Nyní ve tvaru zaoblené pilulky (rounded-full) */}
          <div className="hidden md:block">
            <Link 
              href="/kontakt" 
              className={`inline-flex px-8 py-3.5 text-[10px] uppercase tracking-widest font-bold transition-all duration-300 rounded-2xl ${
                scrolled 
                  ? 'bg-[#1A1A1A] text-white hover:bg-[#B09B84] hover:scale-105' 
                  : 'bg-white text-[#1A1A1A] hover:bg-[#B09B84] hover:text-white hover:scale-105 shadow-lg'
              }`}
            >
              Poptat termín
            </Link>
          </div>

          {/* HAMBURGER IKONA (Mobil) */}
          <button 
            className={`md:hidden z-50 relative p-2 ${scrolled || isOpen ? 'text-[#1A1A1A]' : 'text-white drop-shadow-md'}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} strokeWidth={1} /> : <Menu size={28} strokeWidth={1} />}
          </button>
        </div>
      </nav>

      {/* FULLSCREEN MOBILNÍ MENU */}
      <div 
        className={`fixed inset-0 bg-[#FAFAFA] z-40 flex flex-col justify-center items-center transition-transform duration-500 ease-in-out md:hidden ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex flex-col items-center space-y-8 text-center">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="font-serif text-3xl font-light text-[#1A1A1A] hover:text-[#B09B84] transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link 
            href="/kontakt" 
            onClick={() => setIsOpen(false)}
            className="mt-8 inline-flex px-10 py-4 border border-[#1A1A1A] text-[#1A1A1A] text-xs uppercase tracking-widest font-bold rounded-full hover:bg-[#1A1A1A] hover:text-white transition-all hover:scale-105"
          >
            Poptat termín
          </Link>
        </div>
      </div>
    </>
  );
}