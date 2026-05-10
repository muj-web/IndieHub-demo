"use client";

import { motion, Variants } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import React from "react";

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

interface HeroIndustrialProps {
  data?: any;
  designConfig?: any;
  colorPalette?: any;
  projectName?: string;
}

export default function HeroIndustrial({ 
  data, 
  designConfig,
  colorPalette,
  projectName = "Projekt" 
}: HeroIndustrialProps) {
  
  const content = {
    headingSmall: data?.headingSmall || "Produkty pro",
    headingLarge: data?.headingLarge || "profesionály",
    subtitle: data?.subtitle || "Specializace v oblasti špičkové techniky a inovací",
    placeholder: data?.placeholder || "Hledat produkt nebo službu...",
    btn1: data?.btn1 || "Reference",
    btn2: data?.btn2 || "Produkty",
  };

  const dynamicStyles = {
    '--color-dt-bg': colorPalette?.bg || '#F4F4F5',
    '--color-dt-text': colorPalette?.text || '#18181B',
    '--color-dt-surface': colorPalette?.surface || '#E4E4E7',
    '--color-dt-accent': colorPalette?.accent || '#E11D48',
    '--dt-font-heading': designConfig?.font_heading ? `"${designConfig.font_heading}", sans-serif` : 'inherit',
    '--dt-radius': designConfig?.radius || '0px',
    backgroundColor: 'var(--color-dt-bg)',
    color: 'var(--color-dt-text)'
  } as React.CSSProperties;

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center pb-24 pt-32 overflow-hidden" style={dynamicStyles}>
      
      {/* 1. STATICKÉ SOUSTŘEDNÉ KRUŽNICE */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]"
        style={{ backgroundImage: 'repeating-radial-gradient(circle at 60% 50%, transparent, transparent 40px, var(--color-dt-text) 40px, var(--color-dt-text) 41px)' }}
      />

      {/* 2. ROTUJÍCÍ RADAROVÝ PAPRSEK (OBŘÍ ROZMĚR) */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute z-0 pointer-events-none mix-blend-color-burn dark:mix-blend-color-dodge opacity-50"
        style={{ 
          // Nastavíme gigantickou velikost, aby ořez nikdy nedosáhl na hranu monitoru
          width: '200vmax',
          height: '200vmax',
          // Vycentrujeme střed tohoto gigantického čtverce přesně na 60% a 50% rodiče
          left: 'calc(60% - 100vmax)',
          top: 'calc(50% - 100vmax)',
          // Necháme ho rotovat přesně kolem svého středu
          transformOrigin: 'center center',
          // Delší plynulý ocas radaru (transparentní až do 260 stupňů)
          background: 'conic-gradient(from 0deg, transparent 0deg, transparent 260deg, var(--color-dt-accent) 360deg)' 
        }}
      />

      {/* 3. MASKUJÍCÍ GRADIENTY */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-dt-bg)] via-transparent to-[var(--color-dt-bg)] z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-dt-bg)]/20 via-[var(--color-dt-bg)]/60 to-[var(--color-dt-bg)] z-0 pointer-events-none" />

      {/* OBSAHOVÁ ČÁST */}
      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="w-full max-w-[1400px] mx-auto px-6 relative z-10">
        
        {/* TEXTY */}
        <motion.div variants={fadeUpVariant} className="max-w-[1000px]">
          <h2 className="text-3xl md:text-5xl font-bold tracking-wide mb-2 opacity-80">
            {content.headingSmall}
          </h2>
          
          <div className="relative mb-6">
            <h1 
              className="text-[4rem] sm:text-[6rem] md:text-[8rem] font-black tracking-tighter leading-[0.9]"
              style={{ 
                fontFamily: 'var(--dt-font-heading)',
                color: 'var(--color-dt-accent)',
                paddingBottom: '0.1em' // Přidáno bezpečné odsazení zespodu, aby se neschovalo "y"
              }}
            >
              {content.headingLarge}
            </h1>
            {/* Tlustá industriální dělící čára (Nyní je těsně pod textem, bez ořezávání textu) */}
            <div className="absolute bottom-0 left-0 w-[200vw] h-[3px] bg-[var(--color-dt-text)]/80"></div>
          </div>

          <div className="flex items-center gap-4 mt-8">
            <ArrowRight className="w-6 h-6 shrink-0" strokeWidth={2} style={{ color: 'var(--color-dt-accent)' }} />
            <p className="text-lg md:text-2xl font-light tracking-wide opacity-80">
              {content.subtitle}
            </p>
          </div>
        </motion.div>

        {/* VYHLEDÁVÁNÍ A AKCE */}
        <motion.div variants={fadeUpVariant} className="flex flex-col md:flex-row gap-4 mt-20 max-w-[800px]">
          
          {/* SEARCH INPUT */}
          <div className="relative flex-grow group">
            <input 
              type="text" 
              placeholder={content.placeholder} 
              className="w-full bg-[var(--color-dt-surface)]/50 border backdrop-blur-sm px-6 py-4 focus:outline-none transition-colors border-[var(--color-dt-text)]/20 focus:border-[var(--color-dt-accent)]"
              style={{ 
                color: 'var(--color-dt-text)',
                borderRadius: 'var(--dt-radius)'
              }}
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 group-focus-within:text-[var(--color-dt-accent)] transition-all w-5 h-5" strokeWidth={2} />
          </div>
          
          {/* TLAČÍTKA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              className="px-8 py-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] transition-all hover:scale-105 active:scale-95 border border-[var(--color-dt-text)]/10"
              style={{ 
                backgroundColor: 'var(--color-dt-surface)', 
                color: 'var(--color-dt-text)',
                borderRadius: 'var(--dt-radius)'
              }}
            >
              {content.btn1}
            </button>
            <button 
              className="px-8 py-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] transition-all hover:scale-105 active:scale-95 shadow-lg"
              style={{ 
                backgroundColor: 'var(--color-dt-accent)', 
                color: 'var(--color-dt-bg)',
                borderRadius: 'var(--dt-radius)'
              }}
            >
              {content.btn2}
            </button>
          </div>

        </motion.div>
      </motion.div>
    </section>
  );
}