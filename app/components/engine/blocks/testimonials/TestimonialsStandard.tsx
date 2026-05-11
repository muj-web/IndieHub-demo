"use client";

const widthMap: Record<string, string> = { '100': 'max-w-full', '80': 'max-w-[1400px]', '60': 'max-w-7xl', '50': 'max-w-5xl' };

export default function TestimonialsStandard({ data, designConfig, colorPalette }: { data?: any, designConfig?: any, colorPalette?: any }) {
  const reviews = data?.reviews || [{ name: "Jan Novák", text: "Skvělá spolupráce, doporučuji!" }, { name: "Petra Svobodová", text: "Profesionální přístup a rychlé dodání." }];
  
  const widthClass = widthMap[designConfig?.content_width || '60'] || widthMap['60'];

  // --- OPRAVA ZAOKROUHLENÍ ---
  const globalRadius = designConfig?.radius || '0.5rem';
  const cardRadius = globalRadius.includes('9999') ? '2rem' : globalRadius;

  return (
    <section className="py-20 bg-[var(--color-dt-bg)] transition-colors duration-500" style={{ '--color-dt-bg': colorPalette?.bg, '--color-dt-text': colorPalette?.text, '--color-dt-surface': colorPalette?.surface, '--dt-radius': globalRadius, color: 'var(--color-dt-text)' } as any}>
      <div className={`mx-auto px-6 ${widthClass}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((r: any, i: number) => (
            <div key={i} className="p-10 bg-[var(--color-dt-surface)] border border-[var(--color-dt-text)]/5 italic" style={{ borderRadius: cardRadius }}>
              <p className="text-lg mb-6">"{r.text}"</p>
              <span className="not-italic font-bold uppercase tracking-widest text-[10px] opacity-50">— {r.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}