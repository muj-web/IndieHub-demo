'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Code, Layout, Smartphone, Globe, Sparkles, Plane, MonitorSmartphone, TrendingUp, Zap, Star, Shield, Box, Settings2, ArrowRight } from 'lucide-react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const paddingMap: Record<string, string> = {
  S: 'py-16',
  M: 'py-24',
  L: 'py-32',
};

const alignMap: Record<string, string> = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
};

const widthMap: Record<string, string> = {
  '100': 'max-w-full w-full',
  '80': 'max-w-[1400px] w-full',
  '60': 'max-w-7xl w-full',
  '50': 'max-w-5xl w-full',
};

const iconDictionary: Record<string, React.ElementType> = {
  'Monitor': MonitorSmartphone, 'Zap': Zap, 'Sparkles': Sparkles, 
  'TrendingUp': TrendingUp, 'Star': Star, 'Shield': Shield, 
  'Box': Box, 'Layout': Layout, 'Settings': Settings2, 
  'Code': Code, 'Smartphone': Smartphone, 'Globe': Globe, 'Plane': Plane
};

interface ServicesGridProps {
  data?: any;
  designConfig?: any;
  colorPalette?: any;
  projectName?: string;
}

export default function ServicesGrid({ 
  data, 
  designConfig, 
  colorPalette, 
  projectName = 'Chameleon' 
}: ServicesGridProps) {
  
  const content = {
    badge: data?.badge || "",
    title: data?.headingNormal || data?.headingMain || data?.title || 'Naše Služby',
    accent: data?.headingAccent || "",
    description: data?.description || data?.subtitle || `Pomáháme projektům jako ${projectName} růst.`,
    bg_type: data?.bg_type || 'none',
    bg_src: data?.bg_src || '',
    padding: data?.padding || 'M',
    align: data?.align || 'center',
    services: data?.services && data.services.length > 0 ? data.services : [
      { icon: 'Code', title: 'Web Development', desc: 'Tvoříme rychlé a moderní weby.', cardSize: '4' },
      { icon: 'Layout', title: 'UI/UX Design', desc: 'Navrhujeme rozhraní, která lidé milují.', cardSize: '4' },
      { icon: 'Smartphone', title: 'Mobilní Aplikace', desc: 'Pro iOS i Android na míru.', cardSize: '4' },
    ],
  };

  const paddingClass = paddingMap[content.padding] || paddingMap['M'];
  const alignClass = alignMap[content.align] || alignMap['center'];
  const targetWidth = designConfig?.content_width || data?.content_width || '60';
  const widthClass = widthMap[targetWidth] || widthMap['60'];

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
    <section 
      className={`relative w-full flex flex-col ${paddingClass} overflow-hidden transition-colors duration-500`}
      style={dynamicStyles}
    >
      {/* POZADÍ */}
      {content.bg_type === 'image' && content.bg_src && (
        <div className="absolute inset-0 z-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: `url(${content.bg_src})` }} />
      )}
      {content.bg_type === 'video' && content.bg_src && (
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-10" src={content.bg_src} />
      )}
      {content.bg_type === 'gradient' && (
        <div className="absolute inset-0 z-0 opacity-30" style={{ background: 'linear-gradient(135deg, var(--color-dt-surface), var(--color-dt-bg))' }} />
      )}

      {/* OBSAHOVÁ ČÁST */}
      <div className={`relative z-10 mx-auto px-6 md:px-8 w-full flex flex-col ${widthClass}`}>
        
        {/* HLAVIČKA */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className={`mb-20 max-w-3xl flex flex-col ${alignClass} ${content.align === 'center' ? 'mx-auto' : ''}`}
        >
          {content.badge && (
            <motion.span variants={fadeUp} className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-50">
              {content.badge}
            </motion.span>
          )}
          <motion.h2 
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6"
            style={{ fontFamily: 'var(--dt-font-heading)' }}
          >
            {content.title} <span style={{ color: 'var(--color-dt-accent)' }}>{content.accent}</span>
          </motion.h2>
          {content.description && (
            <motion.p variants={fadeUp} className="text-lg md:text-xl opacity-60 font-light leading-relaxed">
              {content.description}
            </motion.p>
          )}
        </motion.div>

        {/* CLEAN LIST GRID - 12 sloupců */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-12 gap-y-6 gap-x-6"
        >
          {content.services.map((service: any, index: number) => {
            const IconComponent = iconDictionary[service.icon] || Box;

            // Mapování velikostí (sdílené s Bento Gridem)
            const sizeMap: Record<string, string> = {
              '3': 'col-span-12 lg:col-span-3', 
              '4': 'col-span-12 lg:col-span-4', 
              '6': 'col-span-12 lg:col-span-6', 
              '8': 'col-span-12 lg:col-span-8',
              '12': 'col-span-12',
              '1': 'col-span-12 lg:col-span-4', 
              '2': 'col-span-12 lg:col-span-8',
            };
            // Použijeme nastavenou velikost, jinak dáme na šířku 1/2 pro hezčí list layout
            const colSpanClass = sizeMap[service.cardSize] || 'col-span-12 lg:col-span-6';

            return (
              <motion.div
                key={index}
                variants={fadeUp}
                // TADY JE ZMĚNA: flex-col na mobilu, sm:flex-row na větším displeji. Přidán p-8 a border.
                className={`group relative flex flex-col sm:flex-row gap-6 items-start p-8 border border-[var(--color-dt-text)]/10 hover:bg-[var(--color-dt-text)]/5 transition-colors duration-300 ${colSpanClass}`}
                style={{ 
                  borderRadius: 'min(var(--dt-radius, 0.75rem), 2rem)'
                }}
              >
                {/* IKONA */}
                <div 
                  className="w-16 h-16 flex-shrink-0 flex items-center justify-center transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-xl"
                  style={{ 
                    backgroundColor: 'var(--color-dt-surface)',
                    color: 'var(--color-dt-accent)',
                    borderRadius: 'var(--dt-radius)',
                    boxShadow: '0 10px 30px -10px var(--color-dt-accent)20'
                  }}
                >
                  <IconComponent size={28} strokeWidth={1.5} className="transition-transform duration-500 group-hover:scale-110" />
                </div>

                {/* TEXTOVÁ ČÁST */}
                <div className="flex-1">
                  <h3 
                    className="text-2xl font-bold mb-3 tracking-tight group-hover:text-[var(--color-dt-accent)] transition-colors"
                    style={{ fontFamily: 'var(--dt-font-heading)' }}
                  >
                    {service.title}
                  </h3>
                  <p className="opacity-60 leading-relaxed font-light mb-6">
                    {service.desc}
                  </p>
                  
                  {/* Jemný odkaz prozkoumat */}
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" style={{ color: 'var(--color-dt-accent)' }}>
                    Prozkoumat <ArrowRight size={14} />
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