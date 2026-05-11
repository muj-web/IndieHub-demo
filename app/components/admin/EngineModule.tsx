'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Palette, MonitorSmartphone, Loader2, ArrowRight, Sparkles, Plus } from 'lucide-react';

export default function EngineModule() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (data) setProjects(data);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">Startuji Engine...</div>;

  return (
    <div className="animate-in fade-in duration-300 max-w-5xl mx-auto">
      <header className="mb-12 text-center relative">
        
        {/* Tlačítko pro nový projekt umístěné vpravo nahoře na desktopu */}
        <div className="absolute right-0 top-0 hidden md:block">
          <Link href="/novy-web" className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-purple-500/20">
            <Plus className="w-4 h-4" /> Nový projekt
          </Link>
        </div>

        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl mb-6 border border-purple-500/20">
          <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 tracking-tight">
          Chameleon Engine
        </h1>
        <p className="text-zinc-500 dark:text-slate-400 text-lg font-medium max-w-xl mx-auto mb-6 md:mb-0">
          Vítej ve vizuálním editoru. Vyber si projekt a začni tvořit.
        </p>

        {/* Tlačítko pro mobilní zobrazení (vycentrované pod textem) */}
        <div className="md:hidden flex justify-center mt-6">
          <Link href="/novy-web" className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-purple-500/20">
            <Plus className="w-4 h-4" /> Nový projekt
          </Link>
        </div>
      </header>

      {projects.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900/30 rounded-[2rem] border border-zinc-200 dark:border-slate-800 border-dashed flex flex-col items-center justify-center shadow-sm dark:shadow-none transition-colors">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 transition-colors">
            <MonitorSmartphone className="w-8 h-8 text-zinc-400 dark:text-slate-500" />
          </div>
          <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">Prázdné plátno</h3>
          <p className="text-zinc-500 dark:text-slate-400 max-w-md mx-auto mb-8">
            Zatím nemáš založený žádný webový projekt. Vytvoř svůj první projekt a vrhni se na skládání vizuálních komponent.
          </p>
          <Link href="/novy-web" className="flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-purple-500/20">
            <Plus className="w-4 h-4" /> Vytvořit první projekt
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-slate-900/40 rounded-[2rem] border border-zinc-200 dark:border-slate-800 p-8 flex flex-col h-full hover:border-purple-400 dark:hover:border-purple-500/50 transition-all shadow-sm hover:shadow-xl dark:shadow-none group relative overflow-hidden">
              
              {/* Dekorativní glow na pozadí */}
              <div 
                className="absolute -top-20 -right-20 w-40 h-40 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                style={{ backgroundColor: project.accent_color || '#8E44ED' }}
              />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-zinc-50 dark:bg-slate-950/50 border border-zinc-100 dark:border-slate-800 shrink-0 group-hover:scale-105 transition-transform duration-500">
                    <MonitorSmartphone className="w-6 h-6 text-zinc-400 dark:text-slate-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-white leading-tight mb-1">{project.project_name}</h3>
                    <p className="text-sm font-medium text-zinc-500 dark:text-slate-400">{project.client_name || 'Interní projekt'}</p>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-slate-800/50">
                  <Link 
                    href={`/builder/${project.id}`} 
                    className="flex items-center justify-center gap-2 w-full py-4 text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all hover:scale-105 shadow-lg group-hover:shadow-purple-500/20"
                    style={{ backgroundColor: project.accent_color || '#8E44ED' }}
                  >
                    <Palette className="w-4 h-4" /> Otevřít Builder <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}