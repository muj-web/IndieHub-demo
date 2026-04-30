'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, CheckCircle, Trash2, CalendarDays, Mail, Video, RefreshCw } from 'lucide-react';

export default function BookingModule() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingIds, setSyncingIds] = useState<string[]>([]); // Stav pro točící se ikonky

// TVOJE AKTUÁLNÍ URL s fallbackem pro TypeScript
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

  // --- UPRAVENO: Mazání smaže událost i v Googlu ---
  const handleDelete = async (booking: any) => {
    if (!confirm(`Opravdu smazat schůzku pro klienta ${booking.client_name} i z kalendáře?`)) return;
    
    setSyncingIds(prev => [...prev, booking.id]);

    try {
      // 1. Smazání z Google Kalendáře a Tabulky (pouze pokud je URL nastavená)
      if (GOOGLE_SCRIPT_URL) {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify({
            action: 'delete',
            booking: { id: booking.id }
          })
        });
      } else {
        console.warn("Není nastavena URL pro Google Kalendář. Přeskakuji mazání z Googlu.");
      }

      // 2. Smazání ze Supabase
      const { error } = await supabase.from('bookings').delete().eq('id', booking.id);
      if (!error) {
        setBookings(bookings.filter(b => b.id !== booking.id));
      } else {
        alert('Chyba při mazání ze Supabase: ' + error.message);
      }
    } catch (error) {
      console.error('Chyba při rušení:', error);
      alert('Nepodařilo se zrušit rezervaci v Googlu.');
    } finally {
      setSyncingIds(prev => prev.filter(id => id !== booking.id));
    }
  };

  const syncToGoogle = async (booking: any) => {
    // Bezpečnostní pojistka
    if (!GOOGLE_SCRIPT_URL) {
      alert("Chyba: Není nastavena adresa pro Google Script v .env.local");
      return;
    }

    setSyncingIds(prev => [...prev, booking.id]);
    
    try {
      const payload = {
        booking: {
          id: booking.id,
          client_name: booking.client_name,
          client_email: booking.client_email,
          booking_date: booking.booking_date,
          service_type: booking.service_type,
          notes: booking.notes,
          status: booking.status === 'nova' ? 'nova_poptavka' : booking.status // Mapování pro script
        }
      };

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        mode: 'no-cors'
      });

      alert('Synchronizováno! 🚀');
    } catch (error) {
      console.error('Chyba syncu:', error);
      alert('Nepodařilo se spojit s Googlem.');
    } finally {
      setSyncingIds(prev => prev.filter(id => id !== booking.id));
    }
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'nova': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'potvrzeno': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'zruseno': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest text-xs">Načítám...</div>;

  return (
    <div className="animate-in fade-in duration-300">
      
      {/* HLAVIČKA */}
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
          Rezervace schůzek
        </h1>
        <p className="text-slate-400 text-sm font-medium">Konzultace, hovory a předsvatební setkání</p>
      </header>

      {/* SEZNAM REZERVACÍ */}
      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed text-slate-500">
          Zatím nemáš žádné naplánované schůzky.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => {
            const dateObj = new Date(booking.booking_date);
            const dateStr = dateObj.toLocaleDateString('cs-CZ');
            const timeStr = dateObj.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
            const isSyncing = syncingIds.includes(booking.id);

            return (
              <div key={booking.id} className="bg-slate-900/40 rounded-3xl border border-slate-800 p-7 flex flex-col h-full hover:border-emerald-500/30 transition-colors group">
                
                {/* Horní část: Jméno a Status */}
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold text-slate-100 leading-tight group-hover:text-emerald-300 transition-colors">{booking.client_name}</h3>
                  <select 
                    value={booking.status} 
                    onChange={(e) => handleStatusChange(booking.id, e.target.value)} 
                    className={`text-[9px] font-black uppercase px-2.5 py-1.5 rounded-lg cursor-pointer outline-none appearance-none tracking-wider border transition-colors ${getStatusStyle(booking.status)}`}
                  >
                    <option value="nova" className="bg-slate-900 text-cyan-400">Nová (K vyřízení)</option>
                    <option value="potvrzeno" className="bg-slate-900 text-emerald-400">Potvrzeno</option>
                    <option value="zruseno" className="bg-slate-900 text-rose-400">Zrušeno</option>
                  </select>
                </div>

                {/* Střední část: Podrobnosti */}
                <div className="space-y-4 mb-8 text-sm flex-grow">
                  
                  {/* Datum a čas v extra bloku */}
                  <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center text-slate-300 font-bold">
                      <CalendarDays className="w-4 h-4 mr-2 text-emerald-400" /> {dateStr}
                    </div>
                    <div className="flex items-center text-slate-300 font-black text-lg">
                      <Clock className="w-4 h-4 mr-1 text-slate-500" /> {timeStr}
                    </div>
                  </div>

                  <div className="flex items-center font-bold text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></span>
                    {booking.service_type}
                  </div>
                  
                  <div className="flex items-center text-slate-400">
                    <Mail className="w-4 h-4 mr-3 text-slate-500 shrink-0" /> 
                    <a href={`mailto:${booking.client_email}`} className="hover:text-emerald-400 transition-colors">{booking.client_email}</a>
                  </div>

                  {booking.notes && (
                    <div className="p-3 bg-slate-900/50 rounded-xl text-slate-400 text-xs italic border border-slate-800/50 leading-relaxed">
                      "{booking.notes}"
                    </div>
                  )}
                </div>

                {/* Spodní část: Akce */}
                <div className="pt-5 border-t border-slate-800/50 flex justify-between items-center mt-auto">
                  <button 
                    onClick={() => handleDelete(booking)} 
                    disabled={isSyncing}
                    className="flex items-center text-slate-500 hover:text-rose-400 text-[11px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                  >
                    {isSyncing ? (
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    Smazat
                  </button>
                  
                  {/* UPRAVENO: Jen malá elegantní ikonka */}
                  <button 
                    onClick={() => syncToGoogle(booking)} 
                    disabled={isSyncing}
                    title="Vynutit synchronizaci s Googlem"
                    className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} /> 
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}