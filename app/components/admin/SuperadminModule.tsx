'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
// Importujeme nový hook pro hezká potvrzovací okna
import { useConfirm } from '@/lib/components/ConfirmProvider';
import { 
  ShieldAlert, Users, Server, Zap, Globe, 
  Trash2, UserX, ExternalLink, AlertTriangle, 
  Clock
} from 'lucide-react';

const ALL_AVAILABLE_MODULES = [
  { id: 'web', label: 'Weby' },
  { id: 'photo', label: 'Foto' },
  { id: 'quotes', label: 'Nabídky' },
  { id: 'billing', label: 'Faktury' },
  { id: 'bookings', label: 'Schůzky' },
  { id: 'content', label: 'Obsah' }
];

export default function SuperadminModule() {
  // Inicializujeme potvrzovací modal
  const confirm = useConfirm();
  
  const [clients, setClients] = useState<any[]>([]);
  const [urgentInvoices, setUrgentInvoices] = useState<any[]>([]);
  const [newBookings, setNewBookings] = useState<any[]>([]);
  
  const [stats, setStats] = useState({
    totalClients: 0,
    totalProjects: 0,
    demoProjects: 0,
    liveProjects: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuperadminData();
  }, []);

async function fetchSuperadminData() {
    setLoading(true);
    
    // 1. Načteme profily a projekty ZVLÁŠŤ (nejbezpečnější cesta)
    const { data: profiles, error: pError } = await supabase
      .from('profiles')
      .select('*');

    const { data: projects, error: projError } = await supabase
      .from('projects')
      .select('id, status, owner_id');

    if (pError) {
      // Místo 'console.error' dáme 'console.warn', aby Next.js neházel červenou obrazovku
      console.warn("Superadmin upozornění: Nelze načíst profily:", pError.message);
      setClients([]);
    } else {
      // 2. Ručně spojíme data na frontendu
      const profilesWithProjects = (profiles || []).map(profile => ({
        ...profile,
        projects: (projects || []).filter(proj => proj.owner_id === profile.id)
      }));

      setClients(profilesWithProjects);
      
      // 3. Výpočet statistik
      const totalProjs = projects?.length || 0;
      const demoProjs = projects?.filter(prj => prj.status === 'rozpracovano').length || 0;

      setStats({
        totalClients: profiles?.length || 0,
        totalProjects: totalProjs,
        demoProjects: demoProjs,
        liveProjects: totalProjs - demoProjs
      });
    }

    // 4. Načtení urgentních věcí
    const { data: invoices } = await supabase.from('invoices').select('*, billing_clients(name)').eq('status', 'po_splatnosti').limit(5);
    const { data: bookings } = await supabase.from('bookings').select('*').eq('status', 'nova').limit(5);

    if (invoices) setUrgentInvoices(invoices);
    if (bookings) setNewBookings(bookings);

    setLoading(false);
  }

  // Funkce zapíná/vypíná moduly klientům
  async function toggleClientModule(clientId: string, moduleId: string, currentModules: string[]) {
    const isEnabled = currentModules.includes(moduleId);
    const newModules = isEnabled 
      ? currentModules.filter(id => id !== moduleId) 
      : [...currentModules, moduleId];

    const { error } = await supabase.from('profiles').update({ active_modules: newModules }).eq('id', clientId);
    if (!error) {
      setClients(clients.map(c => c.id === clientId ? { ...c, active_modules: newModules } : c));
    } else {
      alert("Chyba při aktualizaci modulů: " + error.message);
    }
  }

  // Funkce na mazání klientů pomocí nového Vizuálního okna
  async function handleDeleteClient(clientId: string, clientIdentifier: string) {
    // Nahradili jsme window.confirm naším moderním hookem
    const isConfirmed = await confirm({
      title: 'Smazat klientský účet?',
      message: `Opravdu chcete trvale smazat klienta "${clientIdentifier}"?\n\nTato akce odstraní i všechny jeho weby a vygenerovaná data.`,
      confirmText: 'Ano, smazat účet',
      cancelText: 'Zrušit',
      type: 'danger'
    });

    if (!isConfirmed) return; // Pokud uživatel zrušil, ukončíme funkci

    // Vlastní proces smazání
    const { error } = await supabase.from('profiles').delete().eq('id', clientId);

    if (error) {
      alert('Chyba při mazání klienta: ' + error.message);
    } else {
      setClients(clients.filter(c => c.id !== clientId));
      fetchSuperadminData();
    }
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-zinc-500 font-bold uppercase tracking-widest text-xs">Načítám God Mode...</div>;

  return (
    <div className="animate-in fade-in duration-300">
      
      <header className="mb-8 flex justify-between items-end">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <ShieldAlert size={14} /> Superadmin Access
          </div>
          <h1 className="text-4xl font-extrabold mb-1 text-zinc-900 dark:text-white tracking-tight">Mission Control</h1>
          <p className="text-zinc-500 dark:text-slate-400 text-sm font-medium">Správa celého ekosystému Chameleon OS.</p>
        </div>
      </header>

      {/* Rychlé Statistiky */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-zinc-200 dark:border-slate-800">
          <div className="text-zinc-500 text-xs font-bold uppercase mb-2 flex items-center"><Users className="w-3.5 h-3.5 mr-2 text-blue-500" /> Klienti</div>
          <div className="text-4xl font-black">{stats.totalClients}</div>
        </div>
        <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-zinc-200 dark:border-slate-800">
          <div className="text-zinc-500 text-xs font-bold uppercase mb-2 flex items-center"><Server className="w-3.5 h-3.5 mr-2 text-purple-500" /> Projekty</div>
          <div className="text-4xl font-black">{stats.totalProjects}</div>
        </div>
        <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-zinc-200 dark:border-slate-800">
          <div className="text-zinc-500 text-xs font-bold uppercase mb-2 flex items-center"><Zap className="w-3.5 h-3.5 mr-2 text-amber-500" /> Demo režim</div>
          <div className="text-4xl font-black text-amber-500">{stats.demoProjects}</div>
        </div>
        <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-zinc-200 dark:border-slate-800">
          <div className="text-zinc-500 text-xs font-bold uppercase mb-2 flex items-center"><Globe className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Ostrý provoz</div>
          <div className="text-4xl font-black text-emerald-500">{stats.liveProjects}</div>
        </div>
      </div>

      {/* ACTION CENTER (Co hoří) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900/40 rounded-3xl border border-rose-200 dark:border-rose-900/30 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-rose-500 uppercase tracking-widest mb-5 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" /> Faktury po splatnosti
          </h2>
          <div className="space-y-3">
            {urgentInvoices.length === 0 ? (
              <p className="text-sm text-zinc-400">Všechny faktury jsou uhrazeny. Peníze tečou!</p>
            ) : (
              urgentInvoices.map(inv => (
                <div key={inv.id} className="flex justify-between items-center p-3 bg-rose-50 dark:bg-rose-500/10 rounded-xl border border-rose-100 dark:border-rose-500/20">
                  <div>
                    <div className="font-bold text-zinc-900 dark:text-zinc-200 text-sm">{inv.billing_clients?.name || 'Neznámý klient'}</div>
                    <div className="text-xs text-rose-600 dark:text-rose-400 font-medium">Splatnost: {new Date(inv.due_date).toLocaleDateString('cs-CZ')}</div>
                  </div>
                  <div className="font-black text-rose-600 dark:text-rose-400">{Number(inv.total_amount).toLocaleString('cs-CZ')} Kč</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/40 rounded-3xl border border-cyan-200 dark:border-cyan-900/30 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-cyan-500 uppercase tracking-widest mb-5 flex items-center">
            <Clock className="w-4 h-4 mr-2" /> Nové poptávky / schůzky
          </h2>
          <div className="space-y-3">
            {newBookings.length === 0 ? (
              <p className="text-sm text-zinc-400">Žádné nové poptávky.</p>
            ) : (
              newBookings.map(book => (
                <div key={book.id} className="flex justify-between items-center p-3 bg-cyan-50 dark:bg-cyan-500/10 rounded-xl border border-cyan-100 dark:border-cyan-500/20">
                  <div>
                    <div className="font-bold text-zinc-900 dark:text-zinc-200 text-sm">{book.client_name}</div>
                    <div className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">{new Date(book.booking_date).toLocaleDateString('cs-CZ')}</div>
                  </div>
                  <div className="text-xs font-bold uppercase bg-white dark:bg-slate-900 text-cyan-600 px-3 py-1 rounded-md shadow-sm">Nová</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* TABULKA KLIENTŮ */}
      <h3 className="text-xl font-extrabold mb-4 text-zinc-900 dark:text-white tracking-tight">Správa Klientských Účtů</h3>
      <div className="bg-white dark:bg-slate-900/40 rounded-[2.5rem] border border-zinc-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-slate-900/60 border-b border-zinc-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <th className="px-8 py-5">ID / Účet</th>
                <th className="px-6 py-5 text-center">Aktivní Moduly</th>
                <th className="px-6 py-5 text-center">Weby</th>
                <th className="px-6 py-5 text-right">Akce</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-slate-800/50">
              {clients.map((client) => (
                <tr key={client.id} className="group hover:bg-zinc-50/50 dark:hover:bg-slate-800/20 transition-colors">
                  
                  {/* OPRAVENÝ 1. SLOUPEC: Identifikace klienta */}
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-slate-800 flex items-center justify-center font-bold text-zinc-500 uppercase shrink-0">
                        {client.full_name ? client.full_name.charAt(0) : (client.email ? client.email.charAt(0) : client.id.slice(0, 1))}
                      </div>
                      
                      <div>
                        {/* Jméno a odznáček */}
                        <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                          {client.full_name || 'Bezejmenný klient'}
                          {client.role === 'superadmin' && (
                            <span title="Superadmin" className="flex items-center"><ShieldAlert size={12} className="text-red-500" /></span>
                          )}
                        </div>
                        {/* E-mail */}
                        <div className="text-sm text-zinc-500 dark:text-slate-400 mt-0.5">
                          {client.email || 'E-mail nezadán'}
                        </div>
                        {/* Typ uživatele */}
                        <div className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mt-1">
                          {client.user_type || 'Typ neurčený'}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* 2. SLOUPEC: Moduly */}
                  <td className="px-6 py-6">
                    <div className="flex justify-center gap-1.5 flex-wrap max-w-sm mx-auto">
                      {ALL_AVAILABLE_MODULES.map(mod => {
                        const isEnabled = client.active_modules?.includes(mod.id);
                        return (
                          <button
                            key={mod.id}
                            onClick={() => toggleClientModule(client.id, mod.id, (client.active_modules as string[]) || [])}
                            className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter border transition-all ${
                              isEnabled 
                                ? 'bg-purple-500/10 text-purple-500 border-purple-500/20 shadow-sm' 
                                : 'bg-zinc-100 dark:bg-slate-800 text-zinc-400 border-transparent opacity-40 hover:opacity-100'
                            }`}
                          >
                            {mod.label}
                          </button>
                        );
                      })}
                    </div>
                  </td>

                  {/* 3. SLOUPEC: Počet webů */}
                  <td className="px-6 py-6 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-slate-800 text-xs font-black text-zinc-600 dark:text-zinc-300">
                      {client.projects?.length || 0}
                    </span>
                  </td>

                  {/* 4. SLOUPEC: Akce a tlačítko do Builderu */}
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      
                      {/* Tlačítko do Builderu */}
                      {client.projects && client.projects.length > 0 && (
                        <Link 
                          href={`/builder/${client.projects[0].id}`} 
                          className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-md mr-2"
                          title="Otevřít Builder posledního projektu"
                        >
                          🎨 Builder
                        </Link>
                      )}

                      <button className="p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg" title="Přihlásit se jako (Impersonate) - Připravujeme">
                        <ExternalLink size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClient(client.id, client.full_name || client.email || 'Neznámý klient')}
                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" 
                        title="Smazat klienta a jeho data"
                      >
                        <UserX size={18} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}