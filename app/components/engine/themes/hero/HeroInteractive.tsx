"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants, Transition } from "framer-motion";
import { Search, SendHorizonal, BrainCircuit, X, MessageSquare, PlusCircle } from "lucide-react";

// KONFIGURACE ANIMACÍ S EXPLICITNÍMI TYPY
const cinematicTransition: Transition = { 
  type: "spring", 
  stiffness: 200, 
  damping: 30 
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function HeroInteractive({ 
  data, 
  projectName = "Projekt" 
}: { 
  data?: any, 
  projectName?: string 
}) {
  // --- LOGIKA CHATBOTA ---
  const [isBotExpanded, setIsBotExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus na input při otevření nebo kliknutí
  useEffect(() => {
    if (!isBotExpanded) {
      inputRef.current?.focus();
    }
  }, [isBotExpanded]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      setIsBotExpanded(true);
    }
  };

  // --- NEUTRÁLNÍ CHAMELEON DATA ---
  const content = {
    badge: data?.badge || "Inteligentní poptávkový systém",
    headingNormal: data?.headingNormal || "Najdeme vám",
    headingAccent: data?.headingAccent || "řešení bez hledání.",
    description: data?.description || "Zde bude hlavní úvodní text vašeho nového webu, u solixinotratní poptávnu s novoi, hom end premiumm, Mission control prehemnto.",
    image: data?.image || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2940",
    placeholder: data?.placeholder || "Zadejte vaši poptávku nebo dotaz...",
    botName: data?.botName || `${projectName} AI Asistent`,
    botResponse: data?.botResponse || "Zpracovávám váš požadavek... Chcete si prohlédnout naše portfolio, nebo se rovnou pobavíme o ceně?",
    poptavkaBtn: data?.poptavkaBtn || "Vložit hromadnou poptávku"
  };

  const glassStyle = "bg-[var(--color-dt-surface)]/60 backdrop-blur-xl border border-[var(--color-dt-text)]/10";

  return (
    // HLAVNÍ SEKCE: Úprava pro vycentrování obsahu
    <section className="relative z-30 h-[100vh] min-h-[700px] flex flex-col items-center justify-center px-6 overflow-hidden bg-[var(--color-dt-bg)]">
      
      {/* BACKGROUND & OVERLAY: Tmavé pozadí s neutrálním geometrickým vzorem */}
      <div className="absolute inset-0 z-0">
        {/* Jemná Next.js mřížka na pozadí */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#F1F2F208_1px,transparent_1px),linear-gradient(to_bottom,#F1F2F208_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        {/* Přechodový gradient přetékající do barvy pozadí */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-dt-bg)]/40 via-[var(--color-dt-bg)]/20 to-[var(--color-dt-bg)]" />
      </div>

      {/* OBSAH: Vycentrovaný flex container */}
      <div className="relative z-20 max-w-5xl w-full text-center flex flex-col items-center justify-center text-[var(--color-dt-text)] flex-grow">
        
        {/* OVERLAY PŘI OTEVŘENÉM MODALU */}
        <AnimatePresence>
          {isBotExpanded && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsBotExpanded(false)}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm cursor-pointer"
            />
          )}
        </AnimatePresence>

        {/* CENTROVANÝ STROM KOMPONENT */}
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={{ visible: { transition: { staggerChildren: 0.15 } } } as Variants}
          className="flex flex-col items-center justify-center gap-12 w-full"
        >
          
          {/* BADGE: Vycentrovaný nahoře */}
          <motion.div 
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-dt-accent)]/30 bg-[var(--color-dt-accent)]/5 text-[var(--color-dt-accent)] text-[10px] font-bold tracking-[0.2em] uppercase relative z-10"
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-dt-accent)' }} />
            {content.badge}
          </motion.div>

          {/* NADPIS: Dominantní a vycentrovaný */}
          <motion.h1 
            variants={fadeUp}
            className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] text-[var(--color-dt-text)]"
          >
            {content.headingNormal}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-dt-accent)] via-[var(--color-dt-text)] to-[var(--color-dt-accent)]">
              {content.headingAccent}
            </span>
          </motion.h1>

          {/* POPIS: Vycentrovaný pod nadpisem */}
          <motion.p 
            variants={fadeUp}
            className="text-[var(--color-dt-text)] opacity-70 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto"
          >
            {content.description}
          </motion.p>

          {/* CHAT/SEARCH OBLAST: Centrální interaktivní prvek */}
          <div className="relative w-full max-w-[800px] h-[75px] flex justify-center mt-8">
            {/* Masivní organická fialová záře na pozadí */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[700px] bg-[color:var(--color-dt-accent)]-glow rounded-[150px] blur-[180px] pointer-events-none opacity-20 transition-opacity duration-1000" />
            
            <AnimatePresence mode="wait">
              {!isBotExpanded ? (
                // --- STAV 1: CENTROVANÁ HLEDACÍ LIŠTA ---
                <motion.div 
                  key="search-bar"
                  layoutId="chat-modal"
                  transition={cinematicTransition}
                  className={`absolute inset-0 w-full ${glassStyle} rounded-full p-2 z-30 flex items-center justify-center cursor-text shadow-2xl`}
                  onClick={() => inputRef.current?.focus()}
                >
                  <Search className="w-5 h-5 absolute left-8 opacity-40 text-[var(--color-dt-text)]" />
                  <input 
                    ref={inputRef} 
                    type="text" 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)} 
                    onKeyDown={handleKeyDown}
                    placeholder={content.placeholder}
                    className="w-full h-full bg-transparent px-16 text-[16px] font-medium text-center focus:outline-none text-[var(--color-dt-text)] placeholder:text-[var(--color-dt-text)]/40"
                  />
                  <button 
                      onClick={(e) => { e.stopPropagation(); if(inputValue.trim() !== "") setIsBotExpanded(true); }}
                      className="absolute right-2.5 w-14 h-14 flex items-center justify-center rounded-full transition-all hover:scale-105"
                      style={{ backgroundColor: 'var(--color-dt-accent)', color: 'var(--color-dt-bg)' }}
                  >
                    <SendHorizonal className="w-6 h-6" />
                  </button>
                </motion.div>
              ) : (
                // --- STAV 2: CENTROVANÝ CHAT MODAL ---
                <motion.div 
                  key="chat-modal"
                  layoutId="chat-modal"
                  transition={cinematicTransition}
                  className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[700px] h-[600px] bg-[var(--color-dt-surface)] border border-[var(--color-dt-text)]/10 rounded-[2.5rem] p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)] z-50 flex flex-col items-center`}
                >
                  {/* MODAL HEADER */}
                  <div className="flex justify-between items-center border-b border-[var(--color-dt-text)]/5 pb-6 mb-6 text-[var(--color-dt-text)] w-full">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-dt-accent)' }}>
                          <BrainCircuit className="w-7 h-7" style={{ color: 'var(--color-dt-bg)' }} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold tracking-tight">{content.botName}</h3>
                            <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest">Online & Ready</p>
                        </div>
                    </div>
                    <button onClick={() => setIsBotExpanded(false)} className="p-2 hover:bg-[var(--color-dt-text)]/5 rounded-full transition-colors text-[var(--color-dt-text)]/50 hover:text-[var(--color-dt-text)]">
                      <X />
                    </button>
                  </div>

                  {/* MODAL CONTENT */}
                  <div className="flex-grow overflow-y-auto pr-2 scrollbar-hide text-center w-full flex flex-col items-center justify-center">
                      <div className="border rounded-[2rem] max-w-[85%] flex gap-4 p-6 bg-[var(--color-dt-accent)]/10 border-[var(--color-dt-accent)]/20 text-[var(--color-dt-text)]">
                         <MessageSquare className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: 'var(--color-dt-accent)' }} />
                         <p className="text-base leading-relaxed text-left">
                          Zpracovávám: <strong style={{ color: 'var(--color-dt-accent)' }}>{inputValue}</strong> <br/><br/>
                          {content.botResponse}
                         </p>
                      </div>
                  </div>

                  {/* MODAL INPUT */}
                  <div className="relative h-16 mt-6 w-full">
                    <input autoFocus type="text" placeholder="Pokračujte v konverzaci..." className="w-full h-full bg-[var(--color-dt-surface)]/50 border border-[var(--color-dt-text)]/10 rounded-full px-8 pr-16 text-sm text-center focus:outline-none transition-colors text-[var(--color-dt-text)] focus:border-[var(--color-dt-accent)]/50" />
                    <button className="absolute right-2 top-2 bottom-2 w-12 flex items-center justify-center rounded-full" style={{ backgroundColor: 'var(--color-dt-accent)', color: 'var(--color-dt-bg)' }}>
                      <SendHorizonal className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* SEKUNDÁRNÍ TLAČÍTKO: Centrálně pod hledáním */}
          {!isBotExpanded && (
            <motion.button 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.6 }}
                className="mt-8 group flex items-center gap-3 transition-all font-bold text-xs uppercase tracking-[0.2em] text-[var(--color-dt-text)]/60 hover:text-[var(--color-dt-accent)]"
            >
              <PlusCircle className="w-5 h-5" /> {content.poptavkaBtn}
            </motion.button>
          )}
        </motion.div>
      </div>
    </section>
  );
}