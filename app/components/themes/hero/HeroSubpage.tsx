"use client";

import { motion, Variants } from "framer-motion";
import React from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const paddingMap: Record<string, string> = {
  S: 'pt-32 pb-12',
  M: 'pt-40 pb-16',
  L: 'pt-48 pb-24',
};

const alignMap: Record<string, string> = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right',
};

export default function HeroSubpage({ 
  data, 
  designConfig,
  colorPalette,
}: { 
  data?: any;
  designConfig?: any;
  colorPalette?: any;
}) {
  
  const content = {
    badge: data?.badge || "Naše služby",
    headingMain: data?.headingMain || "Jak vám můžeme",
    headingAccent: data?.headingAccent || "pomoci?",
    description: data?.description || "Prohlédněte si přehled našich služeb a zjistěte, co pro vás můžeme udělat.",
    align: data?.align || 'center',
    padding: data?.padding || 'M'
  };

  const alignClass = alignMap[content.align] || alignMap['center'];
  const paddingClass = paddingMap[content.padding] || paddingMap['M'];

  const dynamicStyles = {
    '--color-dt-bg': colorPalette?.bg || '#ffffff',
    '--color-dt-text': colorPalette?.text || '#18181B',
    '--color-dt-surface': colorPalette?.surface || '#f4f4f5',
    '--color-dt-accent': colorPalette?.accent || '#8E44ED',
    '--dt-font-heading': designConfig?.font_heading ? `"${designConfig.font_heading}", sans-serif` : 'inherit',
    backgroundColor: 'var(--color-dt-bg)',
    color: 'var(--color-dt-text)'
  } as React.CSSProperties;

  return (
    <section 
      className={`relative w-full border-b border-[var(--color-dt-text)]/10 flex flex-col ${paddingClass} transition-colors duration-500`} 
      style={dynamicStyles}
    >
      <div className="max-w-5xl mx-auto px-6 w-full z-10 relative">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
          className={`flex flex-col ${alignClass}`}
        >
          {content.badge && (
            <motion.div variants={fadeUp} className="mb-8">
              <span className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-[var(--color-dt-text)]/20 rounded-full text-[var(--color-dt-text)]/60">
                {content.badge}
              </span>
            </motion.div>
          )}

          <motion.h1 
            variants={fadeUp} 
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.1]"
            style={{ fontFamily: 'var(--dt-font-heading)' }}
          >
            {content.headingMain} <span style={{ color: 'var(--color-dt-accent)' }}>{content.headingAccent}</span>
          </motion.h1>

          {content.description && (
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-[var(--color-dt-text)]/60 font-light max-w-2xl leading-relaxed mt-2">
              {content.description}
            </motion.p>
          )}
        </motion.div>
      </div>
      
      {/* Jemný gradient dole, aby sekce hezky navazovala na zbytek stránky */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[var(--color-dt-text)]/5 to-transparent pointer-events-none" />
    </section>
  );
}