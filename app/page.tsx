'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ArrowRight, Code2, Terminal, Zap, Database, Cpu, Globe, Play, FileCode2, Network, MousePointerClick, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Pomocná komponenta pro typing efekt
const TypewriterText = ({ text, delay = 10, startAnimation }: { text: string, delay?: number, startAnimation: boolean }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!startAnimation) return; 
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text, startAnimation]);

  return <>{currentText}</>;
};

export default function MarketingPage() {
  const [theme, setTheme] = useState<'minimal' | 'neon-fire'>('minimal');
  const [isGlitching, setIsGlitching] = useState(false);
  const [isDeveloped, setIsDeveloped] = useState(false);
  
  // Stavy pro Waitlist
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const codeSectionRef = useRef(null);
  const isCodeInView = useInView(codeSectionRef, { once: true, amount: 0.5 });

  const handleTransform = () => {
    if (isGlitching) return;
    setIsGlitching(true);
    setTimeout(() => {
      setTheme(prev => prev === 'minimal' ? 'neon-fire' : 'minimal');
    }, 150); 
    setTimeout(() => {
      setIsGlitching(false);
    }, 600);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    
    // Uložení do Supabase tabulky 'waitlist'
    const { error } = await supabase.from('waitlist').insert([{ email }]);
    
    if (error) {
      setStatus('error');
      console.error(error);
    } else {
      setStatus('success');
      setEmail('');
    }
  };

  const codeText = `// Server Component - Fetch data & render\nimport { createClient } from '@/utils/supabase/server';\nimport { LuxuryHero } from '@/components/ui';\n\nexport default async function Page() {\n  const supabase = createClient();\n\n  // Načtení identity pro tento konkrétní web\n  const { data: theme } = await supabase\n    .from('brand_themes')\n    .select('*')\n    .eq('id', 'premium_01')\n    .single();\n\n  return (\n    <LuxuryHero\n      title="Elegance v každém detailu."\n      subtitle="Headless svoboda."\n      bgImage={theme.hero_bg}\n    />\n  );\n}`;

  const pageStyles = {
    minimal: {
      wrapper: 'bg-[#F4F4F5] text-zinc-900 font-sans',
      accent: '#8E44ED',
      navText: 'text-zinc-950',
      badge: 'bg-purple-100 text-purple-700 border border-purple-200',
      card: 'bg-white border-zinc-200 shadow-xl',
      cardBadge: 'bg-zinc-100 text-zinc-500 font-mono',
      radius: 'rounded-2xl',
      secondaryBtn: 'border-purple-200 text-purple-700 hover:bg-purple-50',
      transition: 'duration-1000'
    },
    'neon-fire': {
      wrapper: 'bg-[#050507] text-zinc-100 font-mono',
      accent: '#ccff00', 
      navText: 'text-white',
      badge: 'bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30',
      card: 'bg-zinc-900/50 backdrop-blur-xl border-[#ccff00]/20 shadow-[0_0_50px_rgba(204,255,0,0.05)]',
      cardBadge: 'bg-[#ccff00]/10 text-[#ccff00]',
      radius: 'rounded-none',
      secondaryBtn: 'border-[#ccff00]/30 text-[#ccff00] hover:bg-[#ccff00]/10',
      transition: 'duration-500'
    }
  };

  const s = pageStyles[theme];

  return (
    <>
      <style jsx global>{`
        @keyframes glitch-anim {
          0% { transform: translate(0); }
          20% { transform: translate(-5px, 5px); }
          40% { transform: translate(5px, -5px); }
          60% { transform: translate(-10px, 0px); }
          80% { transform: translate(10px, 0px); }
          100% { transform: translate(0); }
        }
        @keyframes shake {
          0% { transform: translate(1px, 1px); }
          20% { transform: translate(-3px, 0px); }
          40% { transform: translate(1px, -1px); }
          60% { transform: translate(-3px, 1px); }
          80% { transform: translate(-1px, -1px); }
          100% { transform: translate(1px, -2px); }
        }
        .animate-glitch { animation: glitch-anim 0.3s infinite; }
        .animate-shake { animation: shake 0.4s infinite; }
        
        .dash-flow {
          stroke: #8E44ED;
          stroke-width: 2;
          stroke-dasharray: 4 12;
          fill: none;
          animation: flow 1.5s linear infinite;
        }
        @keyframes flow {
          to { stroke-dashoffset: -16; }
        }

        .typing-cursor::after {
          content: '|';
          animation: blink 0.8s infinite;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>

      <div className={`min-h-screen transition-all ${s.transition} relative ${s.wrapper} ${isGlitching ? 'animate-shake' : ''}`}>
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#88888808_1px,transparent_1px),linear-gradient(to_bottom,#88888808_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        {/* NAVBAR */}
        <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-b transition-all duration-500 ${
          theme === 'minimal' ? 'bg-white/40 border-black/5' : 'bg-[#050507]/40 border-white/5'
        }`}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            
            <div className="flex items-center gap-4 group z-50">
              <div className="relative w-12 h-12 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                <img 
                  src={theme === 'minimal' 
                    ? "https://okmxoxaxsotxkiyljcuy.supabase.co/storage/v1/object/public/galleries/Chameleon/logo-chameleon-purple-transparent.png" 
                    : "https://okmxoxaxsotxkiyljcuy.supabase.co/storage/v1/object/public/galleries/Chameleon/logo-chameleon-green-transparent.png"
                  } 
                  alt="Chameleon Engine Symbol" 
                  className={`w-full h-full object-contain transition-all duration-500 ${
                    theme === 'minimal' ? 'drop-shadow-[0_0_15px_rgba(142,68,237,0.3)]' : 'drop-shadow-[0_0_20px_rgba(204,255,0,0.4)]'
                  }`}
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className={`font-black text-2xl tracking-[0.1em] leading-none transition-colors duration-500 ${
                    theme === 'minimal' ? 'text-zinc-800' : 'text-[#ccff00]'
                  }`}>
                  CHMLN<span className={theme === 'minimal' ? 'text-[#8E44ED]' : 'text-zinc-600'}>.</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 z-50">
              
              {/* TLAČÍTKO LOGIN ZATÍM SKRYTO:
              <Link href="/login" className={`font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 group flex items-center gap-1
                  ${theme === 'minimal' ? 'text-zinc-500 hover:text-zinc-900' : 'text-zinc-400 hover:text-[#ccff00]'}`}>
                <span className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">[</span>
                Login
                <span className="opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">]</span>
              </Link>
              */}

            </div>
          </div>
        </nav>

        {/* HERO SECTION */}
        <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center min-h-[85vh]">
          <div className={`lg:col-span-6 ${isGlitching ? 'animate-glitch' : ''}`}>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${s.radius} text-xs font-bold uppercase tracking-widest mb-6 border transition-all ${s.badge}`}>
              <Code2 size={14} /> {theme === 'minimal' ? '// EARLY ACCESS' : '/* PRIVATE_BETA */'}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8 transition-all">
              {theme === 'minimal' ? 'Tvorba webů,' : 'Revoluce'}<br />
              <span style={{ color: s.accent }}>{theme === 'minimal' ? 'znovu a lépe.' : 'se blíží.'}</span>
            </h1>
            
            <p className="text-lg opacity-70 font-medium mb-10 max-w-lg leading-relaxed">
              Konec pluginového pekla. Headless engine na Next.js s integrovaným CRM, fakturací a vizuálním builderem. 
              Zanech e-mail a získej přednostní přístup do uzavřené bety.
            </p>
            
            {/* WAITLIST FORMULÁŘ */}
            <div className="min-h-[80px]">
              {status === 'success' ? (
                <div className={`p-6 border ${s.radius} flex items-center gap-3 ${theme === 'minimal' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-green-500/10 border-green-500/30 text-green-400'}`}>
                  <CheckCircle2 size={24} />
                  <div>
                    <h3 className="font-bold text-lg leading-none mb-1">Jsi na seznamu!</h3>
                    <p className="text-xs opacity-80">Dáme ti vědět hned, jakmile otevřeme brány.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-4 max-w-lg">
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tvůj nejlepší e-mail..."
                    className={`flex-grow px-6 py-4 border ${s.radius} font-medium outline-none transition-all ${
                      theme === 'minimal' 
                        ? 'bg-white border-zinc-200 text-zinc-900 focus:border-purple-500' 
                        : 'bg-zinc-900/50 border-zinc-700 text-white focus:border-[#ccff00]'
                    }`}
                  />
                  <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className={`px-8 py-4 ${s.radius} font-bold text-sm flex items-center justify-center gap-3 transition-all hover:scale-105 disabled:opacity-50 shrink-0 ${theme === 'minimal' ? 'text-white' : 'text-black'}`} 
                    style={{ backgroundColor: s.accent, boxShadow: `0 15px 30px -10px ${s.accent}60` }}
                  >
                    {status === 'loading' ? 'Zapisuji...' : 'Chci přístup'} <ArrowRight size={18} />
                  </button>
                </form>
              )}
              {status === 'error' && <p className="text-red-500 text-xs mt-3 font-bold px-2">Něco se pokazilo. Možná už na seznamu jsi?</p>}
            </div>
            
            <button onClick={() => scrollToSection('engine-bay')} className={`mt-10 font-bold text-xs uppercase tracking-widest transition-all ${theme === 'minimal' ? 'text-zinc-500 hover:text-zinc-900' : 'text-zinc-500 hover:text-white'}`}>
              ↓ Zjistit více o systému
            </button>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            <motion.div layout className={`relative z-10 w-full max-w-[500px] border p-10 transition-all ${s.card} ${s.radius} ${isGlitching ? 'animate-glitch' : ''}`}>
              <div className="flex justify-between items-center mb-10">
                <div className={`px-3 py-1 text-[11px] uppercase font-mono rounded ${s.cardBadge}`}>
                  {theme === 'minimal' ? 'minimal.css' : 'neon_fire.css'}
                </div>
              </div>
              <h3 className="text-3xl font-black mb-4">Chameleon Effect</h3>
              <p className="opacity-60 mb-10 text-sm leading-relaxed">
                Takhle vypadá totální transformace vizuální identity. Klikni na tlačítko a sleduj, jak se realita rozpadne a složí do novýho stylu.
              </p>
              <button onClick={handleTransform} className={`w-full py-4 font-black uppercase tracking-widest text-xs transition-all ${s.radius} ${theme === 'minimal' ? 'text-white' : 'text-black'}`} style={{ backgroundColor: s.accent }}>
  {isGlitching 
    ? 'Transforming...' 
    : (theme === 'minimal' ? 'Inicializovat Chaos' : 'Návrat do zenu')}
</button>
            </motion.div>
          </div>
        </main>

        {/* SEKCE: ENGINE BAY */}
        <section id="engine-bay" className={`py-24 px-6 max-w-7xl mx-auto border-t border-zinc-500/10`}>
          <div className="mb-16">
            <div className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4 ${s.cardBadge}`}>
              <Cpu size={12} /> The Engine Bay
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
              Co bije pod <span style={{ color: s.accent }}>kapotou?</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className={`p-8 border ${s.card} ${s.radius} transition-all hover:scale-[1.02]`}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6" style={{ backgroundColor: `${s.accent}20` }}>
                <Zap size={24} style={{ color: s.accent }} />
              </div>
              <h4 className="text-xl font-black mb-3">Next.js & Supabase</h4>
              <p className="text-sm opacity-60 leading-relaxed">
                Moderní stack, který létá. Žádné zbytečné re-rendery. Databáze a autentizace vyřešena za vteřinu s maximální bezpečností.
              </p>
            </div>
            <div className={`p-8 border ${s.card} ${s.radius} transition-all hover:scale-[1.02]`}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6" style={{ backgroundColor: `${s.accent}20` }}>
                <MousePointerClick size={24} style={{ color: s.accent }} />
              </div>
              <h4 className="text-xl font-black mb-3">Vizuální Builder</h4>
              <p className="text-sm opacity-60 leading-relaxed">
                Poskládej web pro klienta jako z lega. Přepiš texty, změň barvy a kliknutím vypusť čerstvý kód přímo do produkce.
              </p>
            </div>
            <div className={`p-8 border ${s.card} ${s.radius} transition-all hover:scale-[1.02]`}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6" style={{ backgroundColor: `${s.accent}20` }}>
                <Database size={24} style={{ color: s.accent }} />
              </div>
              <h4 className="text-xl font-black mb-3">Vestavěné CRM</h4>
              <p className="text-sm opacity-60 leading-relaxed">
                Od poptávky, přes fakturu až po předávací protokol. Vše na jednom místě. Systém, který tě nezdržuje od práce.
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-16 text-center opacity-30 hover:opacity-100 transition-opacity">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em]">
            // Chameleon OS // V1.0 //
          </p>
        </footer>
      </div>
    </>
  );
}