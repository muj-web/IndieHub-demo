"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const widthMap: Record<string, string> = { '100': 'max-w-full', '80': 'max-w-[1400px]', '60': 'max-w-7xl', '50': 'max-w-5xl' };

export default function TextMediaStandard({ data, designConfig, colorPalette }: { data?: any, designConfig?: any, colorPalette?: any }) {
  const content = {
    layout: data?.layout || 'normal',
    imageRatio: data?.imageRatio || 'aspect-video',
    heading: data?.heading || "Nadpis sekce",
    description: data?.description || "Zde je prostor pro váš textový obsah. Popište podrobněji vaše služby nebo vizi.",
    image: data?.image || "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000",
  };

  const widthClass = widthMap[designConfig?.content_width || '60'] || widthMap['60'];
  const imageRadius = (designConfig?.radius === '9999px') ? '2rem' : (designConfig?.radius || '0.5rem');
  const isReversed = content.layout === 'reversed';

  return (
    <section className="py-16 lg:py-24 bg-[var(--color-dt-bg)] transition-colors duration-500" style={{ '--color-dt-bg': colorPalette?.bg, '--color-dt-text': colorPalette?.text, '--color-dt-accent': colorPalette?.accent, '--dt-font-heading': designConfig?.font_heading, color: 'var(--color-dt-text)' } as any}>
      <div className={`mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${widthClass}`}>
        <div className={isReversed ? 'lg:order-last' : ''}>
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'var(--dt-font-heading)' }}>{content.heading}</h2>
          <p className="text-lg opacity-70 leading-relaxed">{content.description}</p>
        </div>
        <div className={`relative w-full ${content.imageRatio} ${isReversed ? 'lg:order-first' : ''}`}>
          <div className="w-full h-full relative overflow-hidden bg-zinc-100" style={{ borderRadius: imageRadius }}>
            <Image src={content.image} alt="Content" fill className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}