import Image from 'next/image';
import Link from 'next/link';
import { Camera, MonitorSmartphone, ArrowRight, Briefcase, Users, LayoutTemplate } from 'lucide-react';

export const metadata = {
  title: 'B2B & Firmy | Radek Čech',
  description: 'Firemní focení, business portréty a digitální tvorba. Pomáhám firmám budovat silnou vizuální identitu.',
};

export default function B2bHubPage() {
  return (
    // DARK MODE ZÁKLAD: Černé pozadí, bílý text, bezpatkové písmo (sans)
    <div className="bg-[#0F1115] min-h-screen pt-32 pb-24 text-white font-sans selection:bg-[#B09B84] selection:text-white">
      
      {/* 1. HERO SEKCE */}
      <section className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
        <div className="order-2 lg:order-1">
          <span className="text-[#B09B84] uppercase tracking-[0.3em] text-[10px] font-bold block mb-6">
            B2B & Digitální tvorba
          </span>
          <h1 className="text-5xl md:text-7xl font-light mb-8 leading-tight tracking-tight">
            Váš byznys,<br />
            <span className="font-medium text-[#B09B84]">viditelný.</span>
          </h1>
          <p className="text-white/60 text-lg font-light mb-10 leading-relaxed max-w-xl">
            Pomáhám firmám a podnikatelům budovat silnou vizuální identitu. Od špičkové reportážní fotografie a business portrétů až po tvorbu moderních webů.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="#sluzby" className="bg-[#B09B84] text-white px-8 py-4 rounded-2xl uppercase tracking-widest text-[10px] font-bold hover:bg-white hover:text-[#0F1115] transition-all shadow-xl">
              Prozkoumat služby
            </Link>
          </div>
        </div>
        <div className="order-1 lg:order-2 relative aspect-[4/5] lg:aspect-square overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/10">
          <Image 
            src="https://www.radekcech.cz/wp-content/uploads/2023/04/svatba-hotel-myslivna-brno-radek-cech-fotograf-00065-1.jpg" // Zde dej nějakou firemní/tech fotku
            alt="Radek Čech B2B" 
            fill 
            className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            priority
          />
        </div>
      </section>

      {/* 2. FIREMNÍ FOCENÍ (Odkazy na tvé SEO URL) */}
      <section id="sluzby" className="max-w-[1400px] mx-auto px-6 mb-32 pt-16 border-t border-white/10">
        <div className="flex items-center gap-4 mb-12">
          <Camera className="text-[#B09B84]" size={32} strokeWidth={1} />
          <h2 className="text-3xl md:text-4xl font-light">Komerční fotografie</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ZDE JSOU TVÉ PŮVODNÍ URL ADRESY */}
          {[
            { 
              url: '/foceni-pro-firmy/business-portret', 
              title: 'Business portrét', 
              desc: 'Profesionální portréty pro vás a váš tým, které budují důvěru.',
              icon: <Users size={24} strokeWidth={1} />
            },
            { 
              url: '/foceni-pro-firmy/reportazni-fotografie', 
              title: 'Firemní reportáž', 
              desc: 'Dokumentace eventů, konferencí a života vaší firmy.',
              icon: <Briefcase size={24} strokeWidth={1} />
            },
            { 
              url: '/foceni-pro-firmy/produktovy-fotograf', 
              title: 'Produktová fotografie', 
              desc: 'Fotografie, které prodávají vaše produkty na první pohled.',
              icon: <Camera size={24} strokeWidth={1} />
            }
          ].map((item) => (
            <Link key={item.url} href={item.url} className="group bg-white/5 border border-white/10 p-10 rounded-3xl hover:bg-white/10 transition-all duration-300 flex flex-col h-full">
              <div className="text-[#B09B84] mb-6 group-hover:scale-110 transition-transform origin-left">
                {item.icon}
              </div>
              <h3 className="text-xl font-medium mb-3 text-white">{item.title}</h3>
              <p className="text-white/50 text-sm font-light leading-relaxed mb-8 flex-grow">{item.desc}</p>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#B09B84] group-hover:text-white transition-colors">
                Zjistit více <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

{/* 3. TVORBA WEBU A MARKETING */}
      <section className="max-w-[1400px] mx-auto px-6">
        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 md:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#B09B84]/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <MonitorSmartphone className="text-[#B09B84]" size={32} strokeWidth={1} />
                <span className="uppercase tracking-widest text-[10px] font-bold">Digitální tvůrce</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-light mb-8 leading-tight">
                Moderní weby, aplikace <br />a funkční marketing
              </h2>
              <p className="text-white/60 font-light leading-relaxed mb-8 max-w-md">
                Kvalitní fotky potřebují kvalitní prostor, kde je ukázat. Stavím weby a webové aplikace, které nejen skvěle vypadají, ale především plní svůj cíl – přivádějí zákazníky.
              </p>

              {/* NOVÉ: Interní odkazy na tvé SEO stránky */}
              <div className="flex flex-col gap-3 mb-10 border-l-2 border-[#B09B84]/30 pl-4">
                <Link href="/tvorba-webu" className="text-white/80 hover:text-[#B09B84] transition-colors text-sm flex items-center gap-2">
                  <ArrowRight size={14} /> Tvorba webových stránek a aplikací
                </Link>
                <Link href="/jak-vytvorit-webove-stranky" className="text-white/80 hover:text-[#B09B84] transition-colors text-sm flex items-center gap-2">
                  <ArrowRight size={14} /> Průvodce: Jak vytvořit web
                </Link>
                <Link href="/seo-optimalizace-webu-pro-vyhledavace" className="text-white/80 hover:text-[#B09B84] transition-colors text-sm flex items-center gap-2">
                  <ArrowRight size={14} /> SEO optimalizace pro vyhledávače
                </Link>
              </div>

              <a href="https://digitalnitvurce.cz" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 bg-white text-[#0F1115] px-8 py-4 rounded-2xl uppercase tracking-widest text-[10px] font-bold hover:bg-[#B09B84] hover:text-white transition-all shadow-xl">
                Přejít na DigitalniTvurce.cz
              </a>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="bg-[#0F1115]/50 border border-white/5 p-6 rounded-3xl backdrop-blur-md">
                  <LayoutTemplate className="text-[#B09B84] mb-4" size={24} strokeWidth={1} />
                  <h4 className="text-base mb-2 font-medium text-white">UX/UI Design</h4>
                  <p className="text-[11px] font-light text-white/50 leading-relaxed">Návrh uživatelského rozhraní s důrazem na konverze a zážitek.</p>
               </div>
               <div className="bg-[#0F1115]/50 border border-white/5 p-6 rounded-3xl backdrop-blur-md">
                  <MonitorSmartphone className="text-[#B09B84] mb-4" size={24} strokeWidth={1} />
                  <h4 className="text-base mb-2 font-medium text-white">Vývoj na míru</h4>
                  <p className="text-[11px] font-light text-white/50 leading-relaxed">Rychlé weby a aplikace postavené na moderním Next.js i osvědčeném WordPressu.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}