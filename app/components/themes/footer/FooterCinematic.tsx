"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function FooterCinematic({ data, projectName = "Projekt" }: { data?: any, projectName?: string }) {
  const content = {
    heading: data?.heading || "Jste připraveni?",
    subheading: data?.subheading || "Pojďme společně vytvořit něco výjimečného.",
    email: data?.email || "hello@vasprojekt.cz",
    copy: data?.copy || `© ${new Date().getFullYear()} ${projectName}.`
  };

  return (
    <footer className="relative bg-[var(--color-dt-bg)] pt-32 pb-12 overflow-hidden text-[var(--color-dt-text)]">
      <div className="max-w-[1400px] mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-24"
        >
          <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-none mb-6" style={{ fontFamily: 'var(--dt-font-heading)' }}>
            {content.heading}
          </h2>
          <p className="text-xl md:text-3xl text-[var(--color-dt-text)]/60 font-light">
            {content.subheading}
          </p>
        </motion.div>

        <motion.a 
          href={`mailto:${content.email}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="group flex items-center justify-center gap-4 text-2xl md:text-4xl font-bold tracking-tight hover:opacity-80 transition-opacity mb-32"
          style={{ color: 'var(--color-dt-accent)' }}
        >
          {content.email} <ArrowUpRight className="w-8 h-8 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
        </motion.a>

        <div className="w-full pt-8 border-t border-[var(--color-dt-text)]/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm font-medium opacity-60">{content.copy}</div>
          <nav className="flex gap-8 text-sm font-medium opacity-60">
            <Link href="#" className="hover:opacity-100 transition-opacity">Instagram</Link>
            <Link href="#" className="hover:opacity-100 transition-opacity">LinkedIn</Link>
            <Link href="#" className="hover:opacity-100 transition-opacity">Dribbble</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}