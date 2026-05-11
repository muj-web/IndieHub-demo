import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ReactNode } from 'react';

interface B2BServiceProps {
  title: string;
  subtitle: string;
  description: ReactNode[];
  image: string;
  benefits: string[];
}

export default function B2BServiceTemplate({ title, subtitle, description, image, benefits }: B2BServiceProps) {
  return (
    <div className="bg-[#0F1115] min-h-screen pt-32 pb-24 text-white font-sans selection:bg-[#B09B84] selection:text-white">
      <article className="max-w-[1200px] mx-auto px-6">
        
        {/* Zpět na rozcestník */}
        <Link href="/firmy" className="inline-flex items-center gap-2 text-white/40 hover:text-[#B09B84] transition-colors text-[10px] uppercase tracking-widest font-bold mb-12">
          <ArrowLeft size={14} /> Zpět na B2B služby
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* TEXTOVÝ OBSAH */}
          <div className="lg:col-span-7">
            <span className="text-[#B09B84] uppercase tracking-[0.3em] text-[10px] font-bold block mb-6">
              {subtitle}
            </span>
            <h1 className="text-4xl md:text-6xl font-light mb-10 leading-tight tracking-tight">
              {title}
            </h1>
            
            <div className="space-y-6 text-white/70 font-light leading-relaxed text-lg mb-12">
              {description.map((p, i) => <p key={i}>{p}</p>)}
            </div>

            {/* VÝHODY / CO DOSTANETE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12 border-t border-white/10">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#B09B84] shrink-0 mt-1" size={18} />
                  <span className="text-sm text-white/80 font-light">{benefit}</span>
                </div>
              ))}
            </div>
            
            {/* KONTAKTNÍ CTA */}
            <div className="mt-16">
              {/* ZMĚNA: Tlačítko nyní směřuje přesně na novou kontaktní stránku a odroluje na formulář */}
              <Link href="/kontakt#form" className="bg-white text-[#0F1115] px-10 py-5 rounded-2xl uppercase tracking-widest text-[11px] font-bold hover:bg-[#B09B84] hover:text-white transition-all inline-block">
                Poptat spolupráci
              </Link>
            </div>
          </div>

          {/* OBRÁZEK */}
          <div className="lg:col-span-5 sticky top-32">
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10">
              <Image src={image} alt={title} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
            </div>
          </div>
          
        </div>
      </article>
    </div>
  );
}