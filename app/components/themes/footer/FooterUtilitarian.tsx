"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function FooterIndustrial({ 
  data, 
  projectName = "Projekt" 
}: { 
  data?: any, 
  projectName?: string 
}) {
  const content = {
    logoName: data?.logoName || projectName,
    tagline: data?.tagline || "HEAVY INDUSTRY ENG.",
    code: data?.code || "SYS_VER: 1.0.4",
    email: data?.email || "info@projekt.cz",
    phone: data?.phone || "+420 123 456 789",
    links: data?.links || [
      { name: "O společnosti", url: "#" },
      { name: "Technologie", url: "#" },
      { name: "Kariéra", url: "#" },
      { name: "Kontakt", url: "#" }
    ],
    socials: data?.socials || [
      { name: "LinkedIn", url: "#" },
      { name: "Instagram", url: "#" }
    ]
  };

  return (
    <footer className="max-w-7xl mx-auto px-4 md:px-6 py-12 bg-[var(--color-dt-bg)] text-[var(--color-dt-text)]">
      <div 
        className="grid grid-cols-1 md:grid-cols-4 border border-[var(--color-dt-text)]/20 bg-[var(--color-dt-surface)] overflow-hidden"
        style={{ borderRadius: 'var(--dt-radius)' }}
      >
        {/* Sloupec 1: Identifikace (Zabírá 2 sloupce na desktopu) */}
        <div className="md:col-span-2 p-8 md:p-12 border-b md:border-b-0 md:border-r border-[var(--color-dt-text)]/20 flex flex-col justify-between">
          <div>
            <Link 
              href="/" 
              className="text-3xl font-black tracking-tighter uppercase text-[var(--color-dt-text)] block mb-2"
              style={{ fontFamily: 'var(--dt-font-heading)' }}
            >
              {content.logoName}
            </Link>
            <span className="text-xs font-bold opacity-60 tracking-tight">{content.tagline}</span>
          </div>
          
          <div className="mt-16">
            <span className="text-[10px] font-mono text-[var(--color-dt-text)]/40 uppercase tracking-widest border border-[var(--color-dt-text)]/10 px-2 py-1">
              {content.code}
            </span>
            <p className="text-[10px] uppercase tracking-widest opacity-40 mt-4">
              &copy; {new Date().getFullYear()} Všechna práva vyhrazena.
            </p>
          </div>
        </div>

        {/* Sloupec 2: Rychlé odkazy */}
        <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-[var(--color-dt-text)]/20">
          <h4 className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-8">Navigace</h4>
          <ul className="flex flex-col gap-4">
            {content.links.map((link: any, i: number) => (
              <li key={i}>
                <Link href={link.url} className="text-sm font-medium hover:text-[var(--color-dt-accent)] transition-colors flex items-center justify-between group">
                  {link.name}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Sloupec 3: Kontakt & Sítě */}
        <div className="p-8 md:p-12 flex flex-col justify-between">
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-8">Spojení</h4>
            <div className="flex flex-col gap-2 mb-8">
              <a href={`mailto:${content.email}`} className="text-sm font-medium hover:text-[var(--color-dt-accent)] transition-colors">{content.email}</a>
              <a href={`tel:${content.phone}`} className="text-sm font-medium hover:text-[var(--color-dt-accent)] transition-colors">{content.phone}</a>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-4">Sítě</h4>
            <div className="flex flex-col gap-2">
              {content.socials.map((social: any, i: number) => (
                <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-widest hover:text-[var(--color-dt-accent)] transition-colors">
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}