"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function HeroLuxury({ data, designConfig, colorPalette }: { data?: any, designConfig?: any, colorPalette?: any }) {
  const content = {
    badge: data?.badge || "Kadeřnický salon v Brně",
    headingMain: data?.headingMain || "Hair Play",
    headingAccent: data?.headingAccent || "Beauty is a game",
    btnPrimary: data?.btnPrimary || "Rezervace",
    btnUrl: data?.btnUrl || "/rezervace",
    bg_src: data?.bg_src || "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2938",
  };

  const dynamicStyles = {
    '--color-dt-bg': colorPalette?.bg || '#ffffff',
    '--color-dt-text': colorPalette?.text || '#1a1a1a',
    '--color-dt-accent': colorPalette?.accent || '#1D3B31', // Jejich tmavě zelená
    '--dt-font-heading': designConfig?.font_heading ? `"${designConfig.font_heading}", serif` : 'inherit',
    '--dt-radius': designConfig?.radius || '0px',
  } as React.CSSProperties;

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden" style={dynamicStyles}>
      {/* Parallax Pozadí */}
      <motion.div 
        initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <Image src={content.bg_src} alt="Salon" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/40" /> {/* Tmavý overlay pro čitelnost */}
      </motion.div>

      {/* Skleněný / Minimalistický Box uprostřed */}
      <div className="relative z-10 w-full px-6 max-w-4xl mx-auto text-center mt-20">
        <motion.div 
          initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
          className="bg-white/10 backdrop-blur-md border border-white/20 p-12 md:p-20"
          style={{ borderRadius: 'var(--dt-radius)' }}
        >
          <motion.div variants={fadeUp} className="mb-6 flex items-center justify-center gap-4">
            <div className="w-8 h-px bg-white/60" />
            <span className="text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">
              {content.badge}
            </span>
            <div className="w-8 h-px bg-white/60" />
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-6xl md:text-8xl text-white mb-4" style={{ fontFamily: 'var(--dt-font-heading)' }}>
            {content.headingMain}
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-2xl md:text-4xl text-white/80 italic mb-12" style={{ fontFamily: 'var(--dt-font-heading)' }}>
            {content.headingAccent}
          </motion.p>

          <motion.a 
            variants={fadeUp} 
            href={content.btnUrl}
            className="inline-flex items-center gap-3 px-10 py-5 text-sm uppercase tracking-widest font-bold transition-all hover:scale-105 group"
            style={{ backgroundColor: 'var(--color-dt-accent)', color: '#ffffff', borderRadius: 'var(--dt-radius)' }}
          >
            {content.btnPrimary} 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}