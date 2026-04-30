'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  Search, MonitorSmartphone, Clock, CheckCircle, AlertTriangle, 
  LayoutGrid, List, Globe, Trash2, Edit, ChevronRight 
} from 'lucide-react';

export default function WebModule() {
  const [webProjects, setWebProjects] = useState<any[]>([]);
  const [webSearch, setWebSearch] = useState('');
  const [webFilter, setWebFilter] = useState('vse');
  const [webViewMode, setWebViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebs = async () => {
      setLoading(true);
      const { data } = await supabase.from('web_projects').select('*').order('launch_date', { ascending: true });
      if (data) setWebProjects(data);
      setLoading(false);
    };
    fetchWebs();
  }, []);

  const handleWebDelete = async (id: string) => {
    if (!confirm('Opravdu chcete tento projekt smazat?')) return;
    const { error } = await supabase.from('web_projects').delete().eq('id', id);
    if (error) alert(error.message);
    else setWebProjects(webProjects.filter(p => p.id !== id));
  };

  const updateWebStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('web_projects').update({ status: newStatus }).eq('id', id);
    if (error) alert(error.message);
    else setWebProjects(webProjects.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const filteredWebs = webProjects.filter(p => {
    const matchesSearch = p.project_name.toLowerCase().includes(webSearch.toLowerCase()) || (p.client_name && p.client_name.toLowerCase().includes(webSearch.toLowerCase()));
    const matchesFilter = webFilter === 'vse' || p.status === webFilter;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Načítám...</div>;

  // Tady je ta čistá animace stejná jako v HomeModule
  return (
    <div className="animate-in fade-in duration-300">
      
      {/* HLAVIČKA */}
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-extrabold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Webové projekty</h1>
          <p className="text-slate-400 text-sm font-medium">Správa vývoje a klientských webů</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
          <div className="relative group w-full sm:w-auto">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            <input type="text" placeholder="Vyhledat projekty..." value={webSearch} onChange={(e) => setWebSearch(e.target.value)} className="pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-800 rounded-xl w-full sm:w-72 focus:outline-none focus:border-cyan-500/50 text-slate-100" />
          </div>
          <Link href="/novy-web" className="w-full sm:w-auto flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2.5 rounded-xl font-bold hover:from-blue-500 hover:to-cyan-400 transition-colors whitespace-nowrap">+ Nový projekt</Link>
        </div>
      </header>

      {/* STATISTIKY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Celkem projektů', value: webProjects.length, icon: <MonitorSmartphone className="w-6 h-6 text-blue-400" /> },
          { label: 'Rozpracované', value: webProjects.filter(p=>p.status==='rozpracovano').length, icon: <Clock className="w-6 h-6 text-cyan-400" /> },
          { label: 'Dokončené', value: webProjects.filter(p=>p.status==='hotovo').length, icon: <CheckCircle className="w-6 h-6 text-emerald-400" /> },
          { label: 'Po termínu', value: webProjects.filter(p=>p.status==='po_terminu').length, icon: <AlertTriangle className="w-6 h-6 text-rose-400" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50 flex items-center justify-between">
            <div><div className="text-sm text-slate-400 mb-1">{stat.label}</div><div className="text-3xl font-black text-slate-100">{stat.value}</div></div>
            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* FILTRY A PŘEPÍNAČ ZOBRAZENÍ V JEDNOM ŘÁDKU */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8">
        
        {/* Filtry vlevo */}
        <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-3 bg-slate-900/30 p-2 rounded-2xl border border-slate-800/50 w-full xl:w-auto items-center">
          <span className="px-3 py-2 text-sm font-bold text-slate-500 hidden sm:block whitespace-nowrap">Filtrovat:</span>
          {[
            { id: 'vse', label: 'Všechny', count: webProjects.length },
            { id: 'rozpracovano', label: 'Rozpracované', count: webProjects.filter(p=>p.status==='rozpracovano').length },
            { id: 'hotovo', label: 'Hotové', count: webProjects.filter(p=>p.status==='hotovo').length },
            { id: 'po_terminu', label: 'Po termínu', count: webProjects.filter(p=>p.status==='po_terminu').length }
          ].map((f) => (
            <button key={f.id} onClick={() => setWebFilter(f.id)} className={`flex-grow md:flex-none flex justify-center items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-colors whitespace-nowrap ${webFilter === f.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
              {f.label} <span className={`text-[10px] px-2 py-0.5 rounded-full ${webFilter === f.id ? 'bg-white/20' : 'bg-slate-800'}`}>{f.count}</span>
            </button>
          ))}
        </div>

        {/* Přepínač zobrazení vpravo */}
        <div className="flex gap-1 bg-slate-900 p-1.5 rounded-xl border border-slate-800 shrink-0 w-full xl:w-auto justify-start xl:justify-end">
          <button onClick={() => setWebViewMode('grid')} className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${webViewMode === 'grid' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`} title="Zobrazit jako karty"><LayoutGrid className="w-4 h-4" /> <span className="text-xs font-bold xl:hidden">Karty</span></button>
          <button onClick={() => setWebViewMode('list')} className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${webViewMode === 'list' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`} title="Zobrazit jako seznam"><List className="w-4 h-4" /> <span className="text-xs font-bold xl:hidden">Seznam</span></button>
        </div>
      </div>

      {filteredWebs.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed text-slate-500">Zadaným filtrům neodpovídají žádné weby.</div>
      ) : (
        webViewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWebs.map((project) => {
              const progressPercentage = project.tasks_total > 0 ? (project.tasks_completed / project.tasks_total) * 100 : 0;
              return (
                <div key={project.id} className="bg-slate-900/40 rounded-3xl border border-slate-800 p-6 flex flex-col h-full hover:border-cyan-500/30 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-100 leading-tight group-hover:text-cyan-300 transition-colors line-clamp-2">{project.project_name}</h3>
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md tracking-wider flex items-center gap-1 shrink-0 ml-2 ${
                      project.status === 'rozpracovano' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                      project.status === 'hotovo' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-sm text-slate-400 mb-6 flex items-center">
                     <span className="w-4 h-4 rounded-full bg-slate-800 mr-2 flex items-center justify-center text-[8px]">👤</span>
                     {project.client_name || 'Klient neuveden'}
                  </div>
                  <div className="mb-6">
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                      <span>Pokrok</span><span className="text-slate-300">{project.tasks_completed}/{project.tasks_total}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full transition-colors duration-500" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                  </div>
                  <div className="pt-4 flex justify-between items-center mt-auto border-t border-slate-800/50">
                    <button onClick={() => handleWebDelete(project.id)} className="text-slate-600 hover:text-rose-400 flex items-center text-[11px] font-bold uppercase tracking-widest"><Trash2 className="w-3.5 h-3.5 mr-1.5" /> Smazat</button>
                    <Link href={`/web-detail/${project.id}`} className="text-blue-400 hover:text-blue-300 text-[11px] font-bold uppercase tracking-widest flex items-center">Detail <ChevronRight className="w-3.5 h-3.5 ml-1" /></Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-900/40 rounded-3xl border border-slate-800 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <th className="px-6 py-4">Název projektu</th>
                  <th className="px-6 py-4">Klient</th>
                  <th className="px-6 py-4">Spuštění</th>
                  <th className="px-6 py-4">Pokrok</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Akce</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredWebs.map(project => (
                  <tr key={project.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-200">{project.project_name}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{project.client_name || 'Neurčeno'}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{project.launch_date ? new Date(project.launch_date).toLocaleDateString('cs-CZ') : 'Neurčeno'}</td>
                    <td className="px-6 py-4 text-sm text-slate-300 font-bold">{project.tasks_completed} / {project.tasks_total}</td>
                    <td className="px-6 py-4">
                      <select value={project.status} onChange={(e) => updateWebStatus(project.id, e.target.value)} className={`text-[9px] font-black uppercase px-2.5 py-1.5 rounded-md border tracking-wider cursor-pointer outline-none transition-colors ${
                          project.status === 'rozpracovano' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                          project.status === 'hotovo' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                          'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}>
                        <option value="rozpracovano" className="bg-slate-900 text-blue-400">Rozpracováno</option>
                        <option value="hotovo" className="bg-slate-900 text-emerald-400">Hotovo</option>
                        <option value="po_terminu" className="bg-slate-900 text-rose-400">Po termínu</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleWebDelete(project.id)} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        <Link href={`/web-detail/${project.id}`} className="p-2 text-slate-500 hover:text-blue-400 hover:bg-slate-800 rounded-lg"><Edit className="w-4 h-4" /></Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
