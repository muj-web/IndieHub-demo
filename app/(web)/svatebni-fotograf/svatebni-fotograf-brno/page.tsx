'use client';

import { useState, useRef } from 'react'; // Opraveno na jeden čistý import
import { sendWeddingInquiry } from '@/app/actions/send-email';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Cormorant_Garamond, Montserrat } from 'next/font/google';

// --- NAČTENÍ PRÉMIOVÝCH FONTŮ ---
const cormorant = Cormorant_Garamond({ 
  subsets: ['latin', 'latin-ext'], 
  weight: ['300', '400', '600'],
  variable: '--font-cormorant' 
});
const montserrat = Montserrat({ 
  subsets: ['latin', 'latin-ext'], 
  weight: ['300', '400', '500'],
  variable: '--font-montserrat' 
});

// --- DATA PRO HORIZONTÁLNÍ PORTFOLIO ---
const stories = [
  { id: 1, title: "Svatba v Mohelenském dvoře", img: "https://www.radekcech.cz/wp-content/uploads/2025/11/Svatba-Mohelensky-dvur-radek-cech-bg.jpg" },
  { id: 2, title: "Zámeček Ostrov", img: "https://www.radekcech.cz/wp-content/uploads/2025/11/Zamecek-ostrov-svatba-radek-cech-bg-3.jpg" },
  { id: 3, title: "Farma Tasov", img: "https://www.radekcech.cz/wp-content/uploads/2026/03/Farma-tasov-svatba-radek-cech-bg.jpg" },
  { id: 4, title: "Míša a Petr – Chata Paprsek", img: "https://www.radekcech.cz/wp-content/uploads/2026/03/Misa-a-Petr-Chata-paprsek-Rychlebske-hory.avif" },
  { id: 5, title: "Penzion Kůlna Jedovnice", img: "https://www.radekcech.cz/wp-content/uploads/2025/10/Svatba-kulna-jedovnice-naty-a-dan-bg.jpg" },
  { id: 6, title: "Samota Křemen", img: "https://www.radekcech.cz/wp-content/uploads/2025/11/samota-Kremen-vysocina-svatba-radek-cech-bg.jpg" },
];

const faqs = [
  { q: "Máte volný termín?", a: "Pochopitelně je to zcela zásadní dotaz. Protože v případě, že bude vámi zvolený termín obsazený, tak další otázky jsou zbytečné." },
  { q: "Jaká je cena za focení svatby?", a: "Cenu za focení ovlivňuje pár věcí. Nemám žádné balíčky, kde byste se museli rozhodovat jestli chcete 200 nebo 500 fotek. Platíte za čas, který na vaši svatbě strávím. Nic víc, nic míň." },
  { q: "Fotíte svatby pouze v Brně? Nebo za námi můžete i přijet?", a: "Svatby jsem fotil od Lovosic po Havířov. Takže pro mě opravdu není problém dojet kamkoliv jen to bude částečně ovlivňovat konečnou cenu za focení." },
  { q: "Jak dlouho s námi na svatbě budete?", a: "To záleží hlavně na vás. V hlavní sezóně (květen až září) je minimální čas 8 hodin. Nefotím samostatně obřady. Jsem zejména reportážní fotograf a tak považuji za důležité být součásti svatby od příprav, ideálně až do začátku zábavy, klidně i déle. Zásadní je pro mě čas příjezdu. Čas odjezdu je pro mě spíše orientační a není pro mě problém zůstat déle než byla původní domluva." },
  { q: "Co záloha a smlouva?", a: "Já zálohy nevybírám. V případě, že se osobně sejdeme a vše si odsouhlasíme, je pro mě termín závazný. Snad jen v případě závažných zdravotních komplikací bych byl nucen focení zrušit ale i kdyby se tak mělo stát, budu se snažit vám pomoci najít adekvátní náhradu za sebe. Od roku 2014 se nestalo, že by byl termín zrušen z mé strany." },
];

export default function SvatebniFotografBrno() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  // PŘIDÁNO: Stavy pro formulář
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // --- LOGIKA PRO ODESLÁNÍ FORMULÁŘE ---
  async function handleSubmit(formData: FormData) {
    setStatus('loading');
    const result = await sendWeddingInquiry(formData);
    
    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
      console.error(result.error);
    }
  }

  // --- LOGIKA PRO HORIZONTÁLNÍ SCROLL PŘÍBĚHŮ ---
  const horizontalRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: horizontalProgress } = useScroll({ target: horizontalRef });
  const xTransform = useTransform(horizontalProgress, [0, 1], ["0%", "-75%"]);

  return (
    <div className={`${cormorant.variable} ${montserrat.variable} bg-[#FAFAFA] text-[#1A1A1A] font-sans selection:bg-[#B09B84] selection:text-white`}>
      
      {/* 1. HERO SEKCE */}
      <section className="relative h-[95vh] w-[95vw] mx-auto mt-6 flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl">
        <Image 
          src="https://www.radekcech.cz/wp-content/uploads/2023/08/svatebni-fotograf-brno-radek-cech-bg-4.jpg" 
          alt="Svatební fotograf Brno" 
          fill 
          className="object-cover object-[center_38%]" 
          priority 
        />
        <div className="absolute inset-0 bg-black/20" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-4"
        >
          <span className="uppercase tracking-[0.4em] text-white/80 text-[10px] md:text-xs mb-6 block font-medium">Autentická reportáž</span>
          <h1 className="font-serif text-white text-4xl md:text-6xl lg:text-8xl font-light tracking-tight mb-10 leading-none whitespace-nowrap">
            Svatební fotograf z Brna
          </h1>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            <Link href="#kontakt" className="uppercase tracking-widest text-[11px] font-medium text-white border-b border-white/30 pb-2 hover:border-white transition-all">
              Zjištění volného termínu na focení
            </Link>
            <Link href="#cena" className="uppercase tracking-widest text-[11px] font-medium text-white/70 border-b border-transparent pb-2 hover:text-white transition-all">
              Jaká je cena za focení?
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 2. TEXTOVÁ ČÁST A JEDNA DOMINANTNÍ FOTKA */}
      <section className="w-[80%] mx-auto py-32 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
        
        <div className="lg:col-span-6">
          <span className="text-[#B09B84] uppercase tracking-widest text-[10px] font-bold">O mně</span>
          <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-8 leading-tight font-light text-[#1A1A1A]">
            Svatební fotograf<br/>z Brna
          </h2>
          <div className="space-y-6 text-[#1A1A1A]/70 text-sm font-light leading-relaxed">
            <p>Troufám si odhadovat, že jste právě ve fázi hledání fotografa a vaše usíli při hledání vás přivedlo až sem. Plně chápu, co všechno obnáší plánování svatby a co všechno je potřeba vykomunikovat, zjistit, porovnat apod.</p>
            <p>Zároveň si uvědomuji, že ve vašem hledáčku je jistě více fotografů, které je nezbytné poptat, zjistit dostupnost, termín a celkové možnosti.</p>
            <p>Proto se snažím, vám cestu ke službota fotografa co nejvíce usnadnit a bez dalších kliček vám odpovědět na vše, co by vás mělo zajímat. Po přečtení této stránky, by vás mělo zajímat pouze jediné, a to, jestli mám volný termín. K tomu můžete využit formulář na konci stránky, kde také najdete ty nejčastější dotazy.</p>
            
            <h3 className="font-serif text-2xl text-[#1A1A1A] mt-10 mb-4">Jsem fotograf z Brna, ale rád za vámi přijedu</h3>
            <p>I když jsem doma v Brně, pole mé působnosti už dávno přesahuje hranice moravské metropole. Svatby fotím od roku 2014 a na kontě mám zhruba stovku svateb — od Lovosic po Havířov. Nejčastěji fotím svatby na Vysočině, jižní Moravě a v okolí Moravského krasu. Seznam míst se ale rok od roku rozšiřuje, takže opravdu fotím napříč celou Českou republikou.</p>
            <p className="font-medium text-[#1A1A1A]">Není důležité ptát se, jestli mám dost zkušeností — důležité je, jestli mé fotografie odpovídají vašim představám.</p>
          </div>
        </div>

        <div className="lg:col-span-6 w-full h-[600px] md:h-[400px] relative rounded-lg overflow-hidden shadow-xl border border-black/5">
          <Image 
            src="https://www.radekcech.cz/wp-content/uploads/2023/04/svatba-hotel-myslivna-brno-radek-cech-fotograf-00065-1.jpg"
            alt="Svatební fotografie Brno"
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover transition-transform duration-1000 hover:scale-105"
          />
        </div>
        
      </section>

      {/* 3. HORIZONTÁLNÍ SCROLL PŘÍBĚHŮ */}
      <section ref={horizontalRef} className="relative h-[300vh] bg-[#121212]">
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          <div className="w-[80%] mx-auto mb-16 flex justify-between items-end px-4">
            <div>
              <span className="text-[#B09B84] uppercase tracking-widest text-[10px] font-bold font-sans">Výběr z práce</span>
              <h2 className="font-serif text-4xl md:text-6xl text-white mt-4 font-light leading-none">Svatební příběhy</h2>
            </div>
            <Link href="/svatebni-pribehy" className="text-white/50 text-xs uppercase tracking-widest hover:text-white transition-colors pb-1 border-b border-white/20">Archiv galerií</Link>
          </div>

          <motion.div style={{ x: xTransform }} className="flex gap-10 px-[10vw] w-max items-stretch">
            {stories.map((story) => (
              <div key={story.id} className="relative w-[300px] md:w-[600px] shrink-0 aspect-video group overflow-hidden rounded-xl border border-white/10">
                <Image src={story.img} alt={story.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="font-serif text-xl md:text-2xl text-white font-light">{story.title}</h3>
                </div>
              </div>
            ))}

            <div className="relative w-[300px] md:w-[400px] shrink-0 aspect-video flex items-center justify-center border border-white/20 rounded-xl hover:bg-white/5 transition-colors">
              <Link href="/svatebni-pribehy" className="group flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white mb-4 transition-all duration-500 group-hover:bg-white group-hover:text-black">
                  <ArrowRight size={20} strokeWidth={1} />
                </div>
                <span className="uppercase tracking-widest text-xs text-white/70 group-hover:text-white">Všechny galerie</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. TIMELINE */}
      <section className="w-[80%] mx-auto py-32 border-t border-black/5">
        <div className="text-center mb-24">
          <span className="text-[#B09B84] uppercase tracking-widest text-[10px] font-bold font-sans">Krok za krokem</span>
          <h2 className="font-serif text-4xl md:text-5xl mt-4 font-light">Jak postupovat, když se mnou chcete spolupracovat</h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-20">
          {[
            { id: '01', t: 'Poptávka a dostupnost termínu', d: 'První krok? Zjistit, jestli mám váš termín volný. Nebojte se rezervovat i rok (nebo více) dopředu – oblíbené termíny mizí rychle. Do poptávky mi rovnou napište, kde se svatba bude konat a na jak dlouho byste mě orientačně chtěli. Minimální rozsah focení je 8 hodin.' },
            { id: '02', t: 'Cenová nabídka', d: 'Na základě poskytnutých informací vám potvrdím cenu za focení. Tu si ale můžete snadno spočítat i sami: Cena je 1 500 Kč / hodina. Takže například 10 hodin focení = 15 000 Kč. Jednoduchá matematika, žádné balíčky ani háčky. Částečně může cenu ovlivnit větší vzdálenost od Brna.' },
            { id: '03', t: 'Osobní schůzka, videocall nebo předsvatební focení', d: 'Pokud vám termín i cena vyhovují, navrhuji osobní schůzku nebo videohovor. Je fajn se před svatbou poznat – probrat vaše představy, zodpovědět otázky a třeba rozptýlit i obavy. Pokud chcete, můžeme si dát i předsvatební focení.' },
            { id: '04', t: 'Harmonogram', d: 'Před svatbou od vás budu chtít alespoň orientační harmonogram. Pomůže mi to být připravený na všechny důležité momenty. Rád vám s jeho tvorbou nebo úpravou pomůžu – mám za sebou desítky svateb a vím, co kde často drhne i co krásně funguje.' },
            { id: '05', t: 'Den D', d: 'Na svatbu dorazím podle domluvy – obvykle raději o něco dřív ale nikdy později. Ideální je, když mohu být přítomen už při ranních přípravách. Nejpozději však hodinu před obřadem, abych se stihl seznámit s prostředím i lidmi a měl vše připravené. Zůstávám tak dlouho, jak bude potřeba.' },
          ].map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex gap-10 md:gap-20 group">
              <div className="font-serif text-4xl italic text-[#B09B84]/40 group-hover:text-[#B09B84] transition-colors">{item.id}</div>
              <div className="pt-2">
                <h4 className="font-serif text-2xl mb-4">{item.t}</h4>
                <p className="text-sm font-light text-[#1A1A1A]/60 leading-relaxed max-w-xl">{item.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. CENA & FAQ */}
      <section id="cena" className="bg-[#F3EFE9] py-32 rounded-[3rem] mx-4">
        <div className="w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div className="flex flex-col justify-center">
            <span className="text-[#B09B84] uppercase tracking-widest text-[10px] font-bold font-sans">Investice</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-10 font-light leading-tight">Jaká je cena<br/>za svatební focení?</h2>
            
            <div className="mb-10">
              <div className="font-serif text-5xl md:text-6xl font-light tracking-wide text-[#1A1A1A]">
                15 000 Kč
              </div>
              <p className="text-sm font-bold text-[#1A1A1A]/80 mt-6">Nejčastěji mě na svatbě chcete 10 hodin</p>
              <p className="text-sm font-light text-[#1A1A1A]/70 mt-2">10 hodin je dostatek času na zaznamenání celého dne od ranních příprav až po začátek zábavy.</p>
            </div>

            <div className="space-y-4 text-xs md:text-sm font-light text-[#1A1A1A]/70 border-t border-black/10 pt-10">
              <p className="font-bold text-[#1A1A1A]/90 mb-4">Co může ovlivnit cenu:</p>
              <p>+ vzdálenost od Brna</p>
              <p>+ reálný čas strávený na vaši svatbě (+1500kč každá další hodina)</p>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-3xl mb-12 font-light">Co vás nejčastěji zajímá</h3>
            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-black/10">
                  <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full py-6 flex justify-between items-center text-left hover:text-[#B09B84] transition-colors">
                    <span className="font-serif text-lg pr-4">{faq.q}</span>
                    <motion.div animate={{ rotate: openFaq === idx ? 180 : 0 }}><ChevronDown size={16} /></motion.div>
                  </button>
                  <motion.div initial={false} animate={{ height: openFaq === idx ? 'auto' : 0, opacity: openFaq === idx ? 1 : 0 }} className="overflow-hidden">
                    <div className="pb-8 text-sm font-light leading-relaxed text-[#1A1A1A]/60 pr-10">{faq.a}</div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. KONTAKTNÍ FORMULÁŘ --- AKTUALIZOVÁNO PRO ODESÍLÁNÍ */}
      <section id="kontakt" className="w-[80%] mx-auto py-32">
        <div className="text-center mb-20">
          <span className="text-[#B09B84] uppercase tracking-widest text-[10px] font-bold font-sans block mb-4">Rezervujte si svůj termín</span>
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-8 max-w-3xl mx-auto leading-tight">
            Napište mi – rád se s vámi sejdu a probereme vaši svatbu.
          </h2>
          <div className="text-sm font-light text-[#1A1A1A]/60 max-w-2xl mx-auto space-y-4">
            <p>Poslední co potřebujete vědět, jestli jsem stále dostupný i ve vašem termínu. Aktuálně beru rezervace termínu na rok 2026 i 2027.</p>
            <p>Takže pokud si chcete "zafixovat" aktuální cenu za focení, doporučuji abyste mi napsali co nejdříve.</p>
          </div>
        </div>

        <form action={handleSubmit} className="max-w-3xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <input name="name" type="text" placeholder="Vaše jméno" required className="w-full bg-transparent border-b border-black/20 pb-4 text-sm font-light outline-none focus:border-[#B09B84] transition-colors" />
            <input name="email" type="email" placeholder="E-mail" required className="w-full bg-transparent border-b border-black/20 pb-4 text-sm font-light outline-none focus:border-[#B09B84] transition-colors" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <input name="phone" type="tel" placeholder="Telefon (nepovinné)" className="w-full bg-transparent border-b border-black/20 pb-4 text-sm font-light outline-none focus:border-[#B09B84] transition-colors" />
            <input name="date" type="text" placeholder="Datum svatby (např. 15.08.2025)" required className="w-full bg-transparent border-b border-black/20 pb-4 text-sm font-light outline-none focus:border-[#B09B84] transition-colors" />
          </div>
          <input name="location" type="text" placeholder="Místo svatby / Lokace" required className="w-full bg-transparent border-b border-black/20 pb-4 text-sm font-light outline-none focus:border-[#B09B84] transition-colors" />
          <textarea name="message" rows={4} placeholder="Vaše zpráva (nepovinné)" className="w-full bg-transparent border-b border-black/20 pb-4 text-sm font-light outline-none focus:border-[#B09B84] transition-colors resize-none" />
          
          <div className="flex flex-col items-center gap-4 pt-8">
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="bg-[#1A1A1A] text-white px-16 py-5 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-[#B09B84] transition-colors duration-500 shadow-xl disabled:opacity-50"
            >
              {status === 'loading' ? 'Odesílám...' : 'Odeslat poptávku'}
            </button>

            {status === 'success' && (
              <p className="text-green-600 font-serif italic text-sm animate-pulse">Zpráva byla úspěšně odeslána. Brzy se vám ozvu!</p>
            )}
            {status === 'error' && (
              <p className="text-red-500 font-serif italic text-sm">Něco se pokazilo. Zkuste to prosím znovu nebo mi napište přímo.</p>
            )}
          </div>
        </form>
      </section>

    </div>
  );
}