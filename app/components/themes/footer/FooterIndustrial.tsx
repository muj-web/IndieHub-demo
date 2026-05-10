"use client";

import Link from "next/link";
import { Hexagon } from "lucide-react"; // Neutrální technická ikona místo srdce

export default function FooterIndustrial({ 
  data, 
  projectName = "INDUSTRY" 
}: { 
  data?: any, 
  projectName?: string 
}) {
  const content = {
    slogan: data?.slogan || "Technologie pro budoucnost",
    address: data?.address || ["Průmyslová zóna 42", "100 00 Praha", "Česká republika"],
    hours: data?.hours || "Po - Pá: 8:00 - 17:00",
    phone: data?.phone || "+420 800 123 456",
    email: data?.email || `info@${projectName.toLowerCase().replace(/\s/g, '')}.cz`,
    col1Links: data?.col1Links || ["Klientský portál", "B2B Systém", "Dokumentace", "Podpora"],
    col2Links: data?.col2Links || ["O společnosti", "Naše služby", "Kariéra", "Kontakt"]
  };

  return (
    <footer className="bg-[var(--color-dt-bg)] border-t pt-20 pb-10 mt-auto" style={{ borderColor: 'var(--color-dt-text)1A' }}>
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* HORNÍ ŘÁDEK (Logo a rychlá navigace) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 border-b pb-8 gap-8" style={{ borderColor: 'var(--color-dt-text)1A' }}>
          <div className="text-2xl font-black tracking-tighter uppercase text-[var(--color-dt-text)]">
            {projectName}<span style={{ color: 'var(--color-dt-accent)' }}>.</span>
          </div>
          
          <div className="flex flex-wrap gap-8 text-[11px] uppercase tracking-widest font-bold text-[var(--color-dt-text)]/60">
            {content.col2Links.map((link: string, i: number) => (
              <Link key={i} href="#" className="transition-colors hover:text-[var(--color-dt-text)]">{link}</Link>
            ))}
          </div>
        </div>

        {/* HLAVNÍ GRID (4 sloupce) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-sm font-light leading-relaxed text-[var(--color-dt-text)]/60">
          
          {/* Sloupec 1: Brand Icon & Slogan */}
          <div className="col-span-1 flex flex-col items-start md:items-center text-center">
            <div className="mb-4" style={{ color: 'var(--color-dt-accent)' }}>
              <Hexagon className="w-20 h-20" strokeWidth={1} />
            </div>
            <h3 className="font-bold uppercase tracking-widest text-lg leading-tight" style={{ color: 'var(--color-dt-accent)' }}>
              {content.slogan.split(' ').slice(0, 2).join(' ')} <br/>
              {content.slogan.split(' ').slice(2).join(' ')}
            </h3>
          </div>

          {/* Sloupec 2: Sídlo */}
          <div>
            <h4 className="text-[var(--color-dt-text)] font-bold mb-4 uppercase tracking-widest text-[10px]">Sídlo společnosti</h4>
            <p>
              {projectName} s.r.o.<br/>
              {content.address[0]}<br/>
              {content.address[1]}
            </p>
            <p className="mt-4">Pracovní doba:<br/>{content.hours}</p>
          </div>

          {/* Sloupec 3: Systémy / E-shopy */}
          <div>
            <h4 className="text-[var(--color-dt-text)] font-bold mb-4 uppercase tracking-widest text-[10px]">Systémy</h4>
            <nav className="flex flex-col gap-2">
              {content.col1Links.map((link: string, i: number) => (
                <Link key={i} href="#" className="transition-colors" style={{ color: 'var(--color-dt-text)99' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-dt-accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-dt-text)99'}>
                  {link}
                </Link>
              ))}
            </nav>
          </div>

          {/* Sloupec 4: Kontakt */}
          <div>
            <h4 className="text-[var(--color-dt-text)] font-bold mb-4 uppercase tracking-widest text-[10px]">Kontaktujte nás</h4>
            <div className="flex flex-col gap-2 font-medium" style={{ color: 'var(--color-dt-accent)' }}>
              <a href={`tel:${content.phone.replace(/\s/g, '')}`} className="transition-colors hover:text-[var(--color-dt-text)]">
                {content.phone}
              </a>
              <a href={`mailto:${content.email}`} className="transition-colors hover:text-[var(--color-dt-text)]">
                {content.email}
              </a>
            </div>
          </div>
        </div>
        
        {/* SPODNÍ ŘÁDEK (Copyright) */}
        <div className="border-t pt-8 flex justify-between items-center text-[10px] text-[var(--color-dt-text)]/40 uppercase tracking-widest" style={{ borderColor: 'var(--color-dt-text)1A' }}>
          <p>© {new Date().getFullYear()} {projectName}. Všechna práva vyhrazena.</p>
          <p>Design & Kód: Digitální Tvůrce</p>
        </div>
      </div>
    </footer>
  );
}