"use client";

// Přidán import Transition
import { motion, Variants, Transition } from "framer-motion";
import { ArrowUpRight, Crosshair } from "lucide-react";
import Image from "next/image";

// TADY JE TA OPRAVA
const snapTransition: Transition = { type: "spring", stiffness: 120, damping: 20 };

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: snapTransition },
};

export default function HeroUtilitarian({ 
  data, 
  projectName = "Projekt" 
}: { 
  data?: any, 
  projectName?: string 
}) {
  const content = {
    badge: data?.badge || "Systém online",
    headingNormal: data?.headingNormal || "Tryskáme",
    headingAccent: data?.headingAccent || "budoucnost.",
    description: data?.description || `Jsme přední výrobci zařízení a specialisté na zakázkovou kovovýrobu pro ${projectName}. Využíváme moderní technologie pro komponenty z oceli, nerezu a hliníku.`,
    btnText: data?.btnText || "PROZKOUMAT TECHNOLOGIE",
    image: data?.image || "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?q=80&w=2940&auto=format&fit=crop",
    imgCode: data?.imgCode || "OBJ: ZAVOD_01 // V.1.0",
    stats: data?.stats || [
      { value: "3", label: "VÝROBNÍ ZÁVODY", id: "01" },
      { value: "33", label: "LET NA TRHU", id: "02" },
      { value: "180+", label: "ZAMĚSTNANCŮ", id: "03" }
    ]
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 bg-[var(--color-dt-bg)] text-[var(--color-dt-text)]">
      <div 
        className="grid grid-cols-1 lg:grid-cols-12 border border-[var(--color-dt-text)]/20 bg-[var(--color-dt-surface)] mb-12 overflow-hidden"
        style={{ borderRadius: 'var(--dt-radius)' }}
      >
        <div className="lg:col-span-7 p-8 md:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[var(--color-dt-text)]/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-dt-text)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-dt-text)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03] pointer-events-none" />
          
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10">
            <motion.div variants={fadeUpVariant} className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 inline-block animate-pulse" style={{ backgroundColor: 'var(--color-dt-accent)' }} />
              <span className="text-xs font-mono uppercase tracking-widest font-bold" style={{ color: 'var(--color-dt-accent)' }}>
                {content.badge}
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeUpVariant} 
              className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-6"
              style={{ fontFamily: 'var(--dt-font-heading)' }}
            >
              {content.headingNormal} <br />
              <span style={{ color: 'var(--color-dt-accent)' }}>
                {content.headingAccent}
              </span>
            </motion.h1>
            
            <motion.p variants={fadeUpVariant} className="text-lg opacity-70 max-w-xl mb-10 leading-relaxed">
              {content.description}
            </motion.p>
            
            <motion.div variants={fadeUpVariant} className="flex flex-wrap gap-4">
              <button 
                className="border-2 px-6 py-3 font-mono text-sm transition-colors flex items-center gap-2 hover:bg-transparent"
                style={{ 
                  backgroundColor: 'var(--color-dt-text)', 
                  borderColor: 'var(--color-dt-text)', 
                  color: 'var(--color-dt-bg)',
                  borderRadius: 'var(--dt-radius)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--color-dt-text)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-dt-text)';
                  e.currentTarget.style.color = 'var(--color-dt-bg)';
                }}
              >
                {content.btnText} <ArrowUpRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        </div>

        <div className="lg:col-span-5 relative min-h-[400px] flex items-center justify-center p-8 overflow-hidden bg-[var(--color-dt-bg)]/50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, ...snapTransition }}
            className="absolute inset-8 border border-[var(--color-dt-text)]/20 border-dashed"
            style={{ borderRadius: 'var(--dt-radius)' }}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, ...snapTransition }}
            className="relative z-10 w-full aspect-square max-w-[300px]"
          >
            <div 
              className="w-full h-full border border-[var(--color-dt-text)]/30 shadow-2xl relative overflow-hidden group bg-[var(--color-dt-surface)]"
              style={{ borderRadius: 'var(--dt-radius)' }}
            >
               <Image 
                  src={content.image}
                  alt="Vizualizace"
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-80"
               />
               <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 z-20" style={{ borderColor: 'var(--color-dt-accent)' }} />
               <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 z-20" style={{ borderColor: 'var(--color-dt-accent)' }} />
            </div>
          </motion.div>
          
          <div className="absolute bottom-4 right-4 bg-[var(--color-dt-surface)] border border-[var(--color-dt-text)]/20 px-3 py-1 font-mono text-[10px] text-[var(--color-dt-text)]/60">
            {content.imgCode}
          </div>
        </div>
      </div>

      <motion.div 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {content.stats.map((stat: any, i: number) => (
          <motion.div 
            key={i} 
            variants={fadeUpVariant} 
            className="bg-[var(--color-dt-surface)] border border-[var(--color-dt-text)]/20 p-6 flex flex-col justify-between relative group hover:border-[var(--color-dt-text)]/40 transition-colors"
            style={{ borderRadius: 'var(--dt-radius)' }}
          >
            <div className="flex justify-between items-start mb-8">
              <span className="font-mono text-[10px] text-[var(--color-dt-text)]/40">PARAM_{stat.id}</span>
              <Crosshair className="w-4 h-4 text-[var(--color-dt-text)]/20 group-hover:text-[var(--color-dt-accent)] transition-colors" />
            </div>
            <div>
              <div className="text-5xl font-bold font-mono tracking-tighter mb-1">{stat.value}</div>
              <div className="text-xs font-bold text-[var(--color-dt-text)]/50 tracking-widest uppercase">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}