"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const widthMap: Record<string, string> = {
  '100': 'max-w-full',
  '80': 'max-w-[1400px]',
  '60': 'max-w-7xl',
  '50': 'max-w-5xl',
};

export default function HeroSplit({ data, designConfig, colorPalette }: { data?: any, designConfig?: any, colorPalette?: any }) {
  
  const content = {
    layout: data?.layout || 'normal',
    imageRatio: data?.imageRatio || 'aspect-square',
    badge: data?.badge || "Wireframe mód",
    heading: data?.heading || "Základní",
    headingAccent: data?.headingAccent || "rozložení",
    description: data?.description || "Toto je strukturální komponenta Hero Split. Text je na jedné straně, mediální obsah na druhé.",
    btnPrimary: data?.btnPrimary || "Hlavní akce",
    btnSecondary: data?.btnSecondary || "Sekundární",
    image: data?.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000",
    bg_type: data?.bg_type || 'none',
  };

  const targetWidth = designConfig?.content_width || '60';
  const widthClass = widthMap[targetWidth] || widthMap['60'];

  const dynamicStyles = {
    '--color-dt-bg': colorPalette?.bg || '#ffffff',
    '--color-dt-text': colorPalette?.text || '#1a1a1a',
    '--color-dt-surface': colorPalette?.surface || '#f4f4f5',
    '--color-dt-accent': colorPalette?.accent || '#3b82f6',
    '--dt-font-heading': designConfig?.font_heading ? `"${designConfig.font_heading}", sans-serif` : 'inherit',
    '--dt-radius': designConfig?.radius || '0.5rem',
  } as React.CSSProperties;

  const isReversed = content.layout === 'reversed';

  // Pokud je globální radius nastaven na "Full" (9999px), 
  // pro velký obrázek ho zastropujeme na 2rem (32px), aby nevznikl ovál.
  const globalRadius = designConfig?.radius || '0.5rem';
  const imageRadius = globalRadius === '9999px' ? '2rem' : globalRadius;

  return (
    <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-[var(--color-dt-bg)] transition-colors duration-500" style={dynamicStyles}>
      
      {content.bg_type === 'gradient' && (
        <div 
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, var(--color-dt-accent), transparent)' }}
        />
      )}

      {/* TADY BYL TEN PŘEKLEP: Přidán $ před {widthClass} */}
      <div className={`relative z-10 mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${widthClass}`}>
        
        {/* TEXTOVÝ SLOUPEC */}
        <motion.div 
          initial={{ opacity: 0, x: isReversed ? 30 : -30 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6 }}
          className={`flex flex-col items-start text-left ${isReversed ? 'lg:order-last' : 'lg:order-first'}`}
        >
          {content.badge && (
            <span className="inline-block py-1.5 px-3 mb-6 text-xs font-bold uppercase tracking-wider text-[var(--color-dt-accent)] bg-[var(--color-dt-accent)]/10" style={{ borderRadius: 'var(--dt-radius)' }}>
              {content.badge}
            </span>
          )}
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-[var(--color-dt-text)]" style={{ fontFamily: 'var(--dt-font-heading)' }}>
            {content.heading} <span style={{ color: 'var(--color-dt-accent)' }}>{content.headingAccent}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--color-dt-text)]/70 leading-relaxed mb-10 max-w-lg">
            {content.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            {content.btnPrimary && (
              <button className="px-8 py-4 font-bold transition-all hover:opacity-90 flex items-center gap-2"
                style={{ backgroundColor: 'var(--color-dt-accent)', color: 'var(--color-dt-bg)', borderRadius: 'var(--dt-radius)' }}
              >
                {content.btnPrimary} <ArrowRight className="w-5 h-5" />
              </button>
            )}
            {content.btnSecondary && (
              <button className="px-8 py-4 font-bold border border-[var(--color-dt-text)]/20 transition-all hover:bg-[var(--color-dt-surface)] text-[var(--color-dt-text)]"
                style={{ borderRadius: 'var(--dt-radius)' }}
              >
                {content.btnSecondary}
              </button>
            )}
          </div>
        </motion.div>

        {/* OBRÁZKOVÝ SLOUPEC */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`relative w-full ${content.imageRatio} ${isReversed ? 'lg:order-first' : 'lg:order-last'}`}
        >
          <div className="w-full h-full relative overflow-hidden bg-[var(--color-dt-surface)] shadow-2xl" style={{ borderRadius: imageRadius }}>
            <Image src={content.image} alt="Hero image" fill className="object-cover" priority />
            <div className="absolute inset-0 mix-blend-multiply opacity-10" style={{ backgroundColor: 'var(--color-dt-accent)' }} />
          </div>
        </motion.div>

      </div>
    </section>
  );
}