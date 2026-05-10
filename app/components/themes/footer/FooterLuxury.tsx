"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function FooterLuxury({ data, designConfig, colorPalette, projectName = "Hair Play" }: { data?: any, designConfig?: any, colorPalette?: any, projectName?: string }) {
  const content = {
    logoName: data?.logoName || projectName,
    description: data?.description || "Mluvíme anglicky a německy. Vítáme cizince. We speak English and German, foreigners are welcome.",
    address: data?.address || "Sochorova 1\n616 00, Brno-Žabovřesky",
    phone: data?.phone || "+420 739 270 238",
    email: data?.email || "info@hairplay.cz",
    hours: data?.hours || "Dle objednání",
    links: data?.links || [
      { name: "Služby", url: "#" },
      { name: "Galerie", url: "#" },
      { name: "Rezervace", url: "#" },
      { name: "Ochrana osobních údajů (GDPR)", url: "#" }
    ]
  };

  const dynamicStyles = {
    // Inverzní paleta pro patičku (Tmavě zelené pozadí)
    '--color-dt-bg': colorPalette?.text || '#224c45',
    '--color-dt-text': '#fcfaf5', // Světlý text
    '--color-dt-accent': colorPalette?.accent || '#ae9760',
    '--dt-font-heading': designConfig?.font_heading ? `"${designConfig.font_heading}", serif` : 'inherit',
  } as React.CSSProperties;

  return (
    <footer className="#224c45] text-[var(--color-dt-text)] pt-24 pb-12 mt-auto" style={dynamicStyles}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-16">
          
          {/* Brand & O nás */}
          <div className="md:col-span-12 lg:col-span-4">
            <Link href="/" className="text-4xl font-normal tracking-wide block mb-6 text-[var(--color-dt-accent)]" style={{ fontFamily: 'var(--dt-font-heading)' }}>
              {content.logoName}
            </Link>
            <p className="text-[var(--color-dt-text)]/70 font-light leading-relaxed whitespace-pre-line">
              {content.description}
            </p>
          </div>

          {/* Kontakt */}
          <div className="md:col-span-6 lg:col-span-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-8 text-[var(--color-dt-accent)]">Kontakt</h4>
            <div className="flex flex-col gap-5 text-sm text-[var(--color-dt-text)]/80 font-light">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 shrink-0 text-[var(--color-dt-accent)]" />
                <span className="whitespace-pre-line">{content.address}</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 shrink-0 text-[var(--color-dt-accent)]" />
                <a href={`tel:${content.phone.replace(/\s/g, '')}`} className="hover:text-[var(--color-dt-accent)] transition-colors">{content.phone}</a>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 shrink-0 text-[var(--color-dt-accent)]" />
                <a href={`mailto:${content.email}`} className="hover:text-[var(--color-dt-accent)] transition-colors">{content.email}</a>
              </div>
              <div className="flex items-start gap-4 mt-2">
                <Clock className="w-5 h-5 shrink-0 text-[var(--color-dt-accent)]" />
                <span className="whitespace-pre-line">{content.hours}</span>
              </div>
            </div>
          </div>

          {/* Odkazy */}
          <div className="md:col-span-6 lg:col-span-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-8 text-[var(--color-dt-accent)]">Informace</h4>
            <ul className="flex flex-col gap-4">
              {content.links.map((link: any, i: number) => (
                <li key={i}>
                  <Link href={link.url} className="text-sm text-[var(--color-dt-text)]/80 hover:text-[var(--color-dt-accent)] transition-colors font-light">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Spodní lišta */}
        <div className="pt-8 border-t border-[var(--color-dt-accent)]/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[var(--color-dt-text)]/50 tracking-widest uppercase">
          <p>© {new Date().getFullYear()} {content.logoName}. Všechna práva vyhrazena.</p>
          <p>Design by <span className="text-[var(--color-dt-accent)]">Chameleon Engine</span></p>
        </div>
      </div>
    </footer>
  );
}