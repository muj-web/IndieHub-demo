"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import React from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

interface HeroNeonProps {
  data?: any;
  designConfig?: any;
  colorPalette?: any;
}

export default function HeroNeon({ data, designConfig, colorPalette }: HeroNeonProps) {
  
  const content = {
    badge: data?.badge || "Specialista na moderní digitální řešení",
    headingMain: data?.headingMain || "Design budoucnosti",
    headingAccent: data?.headingAccent || "v novém standardu.",
    description: data?.description || "Design, který zaujme. Kód, který letí rychlostí blesku. A strategie, která vaše zákazníky přivede rovnou k vám.",
    btnPrimary: data?.btnPrimary || "Začít projekt",
    btnSecondary: data?.btnSecondary || "Co umím"
  };

  const dynamicStyles = {
    '--color-dt-bg': colorPalette?.bg || '#09090B',
    '--color-dt-text': colorPalette?.text || '#FAFAFA',
    '--color-dt-accent': colorPalette?.accent || '#8E44ED',
    '--color-dt-surface': colorPalette?.surface || '#18181B',
    '--dt-font-heading': designConfig?.font_heading ? `"${designConfig.font_heading}", sans-serif` : 'inherit',
    '--dt-radius': designConfig?.radius || '1rem',
    backgroundColor: 'var(--color-dt-bg)',
    color: 'var(--color-dt-text)'
  } as React.CSSProperties;

  return (
    <section className="relative pt-48 pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[95vh]" style={dynamicStyles}>
      
      {/* 1. MASIVNÍ ORGANICKÁ ZÁŘE */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full blur-[160px] pointer-events-none opacity-20 transition-all duration-1000"
        style={{ backgroundColor: 'var(--color-dt-accent)' }}
      />
      
      {/* 2. JEMNÁ MŘÍŽKA NA POZADÍ */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{ 
          backgroundImage: `linear-gradient(to right, var(--color-dt-text) 1px, transparent 1px), linear-gradient(to bottom, var(--color-dt-text) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} 
      />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 text-center">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {/* BADGE */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-dt-text)]/10 bg-[var(--color-dt-surface)]/50 backdrop-blur-md mb-10">
            <Sparkles size={14} style={{ color: 'var(--color-dt-accent)' }} />
            <span className="text-[var(--color-dt-text)] opacity-60 uppercase tracking-[0.2em] text-[10px] font-bold">
              {content.badge}
            </span>
          </motion.div>
          
          {/* NADPIS */}
          <motion.h1 
            variants={fadeUp} 
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.05] tracking-tighter"
            style={{ fontFamily: 'var(--dt-font-heading)' }}
          >
            {content.headingMain}<br />
            <span 
              className="text-transparent bg-clip-text bg-gradient-to-r transition-all duration-1000"
              style={{ 
                backgroundImage: `linear-gradient(to right, var(--color-dt-accent), var(--color-dt-text) 50%, var(--color-dt-accent))` 
              }}
            >
              {content.headingAccent}
            </span>
          </motion.h1>
          
          {/* DESCRIPTION */}
          <motion.p variants={fadeUp} className="text-[var(--color-dt-text)] opacity-60 text-lg md:text-xl font-light mb-14 leading-relaxed max-w-2xl mx-auto">
            {content.description}
          </motion.p>
          
          {/* AKCE */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            
            {/* PRIMÁRNÍ TLAČÍTKO - Nyní čisté a výrazné */}
            <button 
              className="w-full sm:w-auto px-10 py-5 transition-all duration-300 hover:scale-105 active:scale-95 uppercase tracking-widest text-[11px] font-black"
              style={{ 
                backgroundColor: 'var(--color-dt-accent)', 
                color: 'var(--color-dt-bg)',
                borderRadius: 'var(--dt-radius)',
                boxShadow: `0 20px 40px -10px var(--color-dt-accent)80`
              }}
            >
              {content.btnPrimary}
            </button>

            {/* SEKUNDÁRNÍ TLAČÍTKO - S akcentním laserem na hover */}
            <button 
              className="group relative w-full sm:w-auto px-10 py-5 overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-lg"
              style={{ borderRadius: 'var(--dt-radius)' }}
            >
              {/* Statický rámeček v klidu */}
              <div 
                className="absolute inset-0 opacity-100 group-hover:opacity-0 transition-opacity duration-300"
                style={{ 
                  border: '1px solid color-mix(in srgb, var(--color-dt-text) 20%, transparent)', 
                  borderRadius: 'var(--dt-radius)' 
                }}
              />

              {/* Laserový paprsek v akcentní barvě - viditelný pouze na hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div 
                  className="absolute inset-[-500%] animate-[spin_2.5s_linear_infinite]" 
                  style={{ background: 'conic-gradient(from 0deg, transparent 0deg, transparent 300deg, var(--color-dt-accent) 360deg)' }} 
                />
              </div>
              
              {/* Vnitřní vrstva tlačítka, maskuje vnitřek aby svítil jen okraj */}
              <div 
                className="absolute inset-[2px] z-10 transition-colors duration-300 group-hover:bg-[var(--color-dt-surface)]/20" 
                style={{ 
                  backgroundColor: 'var(--color-dt-bg)', 
                  borderRadius: 'calc(var(--dt-radius) - 2px)' 
                }} 
              />
              
              {/* Obsah tlačítka */}
              <span className="relative z-20 uppercase tracking-widest text-[11px] font-black text-[var(--color-dt-text)] flex items-center gap-3">
                {content.btnSecondary} 
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" style={{ color: 'var(--color-dt-accent)' }} />
              </span>
            </button>

          </motion.div>
        </motion.div>
      </div>

      {/* CSS ANIMACE PRO ROTACI LASERU */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}