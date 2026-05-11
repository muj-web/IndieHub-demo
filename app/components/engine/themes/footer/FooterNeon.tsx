"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function FooterNeon({ data, projectName = "Projekt" }: { data?: any, projectName?: string }) {
  const content = {
    title: data?.title || "Zůstaňme ve spojení",
    description: data?.description || "Přihlaste se k odběru novinek a získejte přístup k exkluzivním tipům pro váš digitální růst.",
    copy: data?.copy || `© ${new Date().getFullYear()} ${projectName}. Všechna práva vyhrazena.`,
  };

  return (
    <footer className="relative bg-[var(--color-dt-bg)] pt-24 pb-12 overflow-hidden text-[var(--color-dt-text)] border-t border-[var(--color-dt-text)]/10">
      {/* Masivní spodní glow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[800px] h-[300px] blur-[150px] opacity-20 pointer-events-none"
        style={{ backgroundColor: 'var(--color-dt-accent)' }}
      />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h3 className="text-4xl font-black mb-6" style={{ fontFamily: 'var(--dt-font-heading)' }}>
              {content.title}
            </h3>
            <p className="text-[var(--color-dt-text)]/60 max-w-md mb-8 leading-relaxed">
              {content.description}
            </p>
            {/* Newsletter Input */}
            <div className="relative max-w-md flex items-center">
              <Mail className="absolute left-4 w-5 h-5 text-[var(--color-dt-text)]/40" />
              <input 
                type="email" 
                placeholder="Váš e-mail..." 
                className="w-full bg-[var(--color-dt-surface)]/50 border border-[var(--color-dt-text)]/20 px-12 py-4 focus:outline-none focus:border-[var(--color-dt-accent)] transition-colors text-[var(--color-dt-text)]"
                style={{ borderRadius: 'var(--dt-radius)' }}
              />
              <button 
                className="absolute right-2 px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all hover:scale-105"
                style={{ backgroundColor: 'var(--color-dt-accent)', color: 'var(--color-dt-bg)', borderRadius: 'var(--dt-radius)' }}
              >
                Odeslat
              </button>
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex flex-col md:items-end justify-center gap-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-dt-text)]/40">Sledujte nás</h4>
            <div className="flex gap-4">
            
              
            </div>
          </motion.div>
        </div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="pt-8 border-t border-[var(--color-dt-text)]/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold uppercase tracking-widest text-[var(--color-dt-text)]/40">
          <p>{content.copy}</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-[var(--color-dt-accent)] transition-colors">Ochrana soukromí</Link>
            <Link href="#" className="hover:text-[var(--color-dt-accent)] transition-colors">Podmínky</Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}