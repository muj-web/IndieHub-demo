'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MonitorSmartphone, Save, User, Link as LinkIcon, Palette, Loader2, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NovyWeb() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Nový stav pro hezké chybové hlášky
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    project_name: '',
    client_name: '',
    slug: '',
    accent_color: '#8E44ED'
  });

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
    
    setFormData({ ...formData, project_name: name, slug });
    setErrorMsg(null); // Skryjeme error při psaní
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { data: { user } } = await supabase.auth.getUser();

    // 1. Založení samotného projektu
    const { data: newProject, error } = await supabase.from('projects').insert([{
      project_name: formData.project_name,
      client_name: formData.client_name,
      slug: formData.slug,
      accent_color: formData.accent_color,
      status: 'rozpracovano',
      owner_id: user?.id
    }]).select().single();

    if (error || !newProject) {
      // MÍSTO ALERTU NASTAVÍME NÁŠ VLASTNÍ ERROR
      setErrorMsg(error?.message || 'Neznámá chyba při komunikaci s databází.');
      setLoading(false);
      return;
    }

    // 2. Automatické vytvoření výchozí "Homepage"
    const { error: pageError } = await supabase.from('project_pages').insert({
      project_id: newProject.id,
      title: "Domů",
      slug: "", 
      is_homepage: true,
      order_index: 0
    });

    if (pageError) {
      console.error("Chyba při vytváření úvodní stránky:", pageError);
    }

    router.push('/');
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[var(--background)] p-4 sm:p-8 font-sans transition-colors duration-500 flex flex-col justify-center">
      <div className="max-w-2xl mx-auto w-full bg-white dark:bg-slate-900/50 p-8 rounded-[2rem] border border-zinc-200 dark:border-slate-800 shadow-xl dark:shadow-none transition-colors">
        
        <Link href="/" className="inline-flex items-center text-xs font-bold uppercase text-zinc-500 dark:text-slate-500 hover:text-purple-600 dark:hover:text-cyan-400 mb-8 tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Zpět na přehled
        </Link>
        
        <header className="flex items-center gap-4 mb-8 border-b border-zinc-100 dark:border-slate-800/50 pb-6">
          <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl border border-purple-100 dark:border-purple-500/20">
            <MonitorSmartphone className="w-6 h-6 text-purple-600 dark:text-purple-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-slate-100">Nový webový projekt</h1>
            <p className="text-sm text-zinc-500 dark:text-slate-400 font-medium mt-1">Založení čistého plátna pro Chameleon Engine</p>
          </div>
        </header>

        {/* HEZKÁ CHYBOVÁ HLÁŠKA MÍSTO ALERTU */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-grow">
                <h4 className="text-sm font-bold text-rose-800 dark:text-rose-300">Při zakládání projektu došlo k chybě</h4>
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errorMsg}</p>
              </div>
              <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-rose-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-slate-500 ml-1 block mb-2">Název projektu (Webu) *</label>
            <input 
              required
              type="text" 
              placeholder="Např. Kadeřnictví Elite"
              value={formData.project_name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full p-4 bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-purple-500 outline-none text-zinc-900 dark:text-slate-200 transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-slate-500 ml-1 block mb-2 flex items-center gap-2">
              <User className="w-3 h-3" /> Jméno klienta (Volitelné)
            </label>
            <input 
              type="text" 
              placeholder="Jan Novák"
              value={formData.client_name}
              onChange={(e) => setFormData({...formData, client_name: e.target.value})}
              className="w-full p-4 bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-purple-500 outline-none text-zinc-900 dark:text-slate-200 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-100 dark:border-slate-800/50">
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-slate-500 ml-1 block mb-2 flex items-center gap-2">
                <LinkIcon className="w-3 h-3" /> URL Slug (Adresa webu) *
              </label>
              <input 
                required
                type="text" 
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                className="w-full p-4 bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-purple-500 outline-none text-zinc-900 dark:text-slate-200 font-mono text-sm transition-colors"
              />
            </div>
            
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-slate-500 ml-1 block mb-2 flex items-center gap-2">
                <Palette className="w-3 h-3" /> Hlavní barva (Accent Color)
              </label>
              <div className="flex gap-3">
                <input 
                  type="color"
                  value={formData.accent_color}
                  onChange={(e) => setFormData({...formData, accent_color: e.target.value})}
                  className="w-14 h-14 bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-xl p-1 cursor-pointer transition-colors shrink-0"
                />
                <input 
                  type="text" 
                  value={formData.accent_color}
                  onChange={(e) => setFormData({...formData, accent_color: e.target.value})}
                  className="w-full p-4 bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-purple-500 outline-none text-zinc-900 dark:text-slate-200 font-mono text-sm uppercase transition-colors"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white p-5 rounded-xl font-black uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50 mt-8 flex items-center justify-center gap-3 shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Vytvářím prostředí...</> : <><Save className="w-5 h-5" /> Vytvořit projekt</>}
          </button>
        </form>
      </div>
    </main>
  );
}