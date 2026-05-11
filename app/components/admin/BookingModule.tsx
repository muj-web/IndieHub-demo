'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Calendar, Clock, CheckCircle, Trash2, CalendarDays, Mail, RefreshCw, ExternalLink, LayoutGrid, ChevronRight } from 'lucide-react';

export default function BookingModule() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingIds, setSyncingIds] = useState<string[]>([]);
  
  // Stavy pro přepínání zobrazení a kalendář
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('calendar'); // Výchozí může být rovnou kalendář
  const [currentDate, setCurrentDate] = useState(new Date());

  const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || '';

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const { data } = await supabase.from('bookings').select('*').order('booking_date', { ascending: true });
    if (data) setBookings(data);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', id);
    if (error) {
      alert('Chyba při aktualizaci: ' + error.message);
    } else {
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    }
  };

  const handleDelete = async (booking: any) => {
    if (!confirm(`Opravdu smazat schůzku pro klienta ${booking.client_name} i z kalendáře?`)) return;
    setSyncingIds(prev => [...prev, booking.id]);

    try {
      if (GOOGLE_SCRIPT_URL) {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify({ action: 'delete', booking: { id: booking.id } })
        });
      }
      const { error } = await supabase.from('bookings').delete().eq('id', booking.id);
      if (!error) setBookings(bookings.filter(b => b.id !== booking.id));
      else alert('Chyba při mazání: ' + error.message);
    } catch (error) {
      console.error('Chyba při rušení:', error);
    } finally {
      setSyncingIds(prev => prev.filter(id => id !== booking.id));
    }
  };

  const syncToGoogle = async (booking: any) => {
    if (!GOOGLE_SCRIPT_URL) { alert("Chyba: Není nastavena adresa pro Google Script v .env.local"); return; }
    setSyncingIds(prev => [...prev, booking.id]);
    
    try {
      const payload = {
        booking: {
          id: booking.id, client_name: booking.client_name, client_email: booking.client_email,
          booking_date: booking.booking_date, service_type: booking.service_type, notes: booking.notes,
          status: booking.status === 'nova' ? 'nova_poptavka' : booking.status
        }
      };
      await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: JSON.stringify(payload), mode: 'no-cors' });
      alert('Synchronizováno! 🚀');
    } catch (error) {
      alert('Nepodařilo se spojit s Googlem.');
    } finally {
      setSyncingIds(prev => prev.filter(id => id !== booking.id));
    }
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'nova': return 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30';
      case 'potvrzeno': return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30';
      case 'zruseno': return 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30';
      default: return 'bg-zinc-100 dark:bg-slate-800 text-zinc-600 dark:text-slate-300 border-zinc-200 dark:border-slate-700';
    }
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1; // Posun pro pondělí jako první den
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Prázdná místa na začátku měsíce
    for (let i = 0; i < offset; i++) {
      days.push(<div key={`empty-${i}`} className="bg-zinc-50 dark:bg-slate-950/20 min-h-[120px]" />);
    }
    
    // Dny v měsíci
    for (let d = 1; d <= daysInMonth; d++) {
      const dateCheck = new Date(year, month, d);
      const isWeekend = dateCheck.getDay() === 0 || dateCheck.getDay() === 6;
      const isToday = new Date().toDateString() === dateCheck.toDateString();
      
      const dayBookings = bookings.filter(w => {
        const wDate = new Date(w.booking_date);
        return wDate.getDate() === d && wDate.getMonth() === month && wDate.getFullYear() === year;
      });
      
      days.push(
        <div 
          key={d} 
          className={`min-h-[120px] p-2 hover:bg-zinc-50 dark:hover:bg-slate-900/60 transition-colors group relative border-r border-b border-zinc-100 dark:border-slate-800/50 
            ${isWeekend ? 'bg-zinc-50/80 dark:bg-slate-950/80' : 'bg-white dark:bg-slate-900/20'}
          `}
        >
          <span className={`text-xs font-bold transition-colors ${isToday ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full' : (isWeekend ? 'text-zinc-400 dark:text-slate-600' : 'text-zinc-500 dark:text-slate-400')}`}>
            {d}
          </span>
          <div className="mt-2 space-y-1">
            {dayBookings.map(b => {
              const bTime = new Date(b.booking_date).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
              return (
                <div key={b.id} className={`p-1.5 rounded-lg text-[10px] font-bold border leading-tight transition-all hover:scale-[1.02] flex flex-col gap-0.5 ${getStatusStyle(b.status)}`}>
                  <span className="font-black uppercase">{bTime}</span>
                  <span className="truncate">{b.client_name}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return days;
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-zinc-500 font-bold uppercase tracking-widest text-xs">Načítám...</div>;

  return (
    <div className="animate-in fade-in duration-300">
      
      {/* HLAVIČKA */}
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-extrabold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400">
            Rezervace schůzek
          </h1>
          <p className="text-zinc-500 dark:text-slate-400 text-sm font-medium">Konzultace, hovory a předsvatební setkání</p>
        </div>
        <div className="flex w-full md:w-auto">
          <Link 
            href="/rezervace" 
            target="_blank" 
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors text-sm whitespace-nowrap shadow-lg shadow-emerald-500/20 dark:shadow-none"
          >
            <Calendar className="w-4 h-4" /> Rezervační kalendář <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
          </Link>
        </div>
      </header>

      {/* PŘEPÍNAČ ZOBRAZENÍ (Grid vs Kalendář) */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        
        {/* Navigace kalendáře (Zobrazí se jen pokud je aktivní kalendář) */}
        {viewMode === 'calendar' ? (
          <div className="flex items-center gap-4 bg-white dark:bg-slate-900/30 p-2 rounded-2xl border border-zinc-200 dark:border-slate-800/50 w-fit shadow-sm dark:shadow-none transition-colors">
            <div className="flex items-center justify-center gap-1">
              <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-slate-800 rounded-lg text-zinc-500 dark:text-slate-400 transition-colors"><ChevronRight className="w-4 h-4 rotate-180" /></button>
              <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white border-x border-zinc-200 dark:border-slate-800 transition-colors">Dnes</button>
              <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-slate-800 rounded-lg text-zinc-500 dark:text-slate-400 transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
            <h2 className="text-sm font-bold text-zinc-800 dark:text-slate-300 capitalize pr-3">
              {currentDate.toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' })}
            </h2>
          </div>
        ) : (
          <div /> // Prázdné div pro zachování flexbox layoutu
        )}

        <div className="flex gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-zinc-200 dark:border-slate-800 shrink-0 w-full xl:w-auto justify-start xl:justify-end shadow-sm dark:shadow-none transition-colors">
          <button onClick={() => setViewMode('calendar')} className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${viewMode === 'calendar' ? 'bg-zinc-100 dark:bg-slate-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-slate-500 hover:text-zinc-800 dark:hover:text-slate-300'}`} title="Zobrazit jako kalendář"><CalendarDays className="w-4 h-4" /> <span className="text-xs font-bold xl:hidden">Kalendář</span></button>
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${viewMode === 'grid' ? 'bg-zinc-100 dark:bg-slate-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-slate-500 hover:text-zinc-800 dark:hover:text-slate-300'}`} title="Zobrazit jako karty"><LayoutGrid className="w-4 h-4" /> <span className="text-xs font-bold xl:hidden">Karty</span></button>
        </div>
      </div>

      {/* OBSAH */}
      {bookings.length === 0 && viewMode === 'grid' ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900/30 rounded-3xl border border-zinc-200 dark:border-slate-800 border-dashed text-zinc-400 dark:text-slate-500 shadow-sm dark:shadow-none">
          Zatím nemáš žádné naplánované schůzky.
        </div>
      ) : (
        <>
          {viewMode === 'calendar' && (
            <div className="bg-white dark:bg-slate-900/40 rounded-3xl border border-zinc-200 dark:border-slate-800 p-4 md:p-8 overflow-x-auto shadow-sm dark:shadow-none">
              <div className="min-w-[700px] border border-zinc-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-slate-800">
                {/* Hlavička kalendáře - Dny */}
                <div className="grid grid-cols-7 gap-px">
                  {['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'].map((day, idx) => (
                    <div key={day} className={`bg-zinc-50 dark:bg-slate-900/80 p-4 text-center text-[10px] font-black uppercase tracking-widest border-b border-zinc-200 dark:border-slate-800 ${idx >= 5 ? 'text-zinc-400 dark:text-slate-600' : 'text-zinc-500 dark:text-slate-400'}`}>
                      {day}
                    </div>
                  ))}
                </div>
                {/* Tělo kalendáře */}
                <div className="grid grid-cols-7 gap-px">
                  {renderCalendar()}
                </div>
              </div>
            </div>
          )}

          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => {
                const dateObj = new Date(booking.booking_date);
                const dateStr = dateObj.toLocaleDateString('cs-CZ');
                const timeStr = dateObj.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
                const isSyncing = syncingIds.includes(booking.id);

                return (
                  <div key={booking.id} className="bg-white dark:bg-slate-900/40 rounded-3xl border border-zinc-200 dark:border-slate-800 p-7 flex flex-col h-full hover:border-emerald-400 dark:hover:border-emerald-500/30 shadow-sm hover:shadow-md dark:shadow-none transition-all group">
                    
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-slate-100 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">{booking.client_name}</h3>
                      <select 
                        value={booking.status} 
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)} 
                        className={`text-[9px] font-black uppercase px-2.5 py-1.5 rounded-lg cursor-pointer outline-none appearance-none tracking-wider border transition-colors ${getStatusStyle(booking.status)}`}
                      >
                        <option value="nova" className="bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400">Nová (K vyřízení)</option>
                        <option value="potvrzeno" className="bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400">Potvrzeno</option>
                        <option value="zruseno" className="bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400">Zrušeno</option>
                      </select>
                    </div>

                    <div className="space-y-4 mb-8 text-sm flex-grow">
                      <div className="bg-zinc-50 dark:bg-slate-950/50 rounded-xl p-3 border border-zinc-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center text-zinc-800 dark:text-slate-300 font-bold">
                          <CalendarDays className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" /> {dateStr}
                        </div>
                        <div className="flex items-center text-zinc-800 dark:text-slate-300 font-black text-lg">
                          <Clock className="w-4 h-4 mr-1 text-zinc-400 dark:text-slate-500" /> {timeStr}
                        </div>
                      </div>

                      <div className="flex items-center font-bold text-zinc-700 dark:text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></span>
                        {booking.service_type}
                      </div>
                      
                      <div className="flex items-center text-zinc-500 dark:text-slate-400">
                        <Mail className="w-4 h-4 mr-3 text-zinc-400 dark:text-slate-500 shrink-0" /> 
                        <a href={`mailto:${booking.client_email}`} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{booking.client_email}</a>
                      </div>

                      {booking.notes && (
                        <div className="p-3 bg-zinc-50 dark:bg-slate-900/50 rounded-xl text-zinc-500 dark:text-slate-400 text-xs italic border border-zinc-100 dark:border-slate-800/50 leading-relaxed">
                          "{booking.notes}"
                        </div>
                      )}
                    </div>

                    <div className="pt-5 border-t border-zinc-100 dark:border-slate-800/50 flex justify-between items-center mt-auto">
                      <button 
                        onClick={() => handleDelete(booking)} 
                        disabled={isSyncing}
                        className="flex items-center text-zinc-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 text-[11px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                      >
                        {isSyncing ? <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 mr-1.5" />}
                        Smazat
                      </button>
                      
                      <button 
                        onClick={() => syncToGoogle(booking)} 
                        disabled={isSyncing}
                        title="Vynutit synchronizaci s Googlem"
                        className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors disabled:opacity-50 flex items-center justify-center"
                      >
                        <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} /> 
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}