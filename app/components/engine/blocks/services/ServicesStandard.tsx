"use client";
import { motion } from "framer-motion";
import { Box } from "lucide-react";

const widthMap: Record<string, string> = { '100': 'max-w-full', '80': 'max-w-[1400px]', '60': 'max-w-7xl', '50': 'max-w-5xl' };

export default function ServicesStandard({ data, designConfig, colorPalette }: { data?: any, designConfig?: any, colorPalette?: any }) {
  const services = data?.services || [
    { title: "Služba 1", desc: "Krátký popis vaší první skvělé služby." },
    { title: "Služba 2", desc: "Krátký popis vaší druhé skvělé služby." },
    { title: "Služba 3", desc: "Krátký popis vaší třetí skvělé služby." }
  ];

  const widthClass = widthMap[designConfig?.content_width || '60'] || widthMap['60'];

  // --- OPRAVA ZAOKROUHLENÍ ---
  const globalRadius = designConfig?.radius || '0.5rem';
  const cardRadius = globalRadius.includes('9999') ? '2rem' : globalRadius;

  return (
    <section className="py-20 bg-[var(--color-dt-bg)] transition-colors duration-500" style={{ '--color-dt-bg': colorPalette?.bg, '--color-dt-text': colorPalette?.text, '--color-dt-accent': colorPalette?.accent, '--color-dt-surface': colorPalette?.surface, '--dt-radius': globalRadius, color: 'var(--color-dt-text)' } as any}>
      <div className={`mx-auto px-6 ${widthClass}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((s: any, i: number) => (
            <div key={i} className="p-8 border border-[var(--color-dt-text)]/10 bg-[var(--color-dt-surface)]" style={{ borderRadius: cardRadius }}>
              <Box className="mb-6 w-10 h-10" style={{ color: 'var(--color-dt-accent)' }} />
              <h3 className="text-xl font-bold mb-3">{s.title}</h3>
              <p className="opacity-60 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}