'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Search, Calendar, CalendarDays, Clock, CheckCircle, DollarSign, MapPin, Trash2, Edit3, ChevronRight, LayoutGrid, List, Mail, Phone, RefreshCw } from 'lucide-react';

export default function PhotoModule() {
  const [weddings, setWeddings] = useState<any[]>([]);
  const [photoSearch, setPhotoSearch] = useState('');
  const [photoFilter, setPhotoFilter] = useState('vse');
  const [photoViewMode, setPhotoViewMode] = useState<'grid' | 'calendar' | 'list'>('grid');
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [syncingIds, setSyncingIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeddings = async () => {
      setLoading(true);
      const { data } = await supabase.from('weddings').select('*').order('wedding_date', { ascending: true });
      if (data) setWeddings(data);
      setLoading(false);
    };
    fetchWeddings();
  }, []);

  const handlePhotoDelete = async (id: string) => {
    if (!confirm('Opravdu chcete tuto svatební zakázku smazat?')) return;
    const { error } = await supabase.from('weddings').delete().eq('id', id);
    if (error) alert(error.message);
    else setWeddings(weddings.filter(w => w.id !== id));
  };

  const updatePhotoStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('weddings').update({ status: newStatus }).eq('id', id);
    if (error) alert(error.message);
    else setWeddings(weddings.map(w => w.id === id ? { ...w, status: newStatus } : w));
  };

  const syncToCalendar = async (wedding: any) => {
    setSyncingIds(prev => [...prev, wedding.id]); 
    try {
      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wedding })
      });
      const data = await response.json();
      if (data.success) alert('Svatba byla úspěšně přidána do Google Kalendáře! 📅');
      else alert('Došlo k chybě: ' + data.error);
    } catch (error) {
      alert('Nepodařilo se spojit se serverem.');
    } finally {
      setSyncingIds(prev => prev.filter(id => id !== wedding.id));
    }
  };

  const filteredWeddings = weddings.filter(w => {
    const matchesSearch = w.client_names.toLowerCase().includes(photoSearch.toLowerCase()) || (w.location_name && w.location_name.toLowerCase().includes(photoSearch.toLowerCase()));
    const matchesFilter = photoFilter === 'vse' || w.status === photoFilter;
    return matchesSearch && matchesFilter;
  });

  const getPhotoStatusStyle = (status: string) => {
    switch(status) {
      case 'nova_poptavka': return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30';
      case 'ceka_na_odpoved': return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      case 'osobni_schuzka': return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30';
      case 'potvrzeno': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      case 'zruseno': return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
      default: return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Načítám...</div>;

  return (
    <div className="animate-in fade-in duration-300">
      
      {/* HLAVIČKA */}
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-extrabold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">
            Fotografické zakázky
          </h1>
          <p className="text-slate-400 text-sm font-medium">Správa svatebních focení a galerií</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
          <div className="relative group w-full sm:w-auto">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
            <input type="text" placeholder="Vyhledat svatby..." value={photoSearch} onChange={(e) => setPhotoSearch(e.target.value)} className="pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-800 rounded-xl w-full sm:w-72 focus:outline-none focus:border-purple-500/50 text-slate-100" />
          </div>
          <Link href="/nova-zakazka" className="w-full sm:w-auto flex items-center justify-center bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-6 py-2.5 rounded-xl font-bold whitespace-nowrap hover:from-purple-500 hover:to-fuchsia-500 transition-colors">+ Nová svatba</Link>
        </div>
      </header>

      {/* STATISTIKY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Celkem svateb', value: weddings.length, icon: <CalendarDays className="w-6 h-6 text-purple-400" /> },
          { label: 'Rezervováno', value: weddings.filter(w=>w.status==='potvrzeno').length, icon: <CheckCircle className="w-6 h-6 text-emerald-400" /> },
          { label: 'Nová poptávka', value: weddings.filter(w=>w.status==='nova_poptavka').length, icon: <Clock className="w-6 h-6 text-cyan-400" /> },
          { label: 'Odh. Příjem', value: `${(weddings.reduce((s, w) => s + (Number(w.price_czk)||0), 0)).toLocaleString('cs-CZ')} Kč`, icon: <DollarSign className="w-6 h-6 text-amber-400" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50 flex items-center justify-between">
            <div><div className="text-sm text-slate-400 mb-1">{stat.label}</div><div className="text-3xl font-black text-slate-100">{stat.value}</div></div>
            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* FILTRY A ZOBRAZENÍ (Hlavní řádek) */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-4">
        
        {/* Filtry vlevo */}
        <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-3 bg-slate-900/30 p-2 rounded-2xl border border-slate-800/50 w-full xl:w-auto items-center">
          <span className="px-3 py-2 text-sm font-bold text-slate-500 hidden md:block whitespace-nowrap">Filtrovat:</span>
          {[
            { id: 'vse', label: 'Vše', count: weddings.length },
            { id: 'nova_poptavka', label: 'Poptávka', count: weddings.filter(w=>w.status==='nova_poptavka').length },
            { id: 'ceka_na_odpoved', label: 'Čeká', count: weddings.filter(w=>w.status==='ceka_na_odpoved').length },
            { id: 'osobni_schuzka', label: 'Schůzka', count: weddings.filter(w=>w.status==='osobni_schuzka').length },
            { id: 'potvrzeno', label: 'Potvrzeno', count: weddings.filter(w=>w.status==='potvrzeno').length },
            { id: 'zruseno', label: 'Zrušeno', count: weddings.filter(w=>w.status==='zruseno').length }
          ].map((f) => (
            <button key={f.id} onClick={() => setPhotoFilter(f.id)} className={`flex-grow md:flex-none flex justify-center items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-colors whitespace-nowrap ${photoFilter === f.id ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
              {f.label} <span className={`text-[10px] px-2 py-0.5 rounded-full ${photoFilter === f.id ? 'bg-white/20' : 'bg-slate-800'}`}>{f.count}</span>
            </button>
          ))}
        </div>

        {/* Přepínač zobrazení vpravo (už bez kalendáře) */}
        <div className="flex gap-1 bg-slate-900 p-1.5 rounded-xl border border-slate-800 shrink-0 w-full xl:w-auto justify-start xl:justify-end">
          <button onClick={() => setPhotoViewMode('grid')} className={`p-2 rounded-lg transition-colors ${photoViewMode === 'grid' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`} title="Karty"><LayoutGrid className="w-4 h-4" /></button>
          <button onClick={() => setPhotoViewMode('list')} className={`p-2 rounded-lg transition-colors ${photoViewMode === 'list' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`} title="Seznam"><List className="w-4 h-4" /></button>
          <button onClick={() => setPhotoViewMode('calendar')} className={`p-2 rounded-lg transition-colors ${photoViewMode === 'calendar' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`} title="Kalendář"><CalendarDays className="w-4 h-4" /></button>
        </div>
      </div>

      {/* NAVIGACE KALENDÁŘE (Samostatný řádek pod filtry) */}
      {photoViewMode === 'calendar' && (
        <div className="flex items-center gap-4 mb-8 bg-slate-900/30 p-2 rounded-2xl border border-slate-800/50 w-fit">
          <div className="flex items-center justify-center gap-1">
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><ChevronRight className="w-4 h-4 rotate-180" /></button>
            <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white border-x border-slate-800 transition-colors">Dnes</button>
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <h2 className="text-sm font-bold text-slate-300 capitalize pr-3">
             {currentDate.toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' })}
          </h2>
        </div>
      )}

      {/* OBSAH STRÁNKY PODLE MÓDU */}
      {filteredWeddings.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed text-slate-500">Zadaným filtrům neodpovídají žádné zakázky.</div>
      ) : (
        photoViewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWeddings.map((wedding) => (
              <div key={wedding.id} className="bg-slate-900/40 rounded-3xl border border-slate-800 p-7 flex flex-col h-full hover:border-purple-500/30 transition-colors group">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold text-slate-100 leading-tight group-hover:text-purple-300 transition-colors">{wedding.client_names}</h3>
                  <select value={wedding.status} onChange={(e) => updatePhotoStatus(wedding.id, e.target.value)} className={`text-[9px] font-black uppercase px-2.5 py-1.5 rounded-lg cursor-pointer outline-none appearance-none tracking-wider ${getPhotoStatusStyle(wedding.status)}`}>
                    <option value="nova_poptavka" className="bg-slate-900 text-cyan-400">Nová poptávka</option>
                    <option value="ceka_na_odpoved" className="bg-slate-900 text-amber-400">Čeká na odp.</option>
                    <option value="osobni_schuzka" className="bg-slate-900 text-indigo-400">Schůzka</option>
                    <option value="potvrzeno" className="bg-slate-900 text-emerald-400">Potvrzeno</option>
                    <option value="zruseno" className="bg-slate-900 text-rose-400">Zrušeno</option>
                  </select>
                </div>
                <div className="space-y-3 mb-8 text-sm flex-grow">
                  <div className="flex items-center text-slate-400"><MapPin className="w-4 h-4 mr-3 text-slate-500 shrink-0" /> <span className="truncate">{wedding.location_name || 'Neurčeno'}</span></div>
                  <div className="flex items-center text-slate-400"><Calendar className="w-4 h-4 mr-3 text-slate-500 shrink-0" /> {new Date(wedding.wedding_date).toLocaleDateString('cs-CZ')}</div>
                  {wedding.client_email && <div className="flex items-center text-slate-400"><Mail className="w-4 h-4 mr-3 text-slate-500 shrink-0" /> <span className="truncate">{wedding.client_email}</span></div>}
                  {wedding.client_phone && <div className="flex items-center text-slate-400"><Phone className="w-4 h-4 mr-3 text-slate-500 shrink-0" /> <span className="truncate">{wedding.client_phone}</span></div>}
                  <div className="flex items-center font-bold text-slate-200 pt-2"><DollarSign className="w-4 h-4 mr-3 text-purple-400 shrink-0" /> {Number(wedding.price_czk).toLocaleString('cs-CZ')} Kč</div>
                </div>
                <div className="pt-5 border-t border-slate-800/50 flex flex-wrap justify-between items-center mt-auto gap-y-4">
                  <button onClick={() => handlePhotoDelete(wedding.id)} className="flex items-center text-slate-500 hover:text-rose-400 text-[11px] font-bold uppercase tracking-widest transition-colors"><Trash2 className="w-3.5 h-3.5 mr-1.5" /> Smazat</button>
                  <div className="flex items-center gap-4">
                    <button onClick={() => syncToCalendar(wedding)} disabled={syncingIds.includes(wedding.id)} className="flex items-center text-slate-500 hover:text-blue-400 text-[11px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"><RefreshCw className={`w-3.5 h-3.5 mr-1 ${syncingIds.includes(wedding.id) ? 'animate-spin text-blue-400' : ''}`} /><span className="hidden sm:inline">Kalendář</span></button>
                    <Link href={`/upravit/${wedding.id}`} className="flex items-center text-slate-500 hover:text-slate-300 text-[11px] font-bold uppercase tracking-widest transition-colors"><Edit3 className="w-3.5 h-3.5 mr-1.5" /> Upravit</Link>
                    <Link href={`/detail/${wedding.id}`} className="flex items-center text-purple-400 hover:text-purple-300 text-[11px] font-bold uppercase tracking-widest transition-colors">Detail <ChevronRight className="w-3.5 h-3.5 ml-1" /></Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : photoViewMode === 'list' ? (
          <div className="bg-slate-900/40 rounded-3xl border border-slate-800 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <th className="px-6 py-4">Klient</th>
                  <th className="px-6 py-4">Datum a Místo</th>
                  <th className="px-6 py-4">Kontakt</th>
                  <th className="px-6 py-4">Cena</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Akce</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredWeddings.map(wedding => (
                  <tr key={wedding.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-200">{wedding.client_names}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      <div>{new Date(wedding.wedding_date).toLocaleDateString('cs-CZ')}</div>
                      <div className="text-[10px] uppercase mt-0.5 opacity-60">{wedding.location_name || 'Neurčeno'}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {wedding.client_email && <div className="truncate w-32">{wedding.client_email}</div>}
                      {wedding.client_phone && <div>{wedding.client_phone}</div>}
                      {!wedding.client_email && !wedding.client_phone && <span className="opacity-50">Bez kontaktu</span>}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-200">{Number(wedding.price_czk).toLocaleString('cs-CZ')} Kč</td>
                    <td className="px-6 py-4">
                      <select value={wedding.status} onChange={(e) => updatePhotoStatus(wedding.id, e.target.value)} className={`text-[9px] font-black uppercase px-2.5 py-1.5 rounded-md border tracking-wider cursor-pointer outline-none transition-colors ${getPhotoStatusStyle(wedding.status)}`}>
                        <option value="nova_poptavka" className="bg-slate-900 text-cyan-400">Nová poptávka</option>
                        <option value="ceka_na_odpoved" className="bg-slate-900 text-amber-400">Čeká na odp.</option>
                        <option value="osobni_schuzka" className="bg-slate-900 text-indigo-400">Schůzka</option>
                        <option value="potvrzeno" className="bg-slate-900 text-emerald-400">Potvrzeno</option>
                        <option value="zruseno" className="bg-slate-900 text-rose-400">Zrušeno</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => syncToCalendar(wedding)} disabled={syncingIds.includes(wedding.id)} className="p-2 text-slate-500 hover:text-blue-400 rounded-lg transition-colors"><RefreshCw className={`w-4 h-4 ${syncingIds.includes(wedding.id) ? 'animate-spin' : ''}`} /></button>
                        <button onClick={() => handlePhotoDelete(wedding.id)} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                        <Link href={`/upravit/${wedding.id}`} className="p-2 text-slate-500 hover:text-purple-400 hover:bg-slate-800 rounded-lg transition-colors"><Edit3 className="w-4 h-4" /></Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-slate-900/40 rounded-3xl border border-slate-800 p-4 md:p-8 overflow-x-auto">
            <div className="min-w-[700px] grid grid-cols-7 gap-px bg-slate-800 rounded-2xl border border-slate-800 overflow-hidden">
              {['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'].map(day => (
                <div key={day} className="bg-slate-900/80 p-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">{day}</div>
              ))}
              
              {(() => {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const firstDay = new Date(year, month, 1).getDay();
                const offset = firstDay === 0 ? 6 : firstDay - 1;
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                
                const days = [];
                for (let i = 0; i < offset; i++) {
                  days.push(<div key={`empty-${i}`} className="bg-slate-950/20 min-h-[120px]" />);
                }
                
                for (let d = 1; d <= daysInMonth; d++) {
                  const dayWeddings = filteredWeddings.filter(w => {
                    const wDate = new Date(w.wedding_date);
                    return wDate.getDate() === d && wDate.getMonth() === month && wDate.getFullYear() === year;
                  });
                  
                  days.push(
                    <div key={d} className={`min-h-[120px] bg-slate-950/40 p-2 hover:bg-slate-900/60 transition-colors group relative ${dayWeddings.length > 0 ? 'bg-purple-900/10' : ''}`}>
                      <span className={`text-xs font-bold transition-colors ${new Date().toDateString() === new Date(year, month, d).toDateString() ? 'text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full' : 'text-slate-700 group-hover:text-slate-400'}`}>{d}</span>
                      <div className="mt-2 space-y-1">
                        {dayWeddings.map(w => (
                          <Link key={w.id} href={`/detail/${w.id}`} className={`block p-2 rounded-lg text-[10px] font-black uppercase border leading-tight transition-colors hover:scale-105 hover:z-10 relative ${getPhotoStatusStyle(w.status)}`}>
                            {w.client_names.split(' & ')[0]}...
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }
                return days;
              })()}
            </div>
          </div>
        )
      )}
    </div>
  );
}