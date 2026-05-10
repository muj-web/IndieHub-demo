"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function FooterElegant({ data, projectName = "Projekt" }: { data?: any, projectName?: string }) {
  const content = {
    brandName: data?.brandName || projectName,
    description: data?.description || "Poskytujeme prémiové služby s důrazem na detail a nadčasový design.",
    columns: data?.columns || [
      {
        title: "Navigace",
        links: ["Služby", "O nás", "Portfolio", "Kontakt"]
      },
      {
        title: "Sociální sítě",
        links: ["Instagram", "Facebook", "Pinterest", "LinkedIn"]
      }
    ],
    copy: data?.copy || `© ${new Date().getFullYear()} Všechna práva vyhrazena.`
  };

  return (
    <footer className="bg-[var(--color-dt-bg)] text-[var(--color-dt-text)] pt-24 pb-8 border-t border-[var(--color-dt-text)]/10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24"
        >
          {/* Brand Col */}
          <div className="md:col-span-6 lg:col-span-5">
            <Link href="/" className="text-3xl font-extrabold tracking-tighter block mb-6" style={{ fontFamily: 'var(--dt-font-heading)' }}>
              {content.brandName}
            </Link>
            <p className="text-[var(--color-dt-text)]/60 font-light leading-relaxed max-w-sm">
              {content.description}
            </p>
          </div>

          {/* Links Cols */}
          <div className="md:col-span-6 lg:col-span-7 grid grid-cols-2 gap-8">
            {content.columns.map((col: any, i: number) => (
              <div key={i}>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-8" style={{ color: 'var(--color-dt-accent)' }}>
                  {col.title}
                </h4>
                <ul className="flex flex-col gap-4">
                  {col.links.map((link: string, j: number) => (
                    <li key={j}>
                      <Link href="#" className="text-sm font-medium text-[var(--color-dt-text)]/70 hover:text-[var(--color-dt-text)] transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-[var(--color-dt-text)]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-[var(--color-dt-text)]/50"
        >
          <p>{content.copy}</p>
          <p>
            Design by <span style={{ color: 'var(--color-dt-accent)' }}>Digitální tvůrce</span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}