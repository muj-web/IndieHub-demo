'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Camera, Save } from 'lucide-react';

export default function NovaZakazka() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    client_names: '',
    wedding_date: '',
    location_name: '',
    price_czk: '',
    status: 'ceka',
    gallery_status: 'pripravuje_se',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('weddings')
      .insert([
        { 
          ...formData, 
          price_czk: Number(formData.price_czk)
        }
      ]);

    if (error) {
      alert('Chyba při ukládání: ' + error.message);
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-slate-950 p-8 font-sans text-zinc-900 dark:text-slate-200 transition-colors duration-500 selection:bg-purple-500/30">
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900/50 p-8 rounded-[2rem] shadow-sm dark:shadow-none border border-zinc-200 dark:border-slate-800 transition-colors duration-500">
        <Link href="/" className="inline-flex items-center text-xs font-bold uppercase text-zinc-500 dark:text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 mb-8 tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Zpět na přehled
        </Link>
        
        <header className="flex items-center gap-4 mb-8 border-b border-zinc-100 dark:border-slate-800/50 pb-6">
          <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl border border-purple-100 dark:border-purple-500/20">
            <Camera className="w-6 h-6 text-purple-600 dark:text-purple-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-slate-100">Nová svatební zakázka</h1>
            <p className="text-sm text-zinc-500 dark:text-slate-400 font-medium mt-1">Založení nové karty pro svatební focení</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-slate-500 ml-1 block mb-2">Jména novomanželů *</label>
            <input 
              required
              type="text" 
              className="w-full p-4 bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-purple-500 outline-none text-zinc-900 dark:text-slate-200 transition-colors font-bold"
              placeholder="Např. Jana & Michal"
              onChange={(e) => setFormData({...formData, client_names: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-slate-500 ml-1 block mb-2">Datum svatby *</label>
              <input 
                required
                type="date" 
                className="w-full p-4 bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-purple-500 outline-none text-zinc-900 dark:text-slate-200 transition-colors [color-scheme:light] dark:[color-scheme:dark] font-bold"
                onChange={(e) => setFormData({...formData, wedding_date: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-slate-500 ml-1 block mb-2">Cena (Kč)</label>
              <input 
                type="number" 
                className="w-full p-4 bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-purple-500 outline-none text-purple-600 dark:text-purple-400 font-black transition-colors"
                placeholder="0"
                onChange={(e) => setFormData({...formData, price_czk: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-slate-500 ml-1 block mb-2">Lokalita</label>
            <input 
              type="text" 
              className="w-full p-4 bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-purple-500 outline-none text-zinc-900 dark:text-slate-200 transition-colors"
              placeholder="Např. Zámek Blatná"
              onChange={(e) => setFormData({...formData, location_name: e.target.value})}
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-slate-500 ml-1 block mb-2">Poznámky k focení</label>
            <textarea 
              rows={4}
              className="w-full p-4 bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-purple-500 outline-none text-zinc-900 dark:text-slate-200 transition-colors resize-y"
              placeholder="Specifická přání, překvapení, kontakty na svědky..."
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white p-5 rounded-xl font-black uppercase tracking-widest hover:from-purple-500 hover:to-fuchsia-500 transition-all disabled:opacity-50 mt-8 shadow-lg shadow-purple-500/20 dark:shadow-none flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? 'Ukládám...' : <><Save className="w-5 h-5" /> Vytvořit zakázku</>}
          </button>
        </form>
      </div>
    </main>
  );
}