import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Camera, Heart, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

// 1. NAŠE DATA PRO JEDNOTLIVÉ REGIONY
// Klíč je přesná URL adresa (slug), která se zobrazí v prohlížeči
const regionData: Record<string, any> = {
  'svatebni-fotograf-blansko': {
    city: 'Blansko',
    seoTitle: 'Svatební fotograf Blansko | Radek Čech',
    seoDescription: 'Hledáte svatebního fotografa v Blansku a okolí? Fotím autentické svatební příběhy plné emocí v přírodě i na statcích.',
    image: 'https://www.radekcech.cz/wp-content/uploads/2023/08/svatebni-fotograf-brno-radek-cech-bg-4.jpg',
    text: 'Okolí Blanska a Moravský kras je pro mě srdcová záležitost. Nádherná příroda a jedinečná atmosféra tvoří dokonalou kulisu pro autentickou svatbu. Nebudu vás nutit do krkolomných póz, místo toho nechám vyniknout vaši přirozenost.',
  },
  'svatebni-fotograf-praha': {
    city: 'Praha',
    seoTitle: 'Svatební fotograf Praha | Radek Čech',
    seoDescription: 'Hledáte svatebního fotografa v Praze? Fotím autentické svatební příběhy s reportážním přístupem a bez strojených póz.',
    image: 'https://www.radekcech.cz/wp-content/uploads/2023/08/svatebni-fotograf-brno-radek-cech-bg-4.jpg',
    text: 'Svatby v Praze a jejím okolí mají svou specifickou, mnohdy velmi elegantní atmosféru. Ať už plánujete svatbu v centru města, nebo na klidnějším místě za Prahou, mým cílem je zachytit váš den přirozeně a s důrazem na skutečné emoce.',
  },
  'svatebni-fotograf-vysocina': {
    city: 'Vysočina',
    seoTitle: 'Svatební fotograf Vysočina | Radek Čech',
    seoDescription: 'Hledáte svatebního fotografa na Vysočině? Fotím autentické svatební příběhy plné emocí na rustikálních statcích a v přírodě.',
    image: 'https://www.radekcech.cz/wp-content/uploads/2023/08/svatebni-fotograf-brno-radek-cech-bg-4.jpg',
    text: 'Vysočina je plná nádherných rustikálních statků, stodol a dechberoucí přírody. Západy slunce nad kopci tvoří naprosto dokonalou kulisu pro uvolněnou svatbu. Zaměřuji se na to, aby vaše fotky odrážely krásu místa, které jste si vybrali.',
  }, // <--- TADY TA ČÁRKA CHYBĚLA!
  'svatebni-fotograf-olomouc': {
    city: 'Olomouc',
    seoTitle: 'Svatební fotograf Olomouc | Radek Čech',
    seoDescription: 'Hledáte svatebního fotografa v Olomouci? Fotím autentické svatby v historickém centru i v moderních prostorech na Hané.',
    image: 'https://www.radekcech.cz/wp-content/uploads/2023/08/svatebni-fotograf-brno-radek-cech-bg-4.jpg',
    text: 'Olomouc a celá Haná mají neopakovatelné kouzlo. Od historických uliček v centru až po moderní prostory v okolí. Jako fotograf se zaměřuji na to, aby vaše snímky zachytily tu pravou atmosféru místa a především vaše skutečné emoce bez nuceného pózování.',
  },
  'svatebni-fotograf-zlin': {
    city: 'Zlín',
    seoTitle: 'Svatební fotograf Zlín | Radek Čech',
    seoDescription: 'Hledáte svatebního fotografa ve Zlíně? Zachytím váš svatební příběh s důrazem na přirozenost v unikátních zlínských lokacích.',
    image: 'https://www.radekcech.cz/wp-content/uploads/2023/08/svatebni-fotograf-brno-radek-cech-bg-4.jpg',
    text: 'Zlínská architektura a okolní příroda hostí úžasná svatební místa. Můj reportážní styl focení se skvěle hodí k uvolněným svatbám, které si na nic nehrají. Budu vaším tichým průvodcem, který zachytí momenty, které vám za pár let připomenou, jak jste se ve svůj den cítili.',
  },
  'svatebni-fotograf-ostrava': {
    city: 'Ostrava',
    seoTitle: 'Svatební fotograf Ostrava | Radek Čech',
    seoDescription: 'Hledáte svatebního fotografa v Ostravě? Zachytím váš den autenticky v industriálním prostředí Dolních Vítkovic i v přírodě Beskyd.',
    image: 'https://www.radekcech.cz/wp-content/uploads/2023/08/svatebni-fotograf-brno-radek-cech-bg-4.jpg',
    text: 'Ostrava nabízí neuvěřitelně syrová a fotogenická místa. Industriální kulisy Dolních Vítkovic nebo klidnější lokace v okolí Ostravy a Beskyd jsou skvělým místem pro svatbu s charakterem. Mým cílem je, aby vaše fotografie vyprávěly skutečný příběh vašeho dne, bez póz.',
  },
};

// 2. DYNAMICKÉ SEO
export async function generateMetadata({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const data = regionData[resolvedParams.region];
  
  if (!data) return {};

  return {
    title: data.seoTitle,
    description: data.seoDescription,
  };
}

// 3. STATICKÉ GENEROVÁNÍ (aby to bylo bleskově rychlé pro Google)
export function generateStaticParams() {
  return Object.keys(regionData).map((region) => ({
    region: region,
  }));
}

// 4. SAMOTNÁ STRÁNKA
export default async function RegionPage({ params }: { params: Promise<{ region: string }> }) {
  const resolvedParams = await params;
  const data = regionData[resolvedParams.region];

  // Pokud někdo zadá špatnou URL (např. svatebni-fotograf-ostrava, která v datech není), hodíme 404
  if (!data) notFound();

  // Načteme 3 nejnovější svatby z databáze
  const { data: stories } = await supabase
    .from('wedding_stories')
    .select('title, slug, cover_image')
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-[#1A1A1A]">
      
      {/* 1. HERO SEKCE */}
      <section className="relative h-[95vh] w-[95vw] mx-auto mt-6 flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl">
        <Image 
          src={data.image} 
          alt={`Svatební fotograf ${data.city}`} 
          fill 
          className="object-cover object-[center_38%]" 
          priority 
        />
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative z-10 text-center px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 ease-out fill-mode-both delay-300">
          <span className="uppercase tracking-[0.4em] text-white/90 text-[10px] md:text-xs mb-6 block font-medium drop-shadow-md">
            Autentická reportáž
          </span>
          <h1 className="font-serif text-white text-4xl md:text-6xl lg:text-8xl font-light tracking-tight mb-10 leading-none whitespace-nowrap drop-shadow-lg">
            Svatební fotograf<br className="md:hidden" /> {data.city}
          </h1>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {/* ODKAZY SMĚŘUJÍ NA STRÁNKU BRNO! */}
            <Link href="/svatebni-fotograf/svatebni-fotograf-brno#kontakt" className="uppercase tracking-widest text-[11px] font-medium text-white border-b border-white/30 pb-2 hover:border-white transition-all drop-shadow-md">
              Zjištění volného termínu
            </Link>
            <Link href="/svatebni-fotograf/svatebni-fotograf-brno#cena" className="uppercase tracking-widest text-[11px] font-medium text-white/70 border-b border-transparent pb-2 hover:text-white transition-all drop-shadow-md">
              Jaká je cena za focení?
            </Link>
          </div>
        </div>
      </section>

      {/* 2. FILOSOFIE (S dynamickým textem) */}
      <section className="py-32 max-w-[900px] mx-auto px-6 text-center">
        <span className="text-[#B09B84] uppercase tracking-widest text-[11px] font-bold block mb-8">Můj přístup</span>
        <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight text-[#1A1A1A] mb-12">
          Nefotím pózy, ale neopakovatelné momenty, které tvoří váš den.
        </h2>
        <div className="prose prose-lg font-light leading-relaxed text-[#1A1A1A]/70 mx-auto">
          <p>{data.text}</p>
        </div>
        
        {/* TLAČÍTKO VEDOUCÍ NA BRNO (Hlavní informace) */}
        <div className="mt-12">
           <Link href="/svatebni-fotograf/svatebni-fotograf-brno" className="inline-flex items-center gap-3 uppercase tracking-widest text-[11px] font-bold border-b border-black/20 pb-2 hover:border-[#B09B84] transition-all">
             Zjistit podrobnosti o spolupráci a cenách <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>
      </section>

      {/* 3. NEJNOVĚJŠÍ PŘÍBĚHY */}
      <section className="py-24 bg-white border-y border-black/5">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-center md:text-left">
            <div>
              <span className="text-[#B09B84] uppercase tracking-widest text-[11px] font-bold block mb-4">Portfolio</span>
              <h2 className="font-serif text-4xl font-light text-[#1A1A1A]">Inspirujte se</h2>
            </div>
            <Link href="/svatebni-pribehy" className="group inline-flex items-center gap-3 uppercase tracking-widest text-[10px] font-bold border-b border-black/10 pb-2 hover:border-[#B09B84] transition-all">
              Všechny příběhy <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stories?.map((story) => (
              <Link href={`/svatebni-pribehy/${story.slug}`} key={story.slug} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] mb-6 bg-black/5">
                  {story.cover_image && (
                    <Image 
                      src={story.cover_image} 
                      alt={story.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <h3 className="font-serif text-2xl font-light text-[#1A1A1A] group-hover:text-[#B09B84] transition-colors">
                  {story.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INFORMACE */}
      <section className="py-32">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#B09B84]/10 flex items-center justify-center mb-8 text-[#B09B84]">
              <Camera strokeWidth={1} size={32} />
            </div>
            <h3 className="font-serif text-xl mb-4">Profesionální výbava</h3>
            <p className="font-light text-[#1A1A1A]/60 leading-relaxed">Špičková technika a záložní vybavení jsou pro mě samozřejmostí pro váš klid.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#B09B84]/10 flex items-center justify-center mb-8 text-[#B09B84]">
              <MapPin strokeWidth={1} size={32} />
            </div>
            <h3 className="font-serif text-xl mb-4">Dojedu za vámi</h3>
            <p className="font-light text-[#1A1A1A]/60 leading-relaxed">Lokalitu {data.city} a tamní svatební místa dobře znám. Rád za vámi dorazím kamkoliv.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#B09B84]/10 flex items-center justify-center mb-8 text-[#B09B84]">
              <Heart strokeWidth={1} size={32} />
            </div>
            <h3 className="font-serif text-xl mb-4">Individuální přístup</h3>
            <p className="font-light text-[#1A1A1A]/60 leading-relaxed">Před každou svatbou si dáme videocall nebo kávu, abychom probrali vaši vizi.</p>
          </div>
        </div>
      </section>

      {/* 5. FINÁLNÍ CTA (Směřuje na Brno) */}
      <section className="pb-32 px-6">
        <div className="max-w-[1400px] mx-auto bg-[#1A1A1A] rounded-[3rem] py-24 text-center text-white px-4 shadow-2xl">
          <span className="uppercase tracking-[0.3em] text-[10px] opacity-60 block mb-6">Máte vybraný termín?</span>
          <h2 className="font-serif text-4xl md:text-6xl font-light mb-12">Pojďme spolu vytvořit<br />něco nezapomenutelného</h2>
          <Link href="/svatebni-fotograf/svatebni-fotograf-brno#kontakt" className="bg-white text-[#1A1A1A] px-12 py-5 rounded-2xl uppercase tracking-widest text-[11px] font-bold hover:bg-[#B09B84] hover:text-white transition-all inline-block hover:scale-105">
            Zjistit dostupnost vašeho termínu
          </Link>
        </div>
      </section>

    </div>
  );
}