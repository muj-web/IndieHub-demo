'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MonitorSmartphone, Save, Calendar, User, DollarSign } from 'lucide-react';

export default function NovyWeb() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    project_name: '',
    client_name: '',
    launch_date: '',
    time_estimated: '0',
    hourly_rate: '1000',
    status: 'rozpracovano'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('web_projects').insert([{
      ...formData,
      time_estimated: Number(formData.time_estimated),
      hourly_rate: Number(formData.hourly_rate),
      total_price: Number(formData.time_estimated) * Number(formData.hourly_rate)
    }]);

    if (error) {
      alert('Chyba: ' + error.message);
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 p-8 font-sans text-slate-200">
      <div className="max-w-2xl mx-auto bg-slate-900/50 p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <Link href="/" className="inline-flex items-center text-xs font-bold uppercase text-slate-500 hover:text-cyan-400 mb-8 tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Zpět na přehled
        </Link>
        
        <header className="flex items-center gap-4 mb-10 border-b border-slate-800/50 pb-6">
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <MonitorSmartphone className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-100">Nový webový projekt</h1>
            <p className="text-sm text-slate-400 font-medium mt-1">Založení nové zakázky na vývoj webu</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 ml-1 block mb-2">Název projektu *</label>
            <input 
              required
              type="text" 
              placeholder="Např. E-shop se sportovním vybavením"
              value={formData.project_name}
              onChange={(e) => setFormData({...formData, project_name: e.target.value})}
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none text-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1 block mb-2 flex items-center gap-2"><User className="w-3 h-3" /> Jméno klienta</label>
              <input 
                type="text" 
                placeholder="Jan Novák"
                value={formData.client_name}
                onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none text-slate-200"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1 block mb-2 flex items-center gap-2"><Calendar className="w-3 h-3" /> Cílové spuštění</label>
              <input 
                type="date" 
                value={formData.launch_date}
                onChange={(e) => setFormData({...formData, launch_date: e.target.value})}
                className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none text-slate-200 [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1 block mb-2">Časový odhad (hodiny)</label>
              <input 
                type="number" 
                value={formData.time_estimated}
                onChange={(e) => setFormData({...formData, time_estimated: e.target.value})}
                className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none text-slate-200 font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1 block mb-2 flex items-center gap-2"><DollarSign className="w-3 h-3" /> Hodinová sazba (Kč)</label>
              <input 
                type="number" 
                value={formData.hourly_rate}
                onChange={(e) => setFormData({...formData, hourly_rate: e.target.value})}
                className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none text-slate-200 font-bold"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-5 rounded-xl font-black uppercase tracking-widest hover:from-blue-500 hover:to-cyan-500 transition-colors disabled:opacity-50 mt-4 flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20"
          >
            {loading ? 'Ukládám...' : <><Save className="w-5 h-5" /> Vytvořit projekt</>}
          </button>
        </form>
      </div>
    </main>
  );
}