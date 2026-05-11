"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion"; 
import { ArrowRight, PlayCircle } from "lucide-react";

// 1. Lookup objekty pro T-Shirt Sizing a rozložení
const paddingMap: Record<string, string> = {
  S: 'min-h-[60vh] pb-12 pt-32', 
  M: 'min-h-[85vh] pb-24 pt-32', 
  L: 'min-h-[100vh] pb-32 pt-32', 
};

// 2. UNIFIKOVANÝ LOOKUP PRO ŠÍŘKU OBSAHU (Stejný jako v Services)
const widthMap: Record<string, string> = {
  '100': 'max-w-full w-full',
  '80': 'max-w-[1400px] w-full',
  '60': 'max-w-7xl w-full', // 1280px (Standard)
  '50': 'max-w-5xl w-full', // 1024px
};

const alignMap: Record<string, string> = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right',
};

const badgeAlignMap: Record<string, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function HeroCinematic({ 
  data, 
  designConfig,
  colorPalette, // Přidáno pro konzistenci
  projectName = "Název projektu" 
}: { 
  data?: any, 
  designConfig?: any,
  colorPalette?: any,
  projectName?: string
}) {
  const content = {
    badge: data?.badge || "Nová webová prezentace",
    headingMain: data?.headingMain || projectName,
    headingAccent: data?.headingAccent || "Moderní design.",
    description: data?.description || "Zde bude hlavní úvodní text vašeho nového webu. Tento prostor slouží k rychlému představení vaší značky, hlavních služeb a přidané hodnoty pro vaše zákazníky.",
    btnPrimary: data?.btnPrimary || "Tlačítko 1",
    btnSecondary: data?.btnSecondary || "Tlačítko 2",
    
    bg_type: data?.bg_type || 'image',
    bg_src: data?.bg_src || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
    padding: data?.padding || 'L',
    align: data?.align || 'center',
  };

  const paddingClass = paddingMap[content.padding] || paddingMap['L'];
  const alignClass = alignMap[content.align] || alignMap['center'];
  const badgeAlignClass = badgeAlignMap[content.align] || badgeAlignMap['center'];
  
  // Aplikace správné šířky z configu
  const targetWidth = designConfig?.content_width || data?.content_width || '60';
  const widthClass = widthMap[targetWidth] || widthMap['60'];

  // INJEKCE CSS PROMĚNNÝCH (Stejně jako u Services)
  const dynamicStyles = {
    '--color-dt-bg': colorPalette?.bg || '#ffffff',
    '--color-dt-text': colorPalette?.text || '#18181B',
    '--color-dt-surface': colorPalette?.surface || '#f4f4f5',
    '--color-dt-accent': colorPalette?.accent || '#8E44ED',
    '--dt-font-heading': designConfig?.font_heading ? `"${designConfig.font_heading}", sans-serif` : 'inherit',
    '--dt-radius': designConfig?.radius || '0.75rem',
    backgroundColor: 'var(--color-dt-bg)',
    color: 'var(--color-dt-text)'
  } as React.CSSProperties;

  return (
    <section className={`relative w-full flex items-end justify-center overflow-hidden ${paddingClass}`} style={dynamicStyles}>
      
      {/* DYNAMICKÁ POZADÍ */}
      <div className="absolute inset-0 z-0">
        {content.bg_type === 'image' && content.bg_src && (
          <motion.div 
            initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 2, ease: "easeOut" }}
            className="w-full h-full"
          >
            <Image 
              src={content.bg_src} alt="Hero Background" fill priority
              className="object-cover opacity-80 grayscale" 
            />
          </motion.div>
        )}

        {content.bg_type === 'video' && content.bg_src && (
          <video 
            autoPlay loop muted playsInline
            className="w-full h-full object-cover opacity-80 grayscale"
            src={content.bg_src}
          />
        )}

        {content.bg_type === 'gradient' && (
          <div 
            className="w-full h-full opacity-50"
            style={{ background: 'linear-gradient(135deg, var(--color-dt-bg), var(--color-dt-accent))' }}
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dt-bg)] via-[var(--color-dt-bg)]/60 to-transparent" />
      </div>

      {/* OBSAHOVÁ ČÁST - px-6 md:px-8 pro dokonalé lícování okrajů */}
      <div className="relative z-10 w-full px-6 md:px-8">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
          // Aplikace sjednocené šířky
          className={`flex flex-col ${alignClass} mx-auto ${widthClass}`}
        >
          {/* BADGE */}
          <motion.div variants={fadeUpVariant} className={`mb-6 flex w-full ${badgeAlignClass}`}>
            <span 
              className="bg-[var(--color-dt-surface)]/80 backdrop-blur-md border border-[var(--color-dt-text)]/10 text-[var(--color-dt-text)] px-4 py-1.5 text-xs font-semibold tracking-widest uppercase flex items-center gap-2"
              style={{ borderRadius: 'var(--dt-radius)' }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-dt-accent)' }} />
              {content.badge}
            </span>
          </motion.div>

          {/* NADPIS */}
          <motion.h1 
            variants={fadeUpVariant} 
            className="text-6xl md:text-8xl font-bold tracking-tighter text-[var(--color-dt-text)] leading-[1.05] mb-8 drop-shadow-lg"
            style={{ fontFamily: 'var(--dt-font-heading)' }}
          >
            {content.headingMain} <br />
            <span style={{ color: 'var(--color-dt-accent)' }}>{content.headingAccent}</span>
          </motion.h1>

          <motion.p variants={fadeUpVariant} className="text-xl md:text-2xl text-[var(--color-dt-text)]/80 font-light mb-10 leading-relaxed">
            {content.description}
          </motion.p>

          <motion.div variants={fadeUpVariant} className={`flex flex-col sm:flex-row items-center gap-4 w-full ${badgeAlignClass}`}>
            {/* TLAČÍTKO PRIMÁRNÍ */}
            <button 
              className="px-8 py-4 text-[15px] font-semibold transition-all flex items-center gap-2 hover:gap-4 w-full sm:w-auto justify-center"
              style={{ 
                backgroundColor: 'var(--color-dt-accent)', 
                color: 'var(--color-dt-bg)',
                borderRadius: 'var(--dt-radius)' 
              }}
            >
              {content.btnPrimary} <ArrowRight className="w-5 h-5" />
            </button>
            
            {/* TLAČÍTKO SEKUNDÁRNÍ */}
            <button 
              className="bg-[var(--color-dt-surface)]/50 backdrop-blur-md border border-[var(--color-dt-text)]/20 text-[var(--color-dt-text)] px-8 py-4 text-[15px] font-semibold hover:bg-[var(--color-dt-surface)] transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
              style={{ borderRadius: 'var(--dt-radius)' }}
            >
              <PlayCircle className="w-5 h-5" /> {content.btnSecondary}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}