"use client";

import { motion, Variants } from "framer-motion";
import { ArrowUpRight, Settings2, Wrench, TrainTrack, MonitorSmartphone, Sparkles, TrendingUp, Zap, Star, Shield, Box, Layout as LayoutIcon, Code, Smartphone, Globe, Plane } from "lucide-react";

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 20 } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const widthMap: Record<string, string> = {
  '100': 'max-w-full w-full',
  '80': 'max-w-[1400px] w-full',
  '60': 'max-w-7xl w-full',
  '50': 'max-w-5xl w-full',
};

// 1. SJEDNOCENÝ SLOVNÍK IKON (Aby ikony fungovaly napříč všemi 3 komponentami)
const iconDictionary: Record<string, React.ElementType> = {
  'Monitor': MonitorSmartphone, 'Zap': Zap, 'Sparkles': Sparkles, 
  'TrendingUp': TrendingUp, 'Star': Star, 'Shield': Shield, 
  'Box': Box, 'Layout': LayoutIcon, 'Settings': Settings2, 
  'Wrench': Wrench, 'Train': TrainTrack, 'Code': Code, 
  'Smartphone': Smartphone, 'Globe': Globe, 'Plane': Plane
};

interface ServicesUtilitarianProps {
  data?: any;
  designConfig?: any;
  colorPalette?: any;
  projectName?: string;
}

export default function ServicesUtilitarian({ 
  data,
  designConfig,
  colorPalette, 
  projectName = "Projekt" 
}: ServicesUtilitarianProps) {
  
  // Namapování dat (Stejná pole jako Bento a Clean Grid)
  const content = {
    badge: data?.badge || "",
    title: data?.headingNormal || data?.headingMain || data?.title || "Technologické divize",
    accent: data?.headingAccent || "",
    description: data?.description || "",
    services: data?.services && data.services.length > 0 ? data.services : [
      { icon: 'Settings', title: "Tryskací zařízení", desc: "Závěsná, průběžná, bubnová a stolová zařízení vlastní konstrukce.", cardSize: '4' },
      { icon: 'Wrench', title: "Zakázková kovovýroba", desc: "Zpracování plechů, trubek, profilů, obrábění, svařování a povrchové úpravy.", cardSize: '4' },
      { icon: 'Train', title: "Průmyslové stroje", desc: "Produkce komponentů nejvyšší kvality splňující ty nejpřísnější normy.", cardSize: '4' }
    ]
  };

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
    <section className="py-24 overflow-hidden transition-colors duration-500" style={dynamicStyles}>
      
      <div className={`mx-auto relative z-10 px-6 md:px-8 ${widthClass}`}>
        
        {/* HLAVIČKA */}
        <div className="mb-12 max-w-3xl">
          {content.badge && (
            <span className="text-[10px] font-mono text-[var(--color-dt-text)]/50 uppercase tracking-widest block mb-4">
              // {content.badge}
            </span>
          )}
          <h2 
            className="text-4xl md:text-5xl font-bold tracking-tighter mb-4"
            style={{ fontFamily: 'var(--dt-font-heading)' }}
          >
            {content.title} <span style={{ color: 'var(--color-dt-accent)' }}>{content.accent}</span>
          </h2>
          {content.description && (
             <p className="text-lg opacity-70 leading-relaxed font-light">{content.description}</p>
          )}
          
          {/* Technická vizuální linka */}
          <div className="w-full h-px bg-[var(--color-dt-text)]/20 mt-8 relative">
             <div className="absolute top-0 left-0 h-px w-24" style={{ backgroundColor: 'var(--color-dt-accent)' }} />
          </div>
        </div>

        {/* 12-COLUMN UTILITARIAN GRID */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          // Trik s gap-[1px] a barvou borderu vytvoří perfektní tenké čáry uvnitř gridu
          className="grid grid-cols-12 gap-[1px] border border-[var(--color-dt-text)]/20 bg-[var(--color-dt-text)]/20 overflow-hidden shadow-sm"
          style={{ borderRadius: 'var(--dt-radius)' }}
        >
          {content.services.map((div: any, i: number) => {
            const Icon = iconDictionary[div.icon] || Box;
            
            // Mapování velikostí pro 12sloupcový grid (stejné jako v Bento a Clean Grid)
            const sizeMap: Record<string, string> = {
              '3': 'col-span-12 md:col-span-6 lg:col-span-3', 
              '4': 'col-span-12 md:col-span-6 lg:col-span-4', 
              '6': 'col-span-12 md:col-span-6 lg:col-span-6', 
              '8': 'col-span-12 lg:col-span-8',
              '12': 'col-span-12',
              '1': 'col-span-12 md:col-span-6 lg:col-span-4', // Fallback
              '2': 'col-span-12 lg:col-span-8', // Fallback
            };
            
            const colSpanClass = sizeMap[div.cardSize] || sizeMap['4'];

            return (
              <motion.div 
                key={i} 
                variants={fadeUpVariant}
                // Každá karta má pozadí "surface", čímž překryje podklad a zanechá jen 1px čáry v mezerách
                className={`p-8 bg-[var(--color-dt-surface)] group hover:bg-[var(--color-dt-bg)] cursor-pointer transition-colors relative overflow-hidden ${colSpanClass}`}
              >
                {/* Šipka v rohu na hover */}
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                  <ArrowUpRight className="w-5 h-5" style={{ color: 'var(--color-dt-accent)' }} />
                </div>
                
                {/* Technická ikona */}
                <div className="w-12 h-12 bg-[var(--color-dt-bg)] border border-[var(--color-dt-text)]/20 flex items-center justify-center mb-6 transition-colors group-hover:border-transparent"
                  style={{ borderRadius: 'var(--dt-radius)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-dt-accent)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-dt-bg)' }}
                >
                  <Icon className="w-6 h-6 text-[var(--color-dt-text)]/70 transition-colors group-hover:text-[var(--color-dt-bg)]" />
                </div>
                
                <h3 
                  className="text-xl font-bold mb-3 tracking-tight"
                  style={{ fontFamily: 'var(--dt-font-heading)' }}
                >
                  {div.title}
                </h3>
                <p className="text-sm opacity-70 leading-relaxed font-light">{div.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}