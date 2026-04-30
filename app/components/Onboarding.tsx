'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Palette, Briefcase, Hammer, UserCheck } from 'lucide-react';

// Definice person
const personas = [
  {
    id: 'kreativec',
    title: 'Kreativec',
    desc: 'Fotograf, grafik nebo markeťák. Zaměřeno na projekty a obsah.',
    icon: Palette,
    modules: ['web', 'photo', 'content', 'billing'],
    color: 'bg-purple-500/10 border-purple-500/30 text-purple-400'
  },
  {
    id: 'manazer',
    title: 'Manažer / Freelancer',
    desc: 'Řízení projektů, úkolů a hlídání cashflow.',
    icon: Briefcase,
    modules: ['web', 'billing', 'expenses'],
    color: 'bg-blue-500/10 border-blue-500/30 text-blue-400'
  },
  {
    id: 'remeslnik',
    title: 'Řemeslník',
    desc: 'Správa zakázek, výdajů a rychlá fakturace z terénu.',
    icon: Hammer,
    modules: ['photo', 'billing', 'expenses', 'bookings'],
    color: 'bg-amber-500/10 border-amber-500/30 text-amber-400'
  },
  {
    id: 'sluzby',
    title: 'Služby a Konzultace',
    desc: 'Rezervace termínů, správa klientů a plánování.',
    icon: UserCheck,
    modules: ['bookings', 'photo', 'billing', 'content'],
    color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
  }
];

export default function Onboarding({ userId, onComplete }: { userId: string, onComplete: () => void }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelect = async (persona: typeof personas[0]) => {
    setLoading(persona.id);
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        user_type: persona.id,
        active_modules: persona.modules 
      })
      .eq('id', userId);

    if (!error) {
      onComplete();
    }
    setLoading(null);
  };

  // Nová funkce pro přeskočení
  const handleSkip = async () => {
    setLoading('skip');
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        user_type: 'all', // Uložíme jako 'all', aby se okno už neukazovalo
        active_modules: ['web', 'photo', 'billing', 'bookings', 'content'] // Zapneme všechny hlavní moduly
      })
      .eq('id', userId);

    if (!error) {
      onComplete();
    }
    setLoading(null);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-4xl w-full py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-4 tracking-tight uppercase">
            Vítejte v PROJECT<span className="text-amber-500 italic lowercase font-serif">os</span>
          </h1>
          <p className="text-slate-400 text-lg">Jak plánujete aplikaci používat? Nastavíme vám prostředí na míru.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {personas.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelect(p)}
              disabled={loading !== null}
              className={`group relative text-left p-6 rounded-3xl border-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${p.color} ${loading === p.id ? 'ring-2 ring-white' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-2xl bg-slate-900/50 mb-4 group-hover:bg-slate-900 transition-colors">
                  <p.icon className="w-8 h-8" />
                </div>
                {loading === p.id && (
                  <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                )}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{p.desc}</p>
              
              <div className="mt-6 flex flex-wrap gap-2">
                {p.modules.map(m => (
                  <span key={m} className="text-[10px] uppercase tracking-widest font-black px-2 py-1 bg-white/5 rounded-md opacity-60">
                    {m}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
        
        {/* Přidaná sekce pro přeskočení a spodní text */}
        <div className="flex flex-col items-center mt-12 gap-6">
          <button
            onClick={handleSkip}
            disabled={loading !== null}
            className={`text-sm font-bold transition-colors flex items-center gap-2 hover:text-white underline underline-offset-4 decoration-slate-700 hover:decoration-slate-400 ${loading === 'skip' ? 'text-white' : 'text-slate-400'}`}
          >
            {loading === 'skip' && (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            )}
            Přeskočit a nechat zapnuté vše
          </button>

          <p className="text-slate-600 text-xs uppercase tracking-widest font-bold">
            Nastavení můžete kdykoliv změnit v profilu
          </p>
        </div>

      </div>
    </div>
  );
}