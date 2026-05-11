'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  CheckCircle2, Users, Camera, Sparkles, Heart, ArrowRight
} from 'lucide-react';
import RelatedStories from '@/app/components/web/RelatedStories';
import { supabase } from '@/lib/supabase';

const timelineSteps = [
  {
    id: '01',
    title: 'Ranní přípravy',
    desc: 'Chvíle plná očekávání. Dobře naplánované přípravy pomáhají zajistit klidný průběh celého dne. Navíc jsou ranní momenty krásnou příležitostí pořídit přirozené a emotivní fotografie.',
    img: 'https://www.radekcech.cz/wp-content/uploads/2023/04/svatba-hotel-myslivna-brno-radek-cech-fotograf-00065-1.jpg'
  },
  {
    id: '02',
    title: 'First Look',
    desc: 'Tato tradice pochází ze zahraničí a umožňuje vám užít si tento okamžik v klidu a bez rušení. Praktické je, že hned poté může proběhnout focení páru, takže den probíhá plynuleji.',
    img: 'https://www.radekcech.cz/wp-content/uploads/2025/11/Ranc-u-jelena-marianske-udoli-svatba-radek-cech-bg.jpg'
  },
  {
    id: '03',
    title: 'Svatební obřad',
    desc: 'Zlatý hřeb dne. Obecně platí, že nevěsta stojí po pravé ruce ženicha. Výjimkou bývají církevní svatby, kde je dobré se předem informovat u oddávajícího.',
    img: 'https://www.radekcech.cz/wp-content/uploads/2023/08/svatebni-fotograf-brno-radek-cech-bg-4.jpg'
  },
  {
    id: '04',
    title: 'Skupinové focení',
    desc: 'Nejčastěji se pořizuje bezprostředně po obřadu, dokud jsou hosté upravení a svěží. Připravte si seznam skupin dopředu a pověřte koordinátora, aby focení nezabralo více než 30 minut.',
    img: 'https://www.radekcech.cz/wp-content/uploads/2024/02/svatba-pod-paly-svatebni-fotograf-brno-0001.jpg'
  },
  {
    id: '05',
    title: 'Svatební hostina',
    desc: 'Standardně se podává polévka a svíčková, ale často se už ustupuje k volnějšímu rautu. Nezapomeňte na proslovy, kde většinou promluví otec nevěsty, ženich a svědci.',
    img: 'https://www.radekcech.cz/wp-content/uploads/2023/04/svatba-na-statku-radek-cech-fotograf-0045.jpg'
  },
  {
    id: '06',
    title: 'Krájení dortu',
    desc: 'Víc než jen tradice. Když pár společně drží nůž, představuje to první společný úkol v manželství a symbolizuje to vzájemnou péči a sdílení hojnosti s blízkými.',
    img: 'https://www.radekcech.cz/wp-content/uploads/2023/08/svatba-v-prirode-radek-cech-0023.jpg'
  },
  {
    id: '07',
    title: 'Společné focení',
    desc: 'Zlatá hodinka. Nejlepší čas pro romantické portréty je těsně před západem slunce, kdy je světlo nejměkčí. Ideální je rozdělit si focení do kratších bloků, aby vás hosté nepostrádali.',
    img: 'https://www.radekcech.cz/wp-content/uploads/2023/04/svatba-hotel-myslivna-brno-radek-cech-fotograf-00065-1.jpg'
  },
  {
    id: '08',
    title: 'První tanec',
    desc: 'Začátek vaší společné cesty životem. Nemusíte umět skvěle tančit, důležité je si to užít. Jednoduchá choreografie vám může pomoci cítit se jistěji.',
    img: 'https://www.radekcech.cz/wp-content/uploads/2025/11/Ranc-u-jelena-marianske-udoli-svatba-radek-cech-bg.jpg'
  },
  {
    id: '09',
    title: 'Házení kytice',
    desc: 'Zábava pro svobodné dívky. Alternativou je "vyplétání stužek", kdy má nevěsta zavázané oči a postupně odstřihuje stuhy, které svobodné dívky drží.',
    img: 'https://www.radekcech.cz/wp-content/uploads/2023/08/svatebni-fotograf-brno-radek-cech-bg-4.jpg'
  },
  {
    id: '10',
    title: 'Party a zábava',
    desc: 'Večerní jízda začíná. Od her jako novomanželský kvíz, přes dobrého DJe až po svatební prskavky, které jsou skvělou příležitostí pro krásné večerní fotografie.',
    img: 'https://www.radekcech.cz/wp-content/uploads/2024/02/svatba-pod-paly-svatebni-fotograf-brno-0001.jpg'
  }
];

export default function WeddingTimelinePage() {
  const horizontalRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: horizontalRef,
  });

  const xTransform = useTransform(scrollYProgress, [0, 1], ['0%', '-75%']);

  // Stav pro uložení článků z databáze
  const [stories, setStories] = useState<any[]>([]);

  // Načtení dat při prvním vykreslení stránky
  useEffect(() => {
    const fetchStories = async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('title, slug, cover_image')
        .eq('category', 'Svatební focení')
        // 1. ZDE MUSÍ BÝT PŘESNĚ TEN SLUG, KTERÝ MÁ HARMONOGRAM V DATABÁZI (Zkontroluj to v Supabase!)
        // Může to být třeba takto (podle tvé složky):
        .neq('slug', '/svatebni-foceni/svatebni-harmonogram') 
        // 2. Řádek schovávající Cenu jsem úplně smazal, takže teď už se Cena normálně ukáže!
        .not('cover_image', 'is', null) 
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (data) setStories(data);
    };

    fetchStories();
  }, []);

  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-32 pb-24 text-[#1A1A1A]">
      
      {/* 1. HERO SEKCE - Čistý magazínový styl */}
      <section className="max-w-[1200px] mx-auto px-6 mb-24 text-center">
        <span className="text-[#B09B84] uppercase tracking-[0.3em] text-[10px] font-bold block mb-6">
          Plánování s lehkostí
        </span>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light mb-10 leading-tight text-[#1A1A1A]">
          Svatební <span className="italic text-[#B09B84]">harmonogram</span>
        </h1>
        <div className="relative w-full aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 border border-black/5">
          <Image 
            src="https://www.radekcech.cz/wp-content/uploads/2025/11/Ranc-u-jelena-marianske-udoli-svatba-radek-cech-bg.jpg" 
            alt="Svatební harmonogram - Radek Čech" 
            fill 
            className="object-cover"
            priority
          />
        </div>
        <p className="text-[#1A1A1A]/60 font-serif text-xl italic max-w-2xl mx-auto">
          "Není nutné dodržovat ho na minutu přesně, slouží jako vodítko pro vás, hosty i dodavatele."
        </p>
      </section>

      {/* 2. HLAVNÍ OBSAH - REDAKČNÍ STYL */}
      <section className="max-w-[850px] mx-auto px-6 py-16">
        <div className="prose prose-lg md:prose-xl prose-stone font-light leading-relaxed text-[#1A1A1A]/80 max-w-none">
          <p className="font-serif text-2xl leading-relaxed text-[#1A1A1A] mb-12 border-l-4 border-[#B09B84] pl-8 italic">
            Když se setkáme tváří v tvář, jedním z klíčových témat bude harmonogram. I když plánujete svatbu rok dopředu, je dobré mít aspoň hrubou představu, jak byste si svůj den přáli prožít.
          </p>
          
          <h2 className="font-serif text-4xl text-[#1A1A1A] mt-20 mb-8 font-light italic">Proč vám harmonogram pomůže?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12 not-prose">
            {[
              { icon: <CheckCircle2 />, title: 'Klid a organizace', text: 'Zajistí, aby vše probíhalo hladce a bez zbytečného stresu.' },
              { icon: <Users />, title: 'Orientace hostů', text: 'Usnadní hostům zjistit, co se bude dít dál.' },
              { icon: <Sparkles />, title: 'Koordinace dodavatelů', text: 'Fotograf i catering vědí přesně, s čím počítat.' },
              { icon: <Camera />, title: 'Žádné zmeškané momenty', text: 'Abych mohl zachytit všechny důležité okamžiky.' }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-black/5 shadow-sm">
                <div className="text-[#B09B84] shrink-0">{item.icon}</div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest mb-1">{item.title}</h4>
                  <p className="text-sm opacity-60 font-light">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="font-serif text-3xl text-[#1A1A1A] mt-24 mb-6">Jak svatební harmonogram naplánovat?</h3>
          <ul className="space-y-4 mb-16">
            <li><strong>Začněte s časovou osou:</strong> Zapište si důležité události, od ranních příprav po večerní tanec.</li>
            <li><strong>Určete čas pro každý bod:</strong> Zohledněte přesuny, převlékání i rezervu na nečekané.</li>
            <li><strong>Buďte flexibilní:</strong> Nesnažte se o přesnost na minutu.</li>
            <li><strong>Informujte dodavatele:</strong> Ujistěte se, že ho všichni znají.</li>
          </ul>

          <div className="bg-[#B09B84]/5 p-10 rounded-[2.5rem] my-12 border border-[#B09B84]/20">
            <h4 className="font-serif text-2xl mb-6">Na co při plánování myslet:</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 list-none pl-0 text-base">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#B09B84] mt-2 shrink-0" />
                <span><strong>Místo a doprava:</strong> Jak daleko od sebe místa jsou?</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#B09B84] mt-2 shrink-0" />
                <span><strong>Fotografování:</strong> Kolik času mu věnujeme?</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#B09B84] mt-2 shrink-0" />
                <span><strong>Catering:</strong> Kdy a co se bude jíst?</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#B09B84] mt-2 shrink-0" />
                <span><strong>Vaše přání:</strong> Je to váš den, upravte si ho podle sebe.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. HORIZONTÁLNÍ SCROLL - VZOR HARMONOGRAMU */}
      <section ref={horizontalRef} className="relative h-[500vh] bg-[#121212] mt-16">
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          <div className="max-w-[1400px] w-full mx-auto mb-16 flex justify-between items-end px-10">
            <div>
              <span className="text-[#B09B84] uppercase tracking-[0.3em] text-[10px] font-bold">Vzor harmonogramu</span>
              <h2 className="font-serif text-4xl md:text-7xl text-white mt-4 font-light leading-none">
                Průběh <span className="italic">dne</span>
              </h2>
            </div>
            <div className="hidden md:block text-white/30 text-xs uppercase tracking-widest pb-1 border-b border-white/10">
              Scrollujte pro zobrazení kroků
            </div>
          </div>

          <motion.div style={{ x: xTransform }} className="flex gap-12 px-[10vw] w-max items-stretch">
            {timelineSteps.map((step) => (
              <div key={step.id} className="relative w-[350px] md:w-[550px] shrink-0 group">
                <div className="relative aspect-[4/5] md:aspect-[16/10] overflow-hidden rounded-[2rem] border border-white/10 mb-8">
                  <Image 
                    src={step.img} 
                    alt={step.title} 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute top-8 left-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-serif text-xl">
                    {step.id}
                  </div>
                </div>
                <div className="px-4">
                  <h3 className="font-serif text-3xl md:text-4xl text-white mb-4 font-light italic">{step.title}</h3>
                  <p className="text-white/60 font-light leading-relaxed text-sm md:text-base max-w-md">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}

            {/* Závěrečná karta */}
            <div className="relative w-[300px] md:w-[500px] shrink-0 flex flex-col items-center justify-center bg-white/5 rounded-[3rem] border border-white/10 p-12 text-center">
              <Heart className="text-[#B09B84] mb-8" size={48} strokeWidth={1} />
              <h3 className="font-serif text-3xl text-white mb-6">Poraďte se s profesionály</h3>
              <p className="text-white/40 font-light text-sm mb-10">
                Fotografové jsou na svatbách od rána do večera. Dokážou velmi objektivně poradit, co funguje. Neváhejte mi napsat.
              </p>
              <Link href="/kontakt" className="bg-[#B09B84] text-white px-10 py-4 rounded-2xl uppercase tracking-widest text-[10px] font-bold hover:bg-white hover:text-black transition-all shadow-xl">
                Nezávazná poptávka
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. ZÁVĚREČNÉ TIPY */}
      <section className="bg-white py-32">
        <div className="max-w-[850px] mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl font-light italic mb-6">Nejlepší harmonogram?</h2>
            <div className="w-20 h-[1px] bg-[#B09B84] mx-auto"></div>
          </div>
          
          <div className="prose prose-lg prose-stone font-light leading-relaxed text-[#1A1A1A]/80 max-w-none text-center">
            <p>
              Za ty roky, co fotím svatby, jsem zažil různé harmonogramy. Od těch s přesností na minutu až po ty, kde je naplánovaný jen obřad a zbytek se přizpůsobí. 
            </p>
            <p className="font-medium text-[#1A1A1A]">
              Nebojte se být flexibilní a hlavně si nezapomeňte dát dostatek času na relaxaci. Je to váš den, tak si ho užijte naplno!
            </p>
          </div>

          <div className="mt-24 pt-16 border-t border-black/5 flex justify-center">
            <Link href="/denik" className="group inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold text-[#1A1A1A] hover:text-[#B09B84] transition-colors">
              Zpět do deníku <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. DALŠÍ ČLÁNKY Z TÉTO RUBRIKY */}
      <RelatedStories 
        stories={stories || []} 
        sectionTitle="Další tipy ke svatebnímu focení" 
        linkPrefix="/blog/" 
      />

    </div>
  );
}