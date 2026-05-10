"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function ServicesInteractive({ data, designConfig, colorPalette }: { data?: any, designConfig?: any, colorPalette?: any }) {
  const content = {
    services: data?.services || [
      { title: "Střihy vlasů", image: "https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?q=80&w=800" },
      { title: "Barvení vlasů", image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=800" },
      { title: "Prodlužování", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=800" },
      { title: "Rituály", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800" }
    ]
  };

  const dynamicStyles = {
    '--color-dt-bg': colorPalette?.bg || '#ffffff',
    '--color-dt-accent': colorPalette?.accent || '#1D3B31',
    '--dt-font-heading': designConfig?.font_heading ? `"${designConfig.font_heading}", serif` : 'inherit',
  } as React.CSSProperties;

  return (
    <section className="w-full bg-[var(--color-dt-bg)]" style={dynamicStyles}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full h-[60vh] md:h-[70vh]">
        {content.services.map((srv: any, i: number) => (
          <Link key={i} href={srv.url || "#"} className="relative group overflow-hidden h-full flex items-end">
            {/* Background Image s pomalým zoomem */}
            <div className="absolute inset-0 w-full h-full">
              <Image src={srv.image} alt={srv.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
            </div>
            
            {/* Elegantní Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            
            {/* Barevný overlay z accent barvy (např. tmavě zelená) při hoveru */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500 mix-blend-multiply" style={{ backgroundColor: 'var(--color-dt-accent)' }} />

            {/* Obsah karty */}
            <div className="relative z-10 w-full p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <div className="w-8 h-px bg-white/50 mb-4 group-hover:w-16 transition-all duration-500" />
              <h3 className="text-3xl text-white font-medium" style={{ fontFamily: 'var(--dt-font-heading)' }}>
                {srv.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}