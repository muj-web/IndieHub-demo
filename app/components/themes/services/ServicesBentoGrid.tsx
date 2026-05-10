"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { ArrowRight, MonitorSmartphone, Sparkles, TrendingUp, Zap, Star, Shield, Box, Layout as LayoutIcon, Settings2 } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const widthMap: Record<string, string> = {
  '100': 'max-w-full px-4 md:px-8',
  '80': 'max-w-[1400px] px-6',
  '60': 'max-w-7xl px-6',
  '50': 'max-w-4xl px-4',
};

const iconDictionary: Record<string, React.ElementType> = {
  'Monitor': MonitorSmartphone,
  'Zap': Zap,
  'Sparkles': Sparkles,
  'TrendingUp': TrendingUp,
  'Star': Star,
  'Shield': Shield,
  'Box': Box,
  'Layout': LayoutIcon,
  'Settings': Settings2
};

interface ServicesBentoGridProps {
  data?: any;
  designConfig?: any;
  colorPalette?: any;
  projectName?: string;
}

export default function ServicesBentoGrid({ 
  data,
  designConfig,
  colorPalette, 
  projectName = "Projekt" 
}: ServicesBentoGridProps) {
  
  const content = {
    badge: data?.badge || "Naše služby",
    headingNormal: data?.headingNormal || "Komplexní řešení",
    headingAccent: data?.headingAccent || "pro váš digitální růst.",
    description: data?.description || `Navrhujeme systémy, které vizuálně ohromí a technologicky předběhnou konkurenci.`,
    services: data?.services && data.services.length > 0 ? data.services : [
      { icon: 'Monitor', title: "Webové aplikace na míru", desc: "Základní popis...", cardSize: "8" },
      { icon: 'TrendingUp', title: "SEO & Výkon", desc: "Základní popis...", cardSize: "4" }
    ]
  };

  const targetWidth = designConfig?.content_width || data?.content_width || '80';
  const widthClass = widthMap[targetWidth] || widthMap['80'];

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
    <section className="relative py-32 overflow-hidden transition-colors duration-500" style={dynamicStyles}>
      
      <div 
        className="absolute top-0 right-0 w-[800px] h-[800px] blur-[150px] opacity-10 pointer-events-none -translate-y-1/2 translate-x-1/3 transition-colors duration-500"
        style={{ backgroundColor: 'var(--color-dt-accent)' }}
      />

      <div className={`mx-auto relative z-10 px-6 md:px-8 ${widthClass}`}>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-20 max-w-3xl"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
            <div className="h-[2px] w-12 transition-colors duration-500" style={{ backgroundColor: 'var(--color-dt-accent)' }} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
              {content.badge}
            </span>
          </motion.div>

          <motion.h2 
            variants={fadeUp} 
            className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tight"
            style={{ fontFamily: 'var(--dt-font-heading)' }}
          >
            {content.headingNormal}<br />
            <span className="transition-colors duration-500" style={{ color: 'var(--color-dt-accent)' }}>{content.headingAccent}</span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-lg opacity-70 leading-relaxed">
            {content.description}
          </motion.p>
        </motion.div>

        {/* BENTO GRID - TADY JE TEN OPRAVENÝ 12SLOUPCOVÝ GRID */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-12 gap-6"
        >
          {content.services.map((service: any, i: number) => {
            const Icon = iconDictionary[service.icon] || Box;
            
            // 12-column mapování (včetně starých fallbacků z DB)
            const sizeMap: Record<string, string> = {
              '3': 'col-span-12 md:col-span-6 lg:col-span-3', // 1/4 (25%)
              '4': 'col-span-12 md:col-span-6 lg:col-span-4', // 1/3 (33%)
              '6': 'col-span-12 md:col-span-6 lg:col-span-6', // 1/2 (50%)
              '8': 'col-span-12 md:col-span-12 lg:col-span-8',// 2/3 (66%)
              '12': 'col-span-12',                            // 100%
              // Backwards compatibility s původními texty:
              '1': 'col-span-12 md:col-span-6 lg:col-span-4', // Fallback na 1/3
              '2': 'col-span-12 md:col-span-12 lg:col-span-8',// Fallback na 2/3
              'small': 'col-span-12 md:col-span-6 lg:col-span-4', // Záchrana pro stará data
              'large': 'col-span-12 md:col-span-12 lg:col-span-8',// Záchrana pro stará data
            };
            
            // Default je třetina (4), pokud by byla hodnota v DB rozbitá
            const colSpanClass = sizeMap[service.cardSize] || sizeMap['4'];
            
            return (
              <motion.div 
                key={i}
                variants={fadeUp}
                className={`group relative overflow-hidden flex flex-col p-10 border border-[var(--color-dt-text)]/10 bg-[var(--color-dt-surface)]/40 backdrop-blur-xl hover:bg-[var(--color-dt-surface)]/80 transition-colors duration-500 cursor-pointer ${colSpanClass}`}
                style={{ borderRadius: 'min(var(--dt-radius, 0.75rem), 2rem)' }}
              >
                <div 
                  className="absolute -top-24 -right-24 w-64 h-64 blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                  style={{ backgroundColor: 'var(--color-dt-accent)' }}
                />

                <div className="relative z-10 flex flex-col h-full">
                  <div 
                    className="w-14 h-14 flex items-center justify-center mb-8 border border-[var(--color-dt-text)]/5 bg-[var(--color-dt-bg)] group-hover:scale-110 transition-all duration-500 origin-left"
                    style={{ borderRadius: 'var(--dt-radius)' }}
                  >
                    <Icon className="w-6 h-6 transition-colors duration-500" style={{ color: 'var(--color-dt-accent)' }} />
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight" style={{ fontFamily: 'var(--dt-font-heading)' }}>
                    {service.title}
                  </h3>
                  
                  <p className="text-[var(--color-dt-text)] opacity-60 font-light leading-relaxed flex-grow">
                    {service.desc}
                  </p>

                  <div className="mt-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-all duration-300" style={{ color: 'var(--color-dt-accent)' }}>
                    Více informací 
                    <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}