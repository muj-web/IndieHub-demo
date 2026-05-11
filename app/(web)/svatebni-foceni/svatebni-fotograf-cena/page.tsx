import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Calculator, Camera, Heart, ArrowRight } from 'lucide-react';
import RelatedStories from '@/app/components/web/RelatedStories';

export const metadata = {
  title: 'Svatební fotograf cena | Radek Čech',
  description: 'Jaká je cena za svatební focení? Je cena adekvátní k ostatním položkám na svatebním seznamu? Přečtěte si upřímný pohled na ceny svatebních fotografů.',
};

export default async function PriceArticlePage() {
  
// Stáhneme 4 nejnovější články, ale odfiltrujeme landing pages
  const { data: stories } = await supabase
    .from('blog_posts')
    .select('title, slug, cover_image')
    .eq('category', 'Svatební focení') 
    .neq('slug', '/svatebni-foceni/svatebni-fotograf-cena') // Schováme tuhle stránku (sebe sama)
    .neq('slug', '/denik/svatebni-harmonogram') // Schováme i harmonogram, ať tam jsou jen reálné svatby
    .order('created_at', { ascending: false })
    .limit(4);

  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-32 pb-24 text-[#1A1A1A]">
      {/* ... zbytek tvojí stránky zůstává úplně stejný ... */}
      
      {/* 1. HERO SEKCE */}
      <section className="max-w-[1200px] mx-auto px-6 mb-24 text-center">
        <span className="text-[#B09B84] uppercase tracking-[0.3em] text-[10px] font-bold block mb-6">Průvodce rozpočtem</span>
        <h1 className="font-serif text-5xl md:text-7xl font-light mb-10 leading-tight">
          Svatební fotograf <span className="italic text-[#B09B84]">cena</span>
        </h1>
        <div className="relative w-full aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 border border-black/5">
          <Image 
            src="https://www.radekcech.cz/wp-content/uploads/2023/08/svatebni-fotograf-brno-radek-cech-bg-4.jpg" 
            alt="Svatební fotograf cena - Radek Čech" 
            fill 
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* 2. REALITA TRHU A CENA */}
      <section className="max-w-[900px] mx-auto px-6 mb-32">
        <div className="prose prose-lg md:prose-xl prose-stone font-light leading-relaxed max-w-none text-center mb-16 text-[#1A1A1A]/80">
          <h2 className="font-serif text-3xl mb-6">Jaká je cena za svatební focení? Je cena adekvátní k ostatním položkám na svatebním seznamu?</h2>
          <p>
            Tuhle otázku si klade asi většina lidí, kteří plánují svatbu. Ve zkratce by se dalo říct, že cena svatebního focení se pohybuje reálně od 3 000 kč, klidně až do 60 000 kč a víc.
          </p>
          <strong className="block mt-8 text-[#B09B84] font-medium text-2xl italic">
            Běžný průměr může být od 12 tis. do 25 tis. za celý den.
          </strong>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* NÁKLADY FOTOGRAFA */}
          <div className="bg-white p-10 rounded-[2rem] border border-black/5 shadow-sm">
            <h3 className="font-serif text-2xl mb-6 flex items-center gap-3">
              <Calculator size={24} className="text-[#B09B84]" strokeWidth={1.5} /> 
              Proč svatební fotograf stojí klidně desítky tisíc?
            </h3>
            <div className="text-sm font-light text-[#1A1A1A]/70 mb-8 leading-relaxed space-y-4">
              <p>Na začátek se hodí říct, že práce profesionálního svatebního fotografa, je práce jako každá jiná. Schválně zmiňuji slovo „profesionální„, protože i mezi svatebními fotografy se najde celá řada těch, co to dělají tzv „bokem„.</p>
              <p>Fotograf je, nebo by aspoň měl být, živnostník jako každej jinej a k tomu se vážou nějaké povinnosti.</p>
            </div>
            <ul className="space-y-4">
              {[
                'živnost, daně, odvody, účetníctví',
                'investice do techniky, marketingu a vzdělání',
                'náklady na software',
                'amortizace techniky',
                'provoz auta',
                'pokrytí nákladu mimo sezónu'
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-xs font-medium uppercase tracking-wider opacity-70">
                  <Check size={14} className="text-[#B09B84] shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* ADEKVÁTNOST */}
          <div className="bg-[#1A1A1A] p-10 rounded-[2rem] text-white flex flex-col justify-center">
            <h3 className="font-serif text-2xl mb-6 text-[#B09B84]">Jak poznat, že je cena za focení svatby adekvátní?</h3>
            <div className="text-sm font-light opacity-80 leading-relaxed space-y-4">
              <p>Obecně se říká, že náklady na fotografa by se měli rovnat zhruba 10 % nákladů celé svatby.</p>
              <p>Já s tím tak docela nesouhlasím. Někdo může mít rozpočet na celou svatbu 40 000 kč a na fotografa dodatečný rozpočet 15 – 20 000 kč, protože si uvědomují, že fotky jsou to jediné, co po svatbě zůstane.</p>
              <p>Samozřejmě jsou pak i svatby s rozpočtem 300 000 kč ale za fotografa nejsou ochotni utratit víc jak 10 000 kč, protože to pro ně není priorita a radši udělají pořádnou párty pro 150 hostů.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MÝTUS: CENA vs KVALITA */}
      <section className="bg-white py-32 border-y border-black/5 mb-32 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
             <div className="absolute -top-10 -left-10 text-[12rem] font-serif text-[#F7F4EF] leading-none z-0">?</div>
             <div className="relative z-10">
                <h2 className="font-serif text-4xl md:text-5xl font-light mb-8 leading-tight">
                  Jednou pro vždy, cena není <br /><span className="text-[#B09B84] italic">ukazatelem kvality</span> fotografa
                </h2>
                <div className="space-y-6 text-[#1A1A1A]/70 font-light leading-relaxed">
                  <p>O kvalitě fotografa vypovídá jeho portfolio, zkušenosti a do jisté míry i obsazenost. Nikoliv cena.</p>
                  <p>Ve službách často platí pravidlo <strong>„když mě něco nebaví (nebo nechci dělat), tak tu cenu napálím třeba o 200 %“</strong>. A ono to funguje, někdy můžete mít pocit nějaké exclusivity, že dostáváte něco lepšího. Ale v některých případech, objednávate člověka, kterého to vlastně ani nebaví.</p>
                  <p>Na druhou stranu ale nemůžete očekávat, že fotograf, který je vybookavaný na 2 roky dopředu, že vám bude fotit svatbu za 15 tisíc.</p>
                </div>

                <div className="mt-10 p-6 bg-[#FAFAFA] border-l-4 border-[#B09B84] rounded-r-2xl">
                  <p className="italic text-[#1A1A1A]/80">„Ne vždy platí pravidlo čím dražší, tím lepší. Často můžete slyšet ‚ty jo, ten je drahej, ten bude asi dobrej‘ nebo naopak ‚to je nějaký levný, to asi nebude moc kvalitní‘.“</p>
                </div>

                <h3 className="font-serif text-2xl mt-10 mb-4">Kvalita vs cena</h3>
                <p className="text-[#1A1A1A]/70 font-light leading-relaxed">
                  Nízká či vysoká cena v zásadě neurčuje kvalitu fotografa. Kvalitu fotografa určuje jeho portfolio, zkušenosti a pozitivní reference. Cenu fotografa určuje jeho pozice na trhu, poptávka a sebevědomí. Proto můžete najít i levnější velmi kvalitní fotografy a opačně.
                </p>
             </div>
          </div>
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl">
             <Image 
              src="https://www.radekcech.cz/wp-content/uploads/2023/04/svatba-hotel-myslivna-brno-radek-cech-fotograf-00065-1.jpg" 
              alt="Kvalita svatební fotografie" 
              fill 
              className="object-cover"
             />
          </div>
        </div>
      </section>

      {/* 4. MOJE CENA */}
      <section className="max-w-[800px] mx-auto px-6 mb-32 text-center">
        <div className="inline-block p-4 rounded-full bg-[#B09B84]/10 mb-8 text-[#B09B84]">
          <Camera size={32} strokeWidth={1} />
        </div>
        <h2 className="font-serif text-4xl mb-8 font-light">Moje cena za svatební focení</h2>
        <p className="font-light text-[#1A1A1A]/70 mb-12 leading-relaxed text-lg">
          Můj ceník se neřídí žádným zlatým, diamantovým nebo all exclusive balíčkem. Moje <strong className="font-medium">cena je individuální</strong> a řídí se vašimi potřebami, časem, který na vaši svatbě strávím a dalšími individuálními kritérii, které probereme ideálně osobně. 
        </p>
        
        <div className="bg-white border border-[#B09B84]/30 p-12 rounded-[3rem] shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#B09B84] text-white px-8 py-2 rounded-bl-3xl text-[10px] uppercase font-bold tracking-widest">
            Orientačně můžete počítat
          </div>
          <div className="font-serif text-5xl md:text-6xl text-[#1A1A1A] mb-4 mt-4">
            12 000 <span className="text-2xl md:text-3xl text-[#B09B84] align-middle">–</span> 18 000 Kč
          </div>
          <div className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">za celodenní focení</div>
        </div>
      </section>

      {/* 5. FINÁLNÍ CTA */}
      <section className="max-w-[1000px] mx-auto px-6 mb-24">
        <div className="bg-[#1A1A1A] rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <Heart className="mx-auto mb-8 text-[#B09B84]" size={40} strokeWidth={1} />
            <h2 className="font-serif text-3xl md:text-5xl font-light mb-10 leading-tight">Probereme vaši svatbu osobně?</h2>
            <Link href="/kontakt" className="group inline-flex items-center gap-6">
              <span className="bg-[#B09B84] text-white px-12 py-5 rounded-2xl uppercase tracking-widest text-[11px] font-bold hover:bg-white hover:text-[#1A1A1A] transition-all duration-500 shadow-xl">
                Nezávazně poptat cenu
              </span>
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-[#1A1A1A] transition-all">
                <ArrowRight size={20} />
              </div>
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