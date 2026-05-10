"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Scissors } from "lucide-react";

export default function TestimonialsPremium({ data, designConfig, colorPalette }: { data?: any, designConfig?: any, colorPalette?: any }) {
  const [current, setCurrent] = useState(0);

  const content = {
    bg_src: data?.bg_src || "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=2944", // Tmavý obrázek textury/nůžek
    reviews: data?.reviews || [
      { name: "Simona", text: "Naprosto skvělý salón. Profesionální přístup, luxusní a kvalitní barvy, cítíte se tam jako doma.", stars: "5" },
      { name: "Andrea", text: "Skvělá a pečlivá práce, která se dnes málokdy vidí. A ten vychlazený nealko šampus byl TOP!", stars: "5" }
    ]
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % content.reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [content.reviews.length]);

  const dynamicStyles = {
    '--color-dt-accent': colorPalette?.accent || '#D4AF37', // Tady může být accent zlatý (#D4AF37) pro hvězdičky
    '--dt-font-heading': designConfig?.font_heading ? `"${designConfig.font_heading}", serif` : 'inherit',
  } as React.CSSProperties;

  return (
    <section className="relative py-32 md:py-28 flex items-center justify-center overflow-hidden" style={dynamicStyles}>
      {/* Temné pozadí */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://www.hairplay.cz/wp-content/uploads/2024/04/nuzky-pozadi.jpg')] bg-cover bg-center bg-fixed opacity-30" />
        <div className="absolute inset-0 bg-[#0a0a0a]/80" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
        <Scissors className="w-12 h-12 mx-auto mb-10 opacity-30 text-white" />

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-2xl md:text-4xl text-white/90 italic leading-relaxed mb-10" style={{ fontFamily: 'var(--dt-font-heading)' }}>
              "{content.reviews[current]?.text}"
            </p>
            
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(parseInt(content.reviews[current]?.stars || "5"))].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" style={{ color: 'var(--color-dt-accent)' }} />
              ))}
            </div>

            <h4 className="text-sm text-white uppercase tracking-[0.2em] font-bold">
              — {content.reviews[current]?.name}
            </h4>
          </motion.div>
        </AnimatePresence>

        {/* Indikátory */}
        <div className="flex justify-center gap-3 mt-12">
          {content.reviews.map((_: any, i: number) => (
            <button 
              key={i} onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-white scale-150' : 'bg-white/20'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}