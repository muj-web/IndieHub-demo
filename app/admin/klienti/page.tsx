'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft, User, Building, MapPin, Trash2, Search, Plus, Mail } from 'lucide-react';

export default function AdresarKlientu() {
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    setLoading(true);
    const { data } = await supabase.from('billing_clients').select('*').order('name');
    if (data) setClients(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu chcete tohoto klienta smazat?')) return;
    const { error } = await supabase.from('billing_clients').delete().eq('id', id);
    if (error) alert(error.message);
    else setClients(clients.filter(c => c.id !== id));
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.ic && c.ic.includes(search))
  );

  if (loading) return <div className="min-h-screen bg-zinc-50 dark:bg-slate-950 flex items-center justify-center text-zinc-500 dark:text-slate-500 font-bold uppercase tracking-widest text-xs transition-colors duration-500">Načítám adresář...</div>;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-slate-950 p-8 font-sans text-zinc-900 dark:text-slate-200 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center text-xs font-bold uppercase text-zinc-500 dark:text-slate-500 hover:text-amber-500 dark:hover:text-amber-400 mb-8 tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Zpět na přehled
        </Link>

        <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-extrabold mb-1 text-zinc-900 dark:text-white tracking-tight">Adresář klientů</h1>
            <p className="text-zinc-500 dark:text-slate-400 text-sm font-medium">Správa fakturačních údajů odběratelů</p>
          </div>
          
          <div className="relative group w-full md:w-auto">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-zinc-400 dark:text-slate-500 group-focus-within:text-amber-500 dark:group-focus-within:text-amber-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Hledat podle jména nebo IČ..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900/50 border border-zinc-200 dark:border-slate-800 rounded-xl w-full md:w-72 focus:outline-none focus:border-amber-400 dark:focus:border-amber-500/50 text-zinc-900 dark:text-slate-100 shadow-sm dark:shadow-none transition-colors" 
            />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map(client => (
            <div key={client.id} className="bg-white dark:bg-slate-900/40 rounded-3xl border border-zinc-200 dark:border-slate-800 p-6 flex flex-col hover:border-amber-400 dark:hover:border-amber-500/30 transition-all group shadow-sm hover:shadow-md dark:shadow-none">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-amber-50 dark:bg-slate-800 rounded-2xl border border-amber-100 dark:border-slate-700 text-amber-600 dark:text-amber-500 transition-colors">
                  <Building className="w-6 h-6" />
                </div>
                <button onClick={() => handleDelete(client.id)} className="p-2 text-zinc-400 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-zinc-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-zinc-900 dark:text-slate-100 mb-4 line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{client.name}</h3>
              
              <div className="space-y-2 text-sm text-zinc-500 dark:text-slate-400 mb-6 flex-grow">
                {client.ic && <div className="flex items-center gap-2 font-mono"><span className="text-zinc-400 dark:text-slate-600 font-bold uppercase text-[10px] w-8 tracking-widest">IČ:</span> {client.ic}</div>}
                {client.dic && <div className="flex items-center gap-2 font-mono"><span className="text-zinc-400 dark:text-slate-600 font-bold uppercase text-[10px] w-8 tracking-widest">DIČ:</span> {client.dic}</div>}
                <div className="flex items-start gap-2 pt-2 mt-2 border-t border-zinc-100 dark:border-slate-800/50">
                  <MapPin className="w-4 h-4 mt-0.5 text-zinc-400 dark:text-slate-600 shrink-0" />
                  <span>{client.street}<br />{client.zip} {client.city}</span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Rychlý odkaz na novou fakturu s novým klientem */}
          <Link href="/nova-faktura" className="border-2 border-dashed border-zinc-300 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-zinc-400 dark:text-slate-500 hover:border-amber-400 dark:hover:border-amber-500/50 hover:text-amber-500 hover:bg-white dark:hover:bg-slate-900/20 transition-all group">
            <Plus className="w-10 h-10 mb-2 opacity-30 dark:opacity-20 group-hover:opacity-100 transition-opacity" />
            <span className="font-bold text-sm uppercase tracking-widest text-center">Přidat klienta<br/>přes novou fakturu</span>
          </Link>
        </div>
      </div>
    </main>
  );
}