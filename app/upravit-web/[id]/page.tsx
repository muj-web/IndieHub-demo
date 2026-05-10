'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function UpravitWeb() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    project_name: '',
    client_name: '',
    client_notes: '',
    launch_date: '',
    time_estimated: '0',
    time_spent: '0',
    hourly_rate: '0',
    total_price: '0'
  });

  // Načtení dat stávajícího projektu
  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase.from('projects').select('*').eq('id', params.id).single();

      if (data) {
        setFormData({
          project_name: data.project_name || '',
          client_name: data.client_name || '',
          client_notes: data.client_notes || '',
          launch_date: data.launch_date || '',
          time_estimated: data.time_estimated?.toString() || '0',
          time_spent: data.time_spent?.toString() || '0',
          hourly_rate: data.hourly_rate?.toString() || '0',
          total_price: data.total_price?.toString() || '0'
        });
      }
      setLoading(false);
    };

    fetchProject();
  }, [params.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from('projects').update({
        project_name: formData.project_name,
        client_name: formData.client_name,
        client_notes: formData.client_notes,
        launch_date: formData.launch_date || null,
        time_estimated: Number(formData.time_estimated),
        time_spent: Number(formData.time_spent),
        hourly_rate: Number(formData.hourly_rate),
        total_price: Number(formData.total_price)
      })
      .eq('id', params.id);

    if (error) {
      alert('Chyba: ' + error.message);
      setSaving(false);
    } else {
      // Po úspěšném uložení se vrátíme zpět na detail projektu
      router.push(`/web-detail/${params.id}`);
      router.refresh();
    }
  };

  // Funkce pro rychlý výpočet celkové ceny z hodinovky a odhadovaného času
  const calculateTotal = () => {
    const est = Number(formData.time_estimated) || 0;
    const rate = Number(formData.hourly_rate) || 0;
    setFormData({ ...formData, total_price: (est * rate).toString() });
  };

  if (loading) return <div className="p-10 text-center font-sans bg-slate-950 min-h-screen text-slate-400">Načítám data projektu...</div>;

  return (
    <main className="min-h-screen bg-slate-950 p-8 font-sans text-slate-200">
      <div className="max-w-2xl mx-auto bg-slate-900/50 p-8 rounded-3xl shadow-sm border border-slate-800">
        <Link href={`/web-detail/${params.id}`} className="text-xs font-bold uppercase text-slate-500 hover:text-cyan-400 mb-6 block transition-colors">← Zpět na detail</Link>
        <h1 className="text-3xl font-black mb-8 text-slate-100">Údaje o projektu a klientovi</h1>

        <form onSubmit={handleUpdate} className="space-y-6">
          
          {/* Základní údaje */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Název projektu</label>
              <input 
                required
                type="text" 
                value={formData.project_name}
                className="w-full p-3.5 bg-slate-900 border border-slate-800 rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none font-bold text-slate-200"
                onChange={(e) => setFormData({...formData, project_name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Cílové datum spuštění</label>
              <input 
                type="date" 
                value={formData.launch_date}
                className="w-full p-3.5 bg-slate-900 border border-slate-800 rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none font-bold text-slate-200 [color-scheme:dark]"
                onChange={(e) => setFormData({...formData, launch_date: e.target.value})}
              />
            </div>
          </div>

          <div className="border-t border-slate-800/50 pt-6">
            <h3 className="text-sm font-bold text-slate-300 mb-4">Informace o klientovi</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Jméno klienta / Firmy</label>
                <input 
                  type="text" 
                  value={formData.client_name}
                  className="w-full p-3.5 bg-slate-900 border border-slate-800 rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none font-bold text-slate-200"
                  onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Poznámky ke klientovi (Fakturace, kontakt, specifika...)</label>
                <textarea 
                  rows={4}
                  value={formData.client_notes}
                  className="w-full p-3.5 bg-slate-900 border border-slate-800 rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none text-slate-300 resize-y"
                  onChange={(e) => setFormData({...formData, client_notes: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/50 pt-6">
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-sm font-bold text-slate-300">Rozpočet a čas</h3>
              <button type="button" onClick={calculateTotal} className="text-[10px] font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300">
                Vypočítat celkovou cenu
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Odhad (h)</label>
                <input 
                  type="number" 
                  value={formData.time_estimated}
                  className="w-full p-3.5 bg-slate-900 border border-slate-800 rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none font-bold text-slate-200"
                  onChange={(e) => setFormData({...formData, time_estimated: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Odpracováno (h)</label>
                <input 
                  type="number" 
                  value={formData.time_spent}
                  className="w-full p-3.5 bg-slate-900 border border-slate-800 rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none font-bold text-slate-200"
                  onChange={(e) => setFormData({...formData, time_spent: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Sazba (Kč/h)</label>
                <input 
                  type="number" 
                  value={formData.hourly_rate}
                  className="w-full p-3.5 bg-slate-900 border border-slate-800 rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none font-bold text-slate-200"
                  onChange={(e) => setFormData({...formData, hourly_rate: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Cena (Kč)</label>
                <input 
                  type="number" 
                  value={formData.total_price}
                  className="w-full p-3.5 bg-slate-900 border border-slate-800 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none font-black text-emerald-400"
                  onChange={(e) => setFormData({...formData, total_price: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-5 rounded-xl font-black uppercase tracking-widest hover:from-blue-500 hover:to-cyan-500 transition-colors disabled:opacity-50 mt-8 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
          >
            {saving ? 'Ukládám změny...' : 'Uložit parametry'}
          </button>
        </form>
      </div>
    </main>
  );
}