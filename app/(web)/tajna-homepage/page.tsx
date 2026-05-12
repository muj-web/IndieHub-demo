'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ArrowRight, Code2, Terminal, Zap, Database, Cpu, Globe, Play, FileCode2, Network, MousePointerClick, Type, Layout, ImageIcon, 
  SlidersHorizontal,Settings, Palette, ExternalLink, Rocket, ArrowLeft, Trash2, Save, ChevronDown, Eye, Box, ShieldAlert, Users, Layers, Braces, Server } from 'lucide-react';
import Link from 'next/link';

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
  
  // Reference pro spuštění animace psaní kódu až po doscrollování
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
        
        .wire {
          stroke: #3f3f46;
          stroke-width: 2;
          fill: none;
        }
        .data-flow {
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
            
            <Link href="/" className="flex items-center gap-4 group z-50">
              <div className="relative w-24 h-24 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
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
                <span className={`font-black text-3xl tracking-[0.1em] leading-none transition-colors duration-500 ${
                    theme === 'minimal' ? 'text-zinc-800' : 'text-[#ccff00]'
                  }`}>
                  CHMLN<span className={theme === 'minimal' ? 'text-[#8E44ED]' : 'text-zinc-600'}>.</span>
                </span>
                <span className={`font-mono text-[9px] tracking-[0.25em] uppercase mt-1 transition-colors duration-500 ${
                    theme === 'minimal' ? 'text-zinc-500' : 'text-[#ccff00]/60'
                  }`}>
                  // Engine_V1
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-6 z-50">
              <Link href="/login" className={`font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 group flex items-center gap-1
                  ${theme === 'minimal' ? 'text-zinc-500 hover:text-zinc-900' : 'text-zinc-400 hover:text-[#ccff00]'}`}>
                <span className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">[</span>
                Login
                <span className="opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">]</span>
              </Link>
              <Link href="/register">
                <button className={`px-6 py-3 font-black text-[11px] tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-2 border-2 
                  ${theme === 'minimal' 
                    ? 'bg-zinc-900 text-white border-zinc-900 hover:bg-transparent hover:text-zinc-900 rounded-xl' 
                    : 'bg-[#ccff00] text-black border-[#ccff00] hover:bg-transparent hover:text-[#ccff00] rounded-none shadow-[0_0_20px_rgba(204,255,0,0.2)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)]'
                  }`}>
                  <Terminal size={14} /> Start Engine
                </button>
              </Link>
            </div>
          </div>
        </nav>

        {/* HERO SECTION */}
        <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center min-h-[85vh]">
          <div className={`lg:col-span-6 ${isGlitching ? 'animate-glitch' : ''}`}>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${s.radius} text-xs font-bold uppercase tracking-widest mb-6 border transition-all ${s.badge}`}>
              <Code2 size={14} /> {theme === 'minimal' ? '// Zahoď WordPress' : '/* SYSTEM_OVERRIDE */'}
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 transition-all">
              {theme === 'minimal' ? 'Změň skin,' : 'Pravidla'}<br />
              <span style={{ color: s.accent }}>{theme === 'minimal' ? 'ne kód.' : 'neplatí.'}</span>
            </h1>
            
            <p className="text-lg md:text-xl opacity-70 font-medium mb-10 max-w-lg leading-relaxed">
              Moderní headless engine na Next.js pro lidi, co chtějí tvořit styl a neřešit pluginový peklo. Web, co netahá nohy. Tečka.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="http://app.localhost:3000/" className={`px-8 py-4 ${s.radius} font-bold text-sm flex items-center gap-3 transition-all hover:scale-105 ${theme === 'minimal' ? 'text-white' : 'text-black'}`} style={{ backgroundColor: s.accent, boxShadow: `0 15px 30px -10px ${s.accent}60` }}>
                Vyzkoušet Demo <ArrowRight size={18} />
              </Link>
              <button onClick={() => scrollToSection('how-it-works')} className={`px-8 py-4 border-2 ${s.radius} font-bold text-sm transition-all ${s.secondaryBtn}`}>
                Jak to maká?
              </button>
            </div>
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
                {isGlitching ? 'Transforming...' : 'Inicializovat Chaos'}
              </button>
            </motion.div>
          </div>
        </main>

        {/* SEKCE: JAK TO MAKÁ (Typing Edition) */}
        <section id="how-it-works" ref={codeSectionRef} className="py-24 px-6 max-w-7xl mx-auto border-t border-zinc-500/10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
             <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
                Komplexní jádro. <br/> <span style={{ color: s.accent }}>Luxusní frontend.</span>
             </h2>
             <p className="opacity-60 text-lg">
               Sleduj to inženýrství pod kapotou. Tohle Next.js jádro ti dává bleskovou rychlost a absolutní tvůrčí svobodu na frontendu.
             </p>
          </div>

          <div className={`relative w-full aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden border ${s.cardBadge} border-zinc-700/30 flex flex-col items-center justify-center bg-[#0c0c0d] p-4 md:p-8 shadow-2xl`}>
            
            <AnimatePresence mode="wait">
              {!isDeveloped ? (
                // POHLED 1: MOTOR
                <motion.div 
                  key="engine"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-full relative grid grid-cols-12 p-6"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.55)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <path d="M 50% 30% L 60% 40% L 75% 30%" stroke={s.accent} strokeWidth="2" fill="none" className="dash-flow" />
                    <path d="M 50% 70% L 60% 60% L 75% 70%" stroke={s.accent} strokeWidth="2" fill="none" className="dash-flow" />
                  </svg>

                  {/* Karta 1: Kód - NYNÍ S TYPING EFEKTEM */}
                  <div className="col-span-7 relative z-10 flex flex-col h-full pl-4">
                    <div className="flex items-center gap-3 mb-4 opacity-50">
                      <div className="w-3 h-3 rounded-full bg-zinc-600" />
                      <div className="w-3 h-3 rounded-full bg-zinc-600" />
                      <div className="w-3 h-3 rounded-full bg-zinc-600" />
                      <span className="font-mono text-[10px] ml-2 text-zinc-400 flex items-center gap-2"><FileCode2 size={12}/> page.tsx</span>
                    </div>
                    
                    <div className="flex-1 bg-[#121214] border border-zinc-800 rounded-xl p-6 shadow-2xl overflow-hidden font-mono text-[12px] md:text-[14px] leading-relaxed relative">
                      <div className="typing-cursor text-green-400/80">
                        <pre className="overflow-hidden whitespace-pre-wrap">
                          <TypewriterText text={codeText} startAnimation={isCodeInView} />
                        </pre>
                      </div>
                      <div className="absolute -bottom-2 -right-2 font-black text-[30px] text-white/5 uppercase tracking-tighter transform rotate-[-5deg]">x-ray</div>
                    </div>
                  </div>

                  {/* Karta 2: DB Schéma */}
                  <div className="col-span-5 relative z-10 flex flex-col justify-center gap-12 pl-12 pr-4">
                    <div className="bg-[#121214] border border-zinc-800 rounded-lg p-4 shadow-xl">
                      <div className="flex items-center gap-2 mb-3 border-b border-zinc-800 pb-2">
                        <Database size={12} className="text-zinc-400"/>
                        <span className="font-mono text-[11px] text-zinc-300 uppercase tracking-widest">public.brand_themes</span>
                      </div>
                      <div className="font-mono text-[10px] space-y-2">
                        <div className="flex justify-between text-zinc-500"><span>id (uuid)</span> <span className="text-blue-400">PK</span></div>
                        <div className="flex justify-between text-zinc-300"><span>name</span> <span>"Premium Dark"</span></div>
                        <div className="flex justify-between text-zinc-300"><span>font_family</span> <span>"Playfair Display"</span></div>
                        <div className="flex justify-between text-zinc-300 bg-purple-500/10 p-1 rounded"><span>hero_bg</span> <span className="text-green-400">"bg-marble.jpg"</span></div>
                      </div>
                    </div>

                    <div className="bg-[#121214] border border-zinc-800 rounded-lg p-4 shadow-xl">
                      <div className="flex items-center gap-2 mb-3 border-b border-zinc-800 pb-2">
                        <Network size={12} className="text-zinc-400"/>
                        <span className="font-mono text-[11px] text-zinc-300 uppercase tracking-widest">Edge CDN Delivery</span>
                      </div>
                      <div className="font-mono text-[10px] space-y-1 text-zinc-500">
                        <div>Region: <span className="text-emerald-400">fra1 (Frankfurt)</span></div>
                        <div>Cache: <span className="text-emerald-400">HIT</span></div>
                        <div>Latency: <span className="text-emerald-400">12ms</span></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                // POHLED 2: VÝSLEDEK
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full relative bg-[#F9F9F8] text-[#1a1a1a] flex flex-col"
                >
                  <div className="w-full px-10 py-8 flex justify-between items-center z-10">
                    <div className="font-serif text-xl tracking-widest font-bold">AURA.</div>
                    <div className="flex gap-8 text-[11px] tracking-[0.2em] uppercase font-medium">
                      <span>Kolekce</span>
                      <span>Příběh</span>
                      <span>Kontakt</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10 -mt-10">
                    <h2 className="font-serif text-5xl md:text-7xl mb-6 tracking-tight text-[#0a0a0a]">
                      Elegance v každém detailu.
                    </h2>
                    <p className="uppercase tracking-[0.3em] text-[11px] text-zinc-500 font-medium mb-10">
                      Headless svoboda.
                    </p>
                    <button className="px-10 py-4 bg-[#1a1a1a] text-white text-[10px] uppercase tracking-widest hover:bg-black transition-colors">
                      Objevit
                    </button>
                  </div>
                  
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" 
                       style={{ backgroundImage: 'radial-gradient(circle at center, #000 0%, transparent 100%)' }} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
              <button 
                onClick={() => setIsDeveloped(!isDeveloped)}
                className={`px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[11px] flex items-center gap-3 transition-all hover:scale-105 shadow-2xl backdrop-blur-md border
                  ${isDeveloped 
                    ? 'bg-black/80 text-white border-white/10 hover:bg-black' 
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
              >
                {isDeveloped ? <><Code2 size={16} /> Zpátky do Matrixu</> : <><Play size={16} fill="currentColor" /> Develop Frontend</>}
              </button>
            </div>
          </div>
        </section>

        {/* SEKCE: ENGINE BAY */}
        <section id="engine-bay" className={`py-24 px-6 max-w-7xl mx-auto`}>
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
              <h4 className="text-xl font-black mb-3">Next.js 15</h4>
              <p className="text-sm opacity-60 leading-relaxed">
                Létá to. Žádný zbytečný re-rendery. Server Components dělají z tvýho webu bleskovou mašinu, co miluje Google.
              </p>
            </div>
            <div className={`p-8 border ${s.card} ${s.radius} transition-all hover:scale-[1.02]`}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6" style={{ backgroundColor: `${s.accent}20` }}>
                <Database size={24} style={{ color: s.accent }} />
              </div>
              <h4 className="text-xl font-black mb-3">Supabase</h4>
              <p className="text-sm opacity-60 leading-relaxed">
                Backend, co tě podrží. Auth, DB a Realtime věci vyřešený za vteřinu. Bezpečnost na úrovni banky, kód na úrovni génia.
              </p>
            </div>
            <div className={`p-8 border ${s.card} ${s.radius} transition-all hover:scale-[1.02]`}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6" style={{ backgroundColor: `${s.accent}20` }}>
                <Globe size={24} style={{ color: s.accent }} />
              </div>
              <h4 className="text-xl font-black mb-3">Headless Freedom</h4>
              <p className="text-sm opacity-60 leading-relaxed">
                Už nikdy se nespokoj s průměrem. Chameleon ti dává totální kontrolu nad tím, jak tvůj brand vypadá navenek.
              </p>
            </div>
          </div>
        </section>
       
        {/* SEKCE: BUĎ HRDÝ KLIKAČ (Věrný Admin Mockup) */}
        <section id="builder-preview" className="py-24 px-6 max-w-7xl mx-auto border-t border-zinc-500/10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <div className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4 ${s.badge}`}>
                <MousePointerClick size={12} /> // PROUD_CLICKER
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
                Prostě si to <span style={{ color: s.accent }}>naklikej.</span>
              </h2>
              <p className="opacity-70 text-lg leading-relaxed">
                Náš builder tě nechá poskládat vizuál myší, zatímco na pozadí generuje čistý, optimalizovaný React. 
                Ušetři čas tam, kde na tom nezáleží, a věnuj ho logice.
              </p>
            </div>
          </div>

          <div className={`w-full shadow-[0_30px_100px_-20px_rgba(0,0,0,0.2)] overflow-hidden transition-all duration-500 p-4 md:p-8 ${theme === 'minimal' ? 'bg-[#F0F0F2]' : 'bg-black'} ${s.radius}`}>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-sm ${theme === 'minimal' ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-900 border-zinc-800 text-white'}`}>
                  <ArrowLeft size={18} />
                </div>
                <h3 className={`text-2xl font-black tracking-tighter flex items-center gap-2 ${theme === 'minimal' ? 'text-zinc-900' : 'text-white'}`}>
                  MŮJ PROJEKT <span className="opacity-20 font-light">/ BUILDER</span>
                </h3>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 border shadow-sm ${theme === 'minimal' ? 'bg-white border-zinc-200 text-zinc-600' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>
                  LIVE NÁHLED <ExternalLink size={14} />
                </div>
                <button className={`px-6 py-2.5 rounded-full font-black text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105 ${theme === 'minimal' ? 'text-white' : 'text-black'}`} style={{ backgroundColor: s.accent }}>
                  PUBLIKOVAT <Rocket size={14} fill="currentColor" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              <div className={`md:col-span-4 p-8 border shadow-sm transition-all duration-500 ${s.card} ${s.radius}`}>
                <div className="flex items-center gap-2 mb-8">
                  <Palette size={20} style={{ color: s.accent }} />
                  <span className="font-black tracking-tighter text-lg uppercase">Design System</span>
                </div>

                <div className={`w-full py-3 rounded-xl mb-10 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 text-white shadow-md`} style={{ backgroundColor: s.accent }}>
                   <Eye size={14} /> Mód: Vizuální Design
                </div>

                <div className="mb-10">
                   <span className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em] mb-4 block">Barevná paleta</span>
                   <div className="grid grid-cols-2 gap-4">
                      {['Pozadí', 'Text', 'Akcent', 'Karty'].map((label, idx) => (
                        <div key={label} className="space-y-2">
                          <span className="text-[10px] font-bold opacity-50 block uppercase">{label}</span>
                          <div className={`p-2 border rounded-xl flex items-center gap-2 ${theme === 'minimal' ? 'bg-zinc-50 border-zinc-100' : 'bg-zinc-900 border-zinc-800'}`}>
                            <div className="w-8 h-8 rounded-lg shadow-inner" style={{ backgroundColor: idx === 2 ? s.accent : (idx === 3 ? (theme === 'minimal' ? '#141414' : '#ffffff') : '#F1F2F2') }} />
                            <span className="font-mono text-[9px] opacity-40 uppercase">#hexVal</span>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div>
                   <span className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em] mb-4 block">Typografie & Styl</span>
                   <div className="space-y-4">
                      <div className={`p-4 border rounded-xl flex justify-between items-center ${theme === 'minimal' ? 'bg-zinc-50 border-zinc-100' : 'bg-zinc-900 border-zinc-800'}`}>
                         <span className="text-xs font-bold"><Type size={14} className="inline mr-2" /> Nadpisy</span>
                         <span className="text-[10px] opacity-40">Lexend (Geometric)</span>
                      </div>
                      <div className={`p-4 border rounded-xl flex justify-between items-center ${theme === 'minimal' ? 'bg-zinc-50 border-zinc-100' : 'bg-zinc-900 border-zinc-800'}`}>
                         <span className="text-xs font-bold"><Box size={14} className="inline mr-2" /> Zaoblení</span>
                         <span className="text-[10px] opacity-40">Ostré (0px)</span>
                      </div>
                   </div>
                </div>
              </div>

              <div className={`md:col-span-8 p-8 border shadow-sm transition-all duration-500 ${s.card} ${s.radius}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center" style={{ color: s.accent }}>
                      <Layout size={20} />
                    </div>
                    <div>
                      <h4 className="font-black tracking-tighter text-lg uppercase leading-none">Struktura webu</h4>
                      <span className="text-[10px] opacity-30 uppercase tracking-widest font-bold">Správa komponent</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className={`px-4 py-2 border rounded-xl text-[10px] font-bold ${theme === 'minimal' ? 'bg-zinc-50 border-zinc-200 text-zinc-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>
                      Reference (Video Grid)
                    </div>
                    <button className={`px-4 py-2 rounded-xl text-[10px] font-black text-white flex items-center gap-2 shadow-md transition-transform hover:scale-105`} style={{ backgroundColor: s.accent }}>
                      + PŘIDAT SEKCI
                    </button>
                  </div>
                </div>

                <div className={`border rounded-[2rem] p-6 ${theme === 'minimal' ? 'bg-zinc-50 border-zinc-100' : 'bg-zinc-900/50 border-zinc-800'}`}>
                   <div className={`bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-white/5 rounded-2xl p-6 flex items-center justify-between shadow-sm`}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center font-bold text-xs opacity-30">1</div>
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: s.accent }}>Hero</span>
                          <h5 className="font-black tracking-tight text-md">HERO (CINEMATIC IMPACT)</h5>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center opacity-30"><ChevronDown size={18}/></div>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: s.accent }}><Settings size={18}/></div>
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20"><Trash2 size={18}/></div>
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center border border-green-500/20"><Save size={18}/></div>
                      </div>
                   </div>
                   
                   <div className="flex gap-6 mt-6 px-4">
                      <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border-b-2 pb-2 transition-colors" style={{ borderColor: s.accent, color: s.accent }}>
                        <Palette size={12}/> Vzhled
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 opacity-20 pb-2 border-b-2 border-transparent">
                        <Type size={12}/> Obsah a texty
                      </div>
                   </div>

                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                      {['Zarovnání', 'Typ pozadí', 'Odsazení', 'Šířka obsahu'].map(field => (
                        <div key={field}>
                          <span className="text-[9px] font-bold opacity-30 uppercase block mb-2">{field}</span>
                          <div className={`p-3 border rounded-xl text-[10px] font-bold flex justify-between items-center ${theme === 'minimal' ? 'bg-white border-zinc-200' : 'bg-zinc-950 border-white/5'}`}>
                            Standard <ChevronDown size={12} opacity={0.3}/>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEKCE: MANIFEST (Makat vs. Kecat) */}
        <section className="py-32 px-6 max-w-5xl mx-auto text-center">
          <div className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] mb-12 ${s.cardBadge}`}>
             // ANTI-CORPORATE_PROTOCOL
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-12 leading-[0.85]">
            Míň schůzek. <br/>
            <span style={{ color: s.accent }}>Víc hotový práce.</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 text-left mt-20">
            <div className={`p-10 border ${s.card} ${s.radius} relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users size={80} />
              </div>
              <h4 className="text-xl font-black mb-4 uppercase tracking-tight">Pro nezávislé profíky</h4>
              <p className="opacity-60 text-sm leading-relaxed">
                Chameleon je nástroj pro vlky samotáře a úderné týmy. Pro ty, co si věří natolik, že nepotřebují schvalovací kolečko od pěti manažerů, aby pohnuli tlačítkem o dva pixely. 
              </p>
              <div className="mt-8 pt-6 border-t border-zinc-500/10 font-mono text-[10px] uppercase tracking-widest opacity-40">
                Status: Pro_Freelancery
              </div>
            </div>

            <div className={`p-10 border ${s.card} ${s.radius} relative overflow-hidden group border-red-500/20`}>
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <ShieldAlert size={80} />
              </div>
              <h4 className="text-xl font-black mb-4 uppercase tracking-tight text-red-500/80">Ne pro korporáty</h4>
              <p className="opacity-60 text-sm leading-relaxed">
                Pokud hledáte platformu, kde se o zaoblení rohů debatuje na třech Zoom callech týdně, jděte jinam. My tady makáme. Chameleon je pro lidi, co chtějí postavit web dřív, než manažer dopije kafe.
              </p>
              <div className="mt-8 pt-6 border-t border-zinc-500/10 font-mono text-[10px] uppercase tracking-widest text-red-500/40">
                Status: Blocked_Managers
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-16 text-center opacity-30 hover:opacity-100 transition-opacity">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em]">
            // Pokud hledáš PHP, jsi na špatný adrese.
          </p>
        </footer>
      </div>
    </>
  );
}