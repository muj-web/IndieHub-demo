import Image from 'next/image';
import Link from 'next/link';
// Přidali jsme MonitorSmartphone a Rocket pro B2B sekci
import { Coffee, Camera, Map, Heart, ArrowRight, MonitorSmartphone, Rocket } from 'lucide-react';

export const metadata = {
  title: 'O mně | Radek Čech',
  description: 'Seznamte se s Radkem Čechem. Svatební fotograf z Brna, který miluje autentické momenty, kávu a cestování. Ale také digitální tvůrce a markeťák.',
};

export default function AboutPage() {
  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-32 pb-24 text-[#1A1A1A]">
      
      {/* 1. ÚVODNÍ SEKCE - Tvoje tvář a motto */}
      <section className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-32">
        <div className="lg:col-span-5 relative aspect-[4/5] md:aspect-video lg:aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-2xl">
          <Image 
            src="https://www.radekcech.cz/wp-content/uploads/2023/04/svatba-hotel-myslivna-brno-radek-cech-fotograf-00065-1.jpg" 
            alt="Radek Čech - Svatební fotograf" 
            fill 
            className="object-cover"
            priority
          />
        </div>
        <div className="lg:col-span-7">
          <span className="text-[#B09B84] uppercase tracking-[0.3em] text-[10px] font-bold block mb-6">
            Příběh za objektivem
          </span>
          <h1 className="font-serif text-5xl md:text-7xl font-light mb-8 leading-tight">
            Jsem Radek<span className="text-[#B09B84]">.</span>
          </h1>
          <p className="font-serif text-2xl font-light italic text-[#1A1A1A]/70 mb-10 leading-relaxed">
            "Věřím, že ty nejlepší momenty se nedají napózovat. Musí se prožít a já jsem tam od toho, abych je zachytil."
          </p>
          <div className="space-y-6 text-[#1A1A1A]/60 font-light leading-relaxed">
            <p>Moje cesta k fotografii nebyla o technice, ale o lidech. Od roku 2014, kdy jsem nafotil svou první svatbu, mě fascinuje, jak každá rodina, každý pár a každé místo vypráví úplně jiný příběh.</p>
            <p>Dnes mám za sebou přes stovku svateb po celé České republice. I když jsem doma v Brně, moje práce mě zavedla na úžasná místa od Šumavy až po Beskydy.</p>
          </div>
        </div>
      </section>

      {/* 2. ČÍSLA A DŮVĚRA */}
      <section className="bg-white py-24 border-y border-black/5 mb-32">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: 'Svateb nafoceno', value: '100+' },
            { label: 'Let zkušeností', value: '10+' },
            { label: 'Odevzdaných fotek', value: '50k+' },
            { label: 'Vypitých káv', value: '∞' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-serif text-4xl md:text-5xl font-light mb-2 text-[#B09B84]">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-widest font-bold opacity-40">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FILOSOFIE */}
      <section className="max-w-[1000px] mx-auto px-6 mb-32">
        <div className="text-center mb-20">
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-8">Nefotím pro Instagram, ale pro vaše vzpomínky</h2>
          <div className="w-20 h-[1px] bg-[#B09B84] mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-light">Být neviditelným svědkem</h3>
            <p className="text-sm font-light text-[#1A1A1A]/60 leading-relaxed">
              Nejčastější kompliment, který dostávám? "Ani jsme nevěděli, že tam jsi." To je pro mě největší odměna. Reportážní styl znamená, že nezasahuji do děje. Jsem tam, abych zachytil slzu vašeho tatínka nebo smích kamarádů, aniž by o tom věděli.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-light">Světlo a atmosféra</h3>
            <p className="text-sm font-light text-[#1A1A1A]/60 leading-relaxed">
              Miluji přirozené světlo. Západy slunce na vinici, ranní mlhu u jezera nebo svit svíček při hostině. Moje editace je nadčasová – nepodléhá módním filtrům, které za tři roky nebudou vypadat dobře. Vaše fotky musí být krásné i za 30 let.
            </p>
          </div>
        </div>
      </section>

      {/* 4. DVA SVĚTY (Yin & Yang) - Osobní vs B2B */}
      <section className="max-w-[1400px] mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEVÁ STRANA - Osobní (Světlý box) */}
          <div className="bg-white border border-black/5 rounded-[3rem] p-10 md:p-14 shadow-sm flex flex-col justify-between group">
            <div>
              <span className="text-[#B09B84] uppercase tracking-widest text-[10px] font-bold block mb-6">Mimo práci</span>
              <h2 className="font-serif text-4xl md:text-5xl font-light mb-10 leading-tight">Co mě definuje,<br />když nefotím?</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                <div className="flex items-start gap-4">
                  <Coffee className="text-[#B09B84] shrink-0" size={24} strokeWidth={1} />
                  <div>
                    <h4 className="font-serif text-lg mb-1">Výběrová káva</h4>
                    <p className="text-[11px] font-light opacity-60 leading-relaxed">Ranní rituál s V60 a brněnské pražírny.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Map className="text-[#B09B84] shrink-0" size={24} strokeWidth={1} />
                  <div>
                    <h4 className="font-serif text-lg mb-1">Cestování</h4>
                    <p className="text-[11px] font-light opacity-60 leading-relaxed">Od Asie po hory v Polsku. Objevování inspiruje.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Heart className="text-[#B09B84] shrink-0" size={24} strokeWidth={1} />
                  <div>
                    <h4 className="font-serif text-lg mb-1">Rodina</h4>
                    <p className="text-[11px] font-light opacity-60 leading-relaxed">Čas se synem Matym a rodinou je základ.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Camera className="text-[#B09B84] shrink-0" size={24} strokeWidth={1} />
                  <div>
                    <h4 className="font-serif text-lg mb-1">Analogy</h4>
                    <p className="text-[11px] font-light opacity-60 leading-relaxed">Zpomalení procesu s filmovým foťákem.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000 mt-auto">
              <Image 
                src="https://www.radekcech.cz/wp-content/uploads/2023/08/svatebni-fotograf-brno-radek-cech-bg-4.jpg" 
                alt="Radek Čech osobní" 
                fill 
                className="object-cover"
              />
            </div>
          </div>

          {/* PRAVÁ STRANA - B2B (Tmavý box) */}
          <div className="bg-[#0F1115] rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between">
            {/* Dekorativní gradient */}
            <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-[#B09B84]/10 to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
              <div>
                <span className="text-[#B09B84] uppercase tracking-widest text-[10px] font-bold font-sans block mb-6">Druhý svět</span>
                <h2 className="font-sans text-4xl md:text-5xl font-light mb-8 leading-tight">
                  Nejsem jen fotograf.<br />
                  Jsem <span className="font-medium">digitální tvůrce</span>.
                </h2>
                <div className="space-y-4 text-white/70 font-light leading-relaxed text-sm mb-12">
                  <p>Moje posedlost vizuálnem nekončí u fotek. Své kreativní vidění a smysl pro detail přenáším i do digitálního světa. Pomáhám firmám budovat značky, tvořím moderní weby a nastavuji funkční marketing pod hlavičkou <strong className="text-white font-medium">DigitalniTvurce.cz</strong>.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 mt-auto">
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <MonitorSmartphone className="text-[#B09B84] mb-4" size={24} strokeWidth={1} />
                  <h4 className="font-sans text-base mb-1 font-medium text-white">Tvorba webů</h4>
                  <p className="text-[11px] font-light text-white/50 leading-relaxed">Moderní, rychlé a konverzní weby, které vyprávějí příběh.</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <Rocket className="text-[#B09B84] mb-4" size={24} strokeWidth={1} />
                  <h4 className="font-sans text-base mb-1 font-medium text-white">Marketing</h4>
                  <p className="text-[11px] font-light text-white/50 leading-relaxed">Strategie, vizuální identita a kampaně, co dávají smysl.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <Link href="/firmy" className="inline-flex items-center gap-4 bg-white text-[#0F1115] px-8 py-4 rounded-2xl uppercase tracking-widest text-[10px] font-bold hover:bg-[#B09B84] hover:text-white transition-all shadow-xl">
                  Prozkoumat B2B služby
                </Link>
                <a href="https://digitalnitvurce.cz" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 text-white/60 hover:text-white uppercase tracking-widest text-[10px] font-bold transition-colors">
                  Přejít na web <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. SOCIÁLNÍ SÍTĚ */}
      <section className="text-center pt-20 max-w-[1000px] mx-auto px-6 border-t border-black/5 mt-16">
        <span className="text-[#B09B84] uppercase tracking-widest text-[10px] font-bold block mb-10">
          Zůstaňme v kontaktu
        </span>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {[
            { name: 'Instagram', url: 'https://www.instagram.com/radek_cech/' },
            { name: 'Facebook', url: 'https://www.facebook.com/radekcechcz/' },
            { name: 'Pinterest', url: 'https://cz.pinterest.com/Radek_Cech/' },
            { name: 'LinkedIn', url: 'https://www.linkedin.com/in/radekcechcz/' },
            { name: 'X', url: 'https://x.com/radek_cech' },
          ].map((social) => (
            <a 
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-2xl md:text-3xl font-light text-[#1A1A1A]/50 hover:text-[#1A1A1A] hover:-translate-y-1 transition-all duration-300"
            >
              {social.name}
            </a>
          ))}
        </div>
      </section>

    </div>
  );
}