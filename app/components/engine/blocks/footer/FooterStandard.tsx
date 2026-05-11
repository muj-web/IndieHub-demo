"use client";
const widthMap: Record<string, string> = { '100': 'max-w-full', '80': 'max-w-[1400px]', '60': 'max-w-7xl', '50': 'max-w-5xl' };

export default function FooterStandard({ data, projectName, designConfig, colorPalette }: { data?: any, projectName?: string, designConfig?: any, colorPalette?: any }) {
  const widthClass = widthMap[designConfig?.content_width || '60'] || widthMap['60'];

  return (
    <footer className="py-12 border-t border-[var(--color-dt-text)]/10 bg-[var(--color-dt-bg)]" style={{ '--color-dt-bg': colorPalette?.bg, '--color-dt-text': colorPalette?.text, color: 'var(--color-dt-text)' } as any}>
      <div className={`mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 ${widthClass}`}>
        <div className="text-xl font-bold">{projectName}</div>
        <div className="text-[10px] uppercase tracking-[0.2em] opacity-40">
          © {new Date().getFullYear()} Všechna práva vyhrazena
        </div>
      </div>
    </footer>
  );
}