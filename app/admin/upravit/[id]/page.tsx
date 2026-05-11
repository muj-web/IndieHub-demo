'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit3, Save } from 'lucide-react';

export default function EditaceZakazky() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    client_names: '',
    wedding_date: '',
    location_name: '',
    price_czk: '',
    status: '',
    notes: ''
  });

  useEffect(() => {
    const fetchWedding = async () => {
      const { data, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('id', params.id)
        .single();

      if (data) {
        setFormData({
          client_names: data.client_names,
          wedding_date: data.wedding_date,
          location_name: data.location_name || '',
          price_czk: data.price_czk.toString(),
          status: data.status,
          notes: data.notes || ''
        });
      }
      setLoading(false);
    };

    fetchWedding();
  }, [params.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('weddings')
      .update({
        ...formData,
        price_czk: Number(formData.price_czk)
      })
      .eq('id', params.id);

    if (error) {
      alert('Chyba: ' + error.message);
      setSaving(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  if (loading) return <div className="p-10 text-center font-sans bg-zinc-50 dark:bg-slate-950 min-h-screen text-zinc-500 dark:text-slate-400 transition-colors duration-500">Načítám data zakázky...</div>;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-slate-950 p-8 font-sans text-zinc-900 dark:text-slate-200 transition-colors duration-500 selection:bg-purple-500/30">
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900/50 p-8 rounded-[2rem] shadow-sm dark:shadow-none border border-zinc-200 dark:border-slate-800 transition-colors duration-500">
        <Link href={`/detail/${params.id}`} className="inline-flex items-center text-xs font-bold uppercase text-zinc-500 dark:text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 mb-8 tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Zpět na detail
        </Link>

        <header className="flex items-center gap-4 mb-8 border-b border-zinc-100 dark:border-slate-800/50 pb-6">
          <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl border border-purple-100 dark:border-purple-500/20">
            <Edit3 className="w-6 h-6 text-purple-600 dark:text-purple-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-slate-100">Upravit zakázku</h1>
            <p className="text-sm text-zinc-500 dark:text-slate-400 font-medium mt-1">{formData.client_names}</p>
          </div>
        </header>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-slate-500 ml-1 block mb-2">Klienti *</label>
            <input 
              required
              type="text" 
              value={formData.client_names}
              className="w-full p-4 bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-purple-500 outline-none text-zinc-900 dark:text-slate-200 transition-colors font-bold"
              onChange={(e) => setFormData({...formData, client_names: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-slate-500 ml-1 block mb-2">Datum svatby *</label>
              <input 
                required
                type="date" 
                value={formData.wedding_date}
                className="w-full p-4 bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-purple-500 outline-none text-zinc-900 dark:text-slate-200 transition-colors [color-scheme:light] dark:[color-scheme:dark] font-bold"
                onChange={(e) => setFormData({...formData, wedding_date: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-slate-500 ml-1 block mb-2">Cena (Kč)</label>
              <input 
                type="number" 
                value={formData.price_czk}
                className="w-full p-4 bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-purple-500 outline-none text-purple-600 dark:text-purple-400 font-black transition-colors"
                onChange={(e) => setFormData({...formData, price_czk: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-slate-500 ml-1 block mb-2">Lokalita</label>
            <input 
              type="text" 
              value={formData.location_name}
              className="w-full p-4 bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-purple-500 outline-none text-zinc-900 dark:text-slate-200 transition-colors"
              onChange={(e) => setFormData({...formData, location_name: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white p-5 rounded-xl font-black uppercase tracking-widest hover:from-purple-500 hover:to-fuchsia-500 transition-all disabled:opacity-50 mt-8 shadow-lg shadow-purple-500/20 dark:shadow-none flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
          >
            {saving ? 'Ukládám změny...' : <><Save className="w-5 h-5" /> Uložit zakázku</>}
          </button>
        </form>
      </div>
    </main>
  );
}