"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ShieldCheck, Zap, Star, CheckCircle2, Shield, MonitorSmartphone, TrendingUp, Sparkles, Box, Settings2, Code, Smartphone, Globe, Plane } from "lucide-react";

// 1. SLOVNÍK IKON (Abychom mohli překládat text z DB na skutečné ikony)
const iconDictionary: Record<string, React.ElementType> = {
  'Monitor': MonitorSmartphone, 'Zap': Zap, 'Sparkles': Sparkles, 
  'TrendingUp': TrendingUp, 'Star': Star, 'Shield': Shield, 'ShieldCheck': ShieldCheck,
  'Box': Box, 'Layout': Box, 'Settings': Settings2, 'CheckCircle2': CheckCircle2,
  'Code': Code, 'Smartphone': Smartphone, 'Globe': Globe, 'Plane': Plane
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

interface HeroCircleProps {
  data?: any;
  designConfig?: any;
  colorPalette?: any;
  projectName?: string;
}

export default function HeroCircle({ 
  data, 
  designConfig,
  colorPalette,
  projectName = "Projekt" 
}: HeroCircleProps) {
  
  const [activeIndex, setActiveIndex] = useState(0);

  // 2. NAPOJENÍ NA SCHÉMA (Čtení z DB, podpora pro neomezený počet položek)
  const content = {
    badge: data?.badge || "Profesionální služby",
    headingNormal: data?.headingMain || projectName,
    headingAccent: data?.headingAccent || "Expertíza v detailu.",
    description: data?.description || "Pomáhám firmám i jednotlivcům růst díky moderním postupům a individuálnímu přístupu.",
    btnPrimary: data?.btnPrimary || "Naše služby",
    btnSecondary: data?.btnSecondary || "Kontakt",
    items: data?.orbitItems && data.orbitItems.length > 0 ? data.orbitItems : [
      { icon: "ShieldCheck", label: "Bezpečnost", detailDesc: "Maximální ochrana vašich dat a procesů dle nejnovějších legislativních standardů." },
      { icon: "Zap", label: "Rychlost", detailDesc: "Optimalizované postupy, které šetří váš čas a přinášejí výsledky." },
      { icon: "Star", label: "Kvalita", detailDesc: "Nekompromisní důraz na detail a prémiové zpracování každého výstupu." },
      { icon: "CheckCircle2", label: "Preciznost", detailDesc: "Přesnost v každém čísle a faktu, na kterou se můžete spolehnout." },
    ]
  };

  const dynamicStyles = {
    '--color-dt-bg': colorPalette?.bg || '#F4F4F5',
    '--color-dt-text': colorPalette?.text || '#18181B',
    '--color-dt-surface': colorPalette?.surface || '#E4E4E7',
    '--color-dt-accent': colorPalette?.accent || '#8E44ED',
    '--dt-font-heading': designConfig?.font_heading ? `"${designConfig.font_heading}", sans-serif` : 'inherit',
    '--dt-radius': designConfig?.radius || '1rem',
    backgroundColor: 'var(--color-dt-bg)',
    color: 'var(--color-dt-text)'
  } as React.CSSProperties;

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 overflow-hidden" style={dynamicStyles}>
      
      {/* VELKÉ DEKORAČNÍ KRUHY NA POZADÍ */}
      <div className="absolute top-1/2 right-0 translate-x-1/3 -translate-y-1/2 w-[1000px] h-[1000px] border border-[var(--color-dt-text)]/[0.03] rounded-full pointer-events-none" />

      {/* TADY POUŽIJEME 12SLOUPCOVÝ GRID */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-12 gap-12 lg:gap-20 items-center">
        
        {/* LEVÁ STRANA: TEXTY (7/12 na desktopu ať má text trochu víc místa) */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } } as Variants}
          className="col-span-12 lg:col-span-6 xl:col-span-7"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
            <div className="h-[1px] w-12" style={{ backgroundColor: 'var(--color-dt-accent)' }} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">{content.badge}</span>
          </motion.div>

          <motion.h1 
            variants={fadeUp} 
            className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight"
            style={{ fontFamily: 'var(--dt-font-heading)' }}
          >
            {content.headingNormal}<br />
            <span style={{ color: 'var(--color-dt-accent)' }}>{content.headingAccent}</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg opacity-70 mb-10 leading-relaxed max-w-xl">
            {content.description}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <button 
              className="px-10 py-5 font-bold text-xs uppercase tracking-widest transition-transform hover:scale-105 shadow-xl"
              style={{ 
                backgroundColor: 'var(--color-dt-accent)', 
                color: 'var(--color-dt-bg)',
                borderRadius: 'var(--dt-radius)' 
              }}
            >
              {content.btnPrimary}
            </button>
            <button 
              className="px-10 py-5 border border-[var(--color-dt-text)]/10 bg-[var(--color-dt-surface)]/30 backdrop-blur-sm font-bold text-xs uppercase tracking-widest hover:bg-[var(--color-dt-surface)]/60 transition-all"
              style={{ borderRadius: 'var(--dt-radius)' }} 
            >
              {content.btnSecondary}
            </button>
          </motion.div>
        </motion.div>

        {/* PRAVÁ STRANA: TVŮJ ČISTÝ KRUH S ROTUJÍCÍ LINKOU A DYNAMICKÝM ORBITEM */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-5 relative flex items-center justify-center h-[400px] md:h-[500px] w-full max-w-[500px] mx-auto mt-12 lg:mt-0">
          
          {/* 1. ZÁKLADNÍ STATICKÝ KRUH */}
          <div className="absolute inset-4 border border-[var(--color-dt-text)]/10 rounded-full pointer-events-none" />

          {/* 2. TVOJE ROTUJÍCÍ NEÚPLNÁ LINKA */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 pointer-events-none"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible opacity-50">
              <circle cx="50" cy="50" r="50" fill="none" stroke="var(--color-dt-accent)" strokeWidth="0.5" strokeDasharray="120 200" strokeLinecap="round" />
            </svg>
          </motion.div>

          {/* 3. STŘEDOVÝ OBSAH (Reaguje na activeIndex) */}
          <div 
            className="relative z-20 w-56 h-56 md:w-64 md:h-64 bg-[var(--color-dt-bg)] border border-[var(--color-dt-text)]/5 shadow-2xl flex items-center justify-center p-8 text-center overflow-hidden"
            style={{ borderRadius: 'var(--dt-radius)' }} 
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative z-10"
              >
                <div className="mb-4 flex justify-center">
                  {(() => {
                    const ActiveIcon = iconDictionary[content.items[activeIndex]?.icon] || Shield;
                    return <ActiveIcon className="w-8 h-8" style={{ color: 'var(--color-dt-accent)' }} />;
                  })()}
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 tracking-tight">{content.items[activeIndex]?.label}</h3>
                <p className="text-[10px] md:text-[11px] opacity-60 leading-relaxed">
                  {content.items[activeIndex]?.detailDesc || content.items[activeIndex]?.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 4. DYNAMICKÁ MATEMATIKA PRO OBVOD KRUHU */}
          {content.items.map((item: any, index: number) => {
            const Icon = iconDictionary[item.icon] || Star;
            const isActive = activeIndex === index;
            
            // Dokonalý výpočet pozice na kruhu nezávisle na počtu prvků!
            const total = content.items.length;
            const angle = (index * (360 / total)) - 90; 
            // Vypočteme si poloměr (radius) tak, aby to sedělo přesně na tu tvou vodící linku
            const orbitRadius = 234; 

            // Dynamické umístění popisku (aby nelezl do středu kruhu)
            const isRightSide = angle > -89 && angle < 89;
            const isBottom = angle > 45 && angle < 135;

            return (
              <div
                key={index}
                className="absolute z-30 flex items-center justify-center group cursor-pointer"
                style={{ 
                  // Kouzlo CSS transform: Orotuj se, odjeď po poloměru a narovnej se zpátky
                  transform: `rotate(${angle}deg) translate(${orbitRadius}px) rotate(${-angle}deg)`,
                }}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {/* Ikona s tvými styly */}
                <motion.div 
                  className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center transition-all duration-300 relative z-10 ${
                    isActive ? 'shadow-xl scale-125' : 'hover:scale-110'
                  }`}
                  style={{ 
                    backgroundColor: isActive ? 'var(--color-dt-accent)' : 'var(--color-dt-surface)',
                    color: isActive ? 'var(--color-dt-bg)' : 'var(--color-dt-text)',
                    border: `1px solid ${isActive ? 'transparent' : 'var(--color-dt-text)1A'}`,
                    borderRadius: 'var(--dt-radius)' 
                  }}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </motion.div>
                
                {/* Dynamicky pozicovaný popisek (vyhýbá se středu) */}
                <span className={`absolute whitespace-nowrap text-[10px] font-bold uppercase tracking-widest transition-opacity duration-300 pointer-events-none hidden md:block ${
                  isActive ? 'opacity-0' : 'opacity-40 group-hover:opacity-100'
                } ${
                  isRightSide ? 'left-full ml-4' : 'right-full mr-4'
                } ${
                  isBottom ? 'mt-8' : ''
                }`}>
                  {item.label}
                </span>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}