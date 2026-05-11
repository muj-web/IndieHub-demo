'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Target, Share2, Search, ArrowRight, Loader2, Lightbulb, Rocket, X } from 'lucide-react';

const QUESTIONS = [
  {
    id: 'has_socials',
    title: 'Sociální sítě',
    question: 'Plánuješ pro svůj byznys využívat sítě (Instagram, Facebook, atd.)?',
    education: 'Sítě jsou skvělé pro budování důvěry a komunity. Nejsou ale nutností, pokud máš silné SEO.',
    icon: Share2,
    options: [
      { label: 'Jasně, to je můj hlavní kanál', value: 'yes_active' },
      { label: 'Jen občas, spíš jako vizitku', value: 'yes_passive' },
      { label: 'Vůbec, nemám na to čas', value: 'no' }
    ]
  },
  {
    id: 'has_blog',
    title: 'Tvorba obsahu',
    question: 'Chceš na web psát články nebo ukazovat případové studie (ukázky práce)?',
    education: 'Jeden kvalitní článek měsíčně může zvednout organickou návštěvnost webu z Googlu klidně o 300 %.',
    icon: Search,
    options: [
      { label: 'Ano, chci tvořit obsah pravidelně', value: 'yes_regular' },
      { label: 'Sem tam přidám nějakou referenci', value: 'yes_occasional' },
      { label: 'Ne, chci jen statický web', value: 'no' }
    ]
  },
  {
    id: 'focus',
    title: 'Hlavní cíl',
    question: 'Odkud by k tobě mělo chodit nejvíce poptávek?',
    education: 'Tohle určí tvou hlavní prioritu. Nemusíš dělat všechno, stačí dělat jednu věc pořádně.',
    icon: Target,
    options: [
      { label: 'Z vyhledávačů (Google / Seznam)', value: 'seo' },
      { label: 'Ze sociálních sítí', value: 'social' },
      { label: 'Placená reklama (PPC)', value: 'ads' },
      { label: 'Osobní doporučení', value: 'word_of_mouth' }
    ]
  }
];

export default function StrategyOnboarding({ 
  userId, 
  onComplete,
  onCancel 
}: { 
  userId: string; 
  onComplete: () => void;
  onCancel: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleSelect = async (value: string) => {
    const currentQ = QUESTIONS[currentStep];
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Hotovo, ukládáme do DB
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update({ marketing_strategy: newAnswers })
        .eq('id', userId);

      if (!error) {
        onComplete();
      } else {
        alert('Chyba při ukládání strategie: ' + error.message);
        setSaving(false);
      }
    }
  };

  const q = QUESTIONS[currentStep];

  return (
    <div className="fixed inset-0 z-[150] bg-zinc-900/80 dark:bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-zinc-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
        
        {/* Progress bar */}
        <div className="w-full bg-zinc-100 dark:bg-slate-800 h-2">
          <div 
            className="bg-emerald-500 h-full transition-all duration-500" 
            style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>

        <div className="p-8 md:p-12">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                <q.icon size={24} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-slate-500">Krok {currentStep + 1} z {QUESTIONS.length}</span>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{q.title}</h2>
              </div>
            </div>
            
            {/* OPRAVA: Tlačítko pro zavření nyní volá onCancel místo onComplete */}
            <button 
              onClick={onCancel} 
              className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              title="Zavřít průvodce"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-white mb-6">
            {q.question}
          </h3>

          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-4 rounded-2xl mb-8 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200 leading-relaxed">
              {q.education}
            </p>
          </div>

          <div className="space-y-3">
            {q.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                disabled={saving}
                className="w-full p-5 text-left border border-zinc-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl flex items-center justify-between group transition-all hover:shadow-md bg-zinc-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50"
              >
                <span className="font-bold text-zinc-700 dark:text-slate-200 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{opt.label}</span>
                {saving ? (
                  <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5 text-zinc-300 dark:text-slate-600 group-hover:text-emerald-500 transition-all group-hover:translate-x-1" />
                )}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}