'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, CheckCircle, Clock, CalendarDays, CheckSquare, Receipt, AlertCircle, MonitorSmartphone } from 'lucide-react';

export default function HomeModule() {
  const [stats, setStats] = useState({
    activeWeddings: 0,
    newInquiries: 0,
    upcomingBookings: 0
  });
  
  const [upcomingWeddingsList, setUpcomingWeddingsList] = useState<any[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  
  // Stavy pro úkoly a faktury
  const [tasks, setTasks] = useState<any[]>([]);
  const [unpaidInvoices, setUnpaidInvoices] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);

    try {
      const todayIso = new Date().toISOString();
      const todayDateOnly = new Date().toISOString().split('T')[0];

      // 1. Svatby (Statistiky)
      const { data: weddings } = await supabase.from('weddings').select('status, client_names');
      const active = weddings?.filter(w => w.status === 'potvrzeno' || w.status === 'ceka_na_odpoved')?.length || 0;
      const newInq = weddings?.filter(w => w.status === 'nova_poptavka')?.length || 0;

      // 1b. Nadcházející svatby (seřazeno podle nejbližšího data)
      const { data: upcomingWeds } = await supabase
        .from('weddings')
        .select('*')
        .gte('wedding_date', todayDateOnly) // Jen ty, co jsou dnes nebo v budoucnu
        .order('wedding_date', { ascending: true }) // Seřazeno od nejbližší
        .limit(3);

      // 2. Schůzky
      const { data: bookings } = await supabase
        .from('bookings')
        .select('*')
        .neq('status', 'zruseno')
        .gte('booking_date', todayIso)
        .order('booking_date', { ascending: true })
        .limit(3);

      // 3. Faktury (Čekající na platbu)
      const { data: invoices } = await supabase
        .from('invoices')
        .select('*, billing_clients(name)') // Získáme i jméno klienta z relace
        .eq('status', 'nezaplaceno') // Správný status podle BillingModule
        .order('due_date', { ascending: true })
        .limit(3);

      // 4. Úkoly z webových projektů
      const { data: activeTasks } = await supabase
        .from('web_tasks')
        .select('*, web_projects(project_name)') // Připojíme si i jméno projektu
        .eq('is_completed', false)
        .order('created_at', { ascending: true }) // Od nejstarších
        .limit(4);

      setStats({
        activeWeddings: active,
        newInquiries: newInq,
        upcomingBookings: bookings?.length || 0
      });

      if (upcomingWeds) setUpcomingWeddingsList(upcomingWeds);
      if (bookings) setUpcomingBookings(bookings);
      if (invoices) setUnpaidInvoices(invoices);
      if (activeTasks) setTasks(activeTasks);

    } catch (error) {
      console.error('Chyba při načítání dashboardu:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'nova_poptavka': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      case 'ceka_na_odpoved': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'potvrzeno': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest text-xs">Načítám přehled...</div>;

  return (
    <div className="animate-in fade-in duration-300">
      
      {/* HLAVIČKA */}
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold mb-1 text-white tracking-tight">Vítej zpět, Radku.</h1>
          <p className="text-slate-400 text-sm font-medium">Tady je rychlý přehled toho, co se děje.</p>
        </div>
        <div className="hidden sm:block text-right">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Dnes je</div>
          <div className="text-emerald-400 font-black">{new Date().toLocaleDateString('cs-CZ')}</div>
        </div>
      </header>

      {/* STATISTIKY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2 flex items-center"><CheckCircle className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Aktivní svatby</div>
          <div className="text-4xl font-black text-white">{stats.activeWeddings}</div>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2 flex items-center"><Plus className="w-3.5 h-3.5 mr-2 text-cyan-500" /> Nové poptávky</div>
          <div className="text-4xl font-black text-white">{stats.newInquiries}</div>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2 flex items-center"><CalendarDays className="w-3.5 h-3.5 mr-2 text-purple-500" /> Nadcházející schůzky</div>
          <div className="text-4xl font-black text-white">{stats.upcomingBookings}</div>
        </div>
      </div>

      {/* HLAVNÍ OBSAHOVÁ MŘÍŽKA - 2 SLOUPECE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEVÝ SLOUPEC: Svatby a Faktury */}
        <div className="space-y-6">
          
          {/* Nadcházející svatby */}
          <div className="bg-slate-900/40 rounded-3xl border border-slate-800 p-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5">Nadcházející svatby</h2>
            <div className="space-y-3">
              {upcomingWeddingsList.length === 0 ? (
                <div className="text-sm text-slate-500">Žádné blížící se svatby. Můžeš odpočívat! 🍹</div>
              ) : (
                upcomingWeddingsList.map(wedding => (
                  <div key={wedding.id} className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/50 flex justify-between items-center group hover:border-slate-700 transition-colors">
                    <div>
                      <div className="font-bold text-slate-200 text-sm group-hover:text-emerald-400 transition-colors">{wedding.client_names}</div>
                      <div className="text-[11px] font-medium text-slate-500 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1.5 opacity-70" /> 
                        {wedding.wedding_date ? new Date(wedding.wedding_date).toLocaleDateString('cs-CZ') : 'Termín neurčen'}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-md border text-[9px] font-black uppercase tracking-widest ${getStatusColor(wedding.status)}`}>
                      {wedding.status.replace(/_/g, ' ')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Faktury k proplacení */}
          <div className="bg-slate-900/40 rounded-3xl border border-slate-800 p-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center"><Receipt className="w-4 h-4 mr-2" /> Nezaplacené faktury</h2>
            <div className="space-y-3">
              {unpaidInvoices.length === 0 ? (
                <div className="text-sm text-slate-500">Všechny faktury jsou proplacené. 😎</div>
              ) : (
                unpaidInvoices.map(invoice => (
                  <div key={invoice.id} className="flex justify-between items-center p-3 rounded-xl bg-slate-950/50 border border-slate-800/50">
                    <div>
                      <div className="text-sm font-bold text-slate-300">
                        {invoice.billing_clients?.name || 'Neznámý klient'}
                      </div>
                      <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest mt-0.5">Splatnost: {new Date(invoice.due_date).toLocaleDateString('cs-CZ')}</div>
                    </div>
                    <div className="text-sm font-black text-slate-200">{Number(invoice.total_amount).toLocaleString('cs-CZ')} Kč</div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* PRAVÝ SLOUPEC: Schůzky a Úkoly */}
        <div className="space-y-6">
          
          {/* Nejbližší schůzky */}
          <div className="bg-slate-900/40 rounded-3xl border border-slate-800 p-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center"><CalendarDays className="w-4 h-4 mr-2" /> Nejbližší schůzky</h2>
            <div className="space-y-3">
              {upcomingBookings.length === 0 ? (
                <div className="text-sm text-slate-500 py-2">Žádné blížící se schůzky.</div>
              ) : (
                upcomingBookings.map(booking => {
                  const dateObj = new Date(booking.booking_date);
                  const isToday = dateObj.toDateString() === new Date().toDateString();
                  
                  return (
                    <div key={booking.id} className={`p-3 rounded-2xl border flex items-center gap-4 transition-colors ${isToday ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-950/50 border-slate-800/50 hover:border-slate-700'}`}>
                      <div className={`flex flex-col items-center justify-center min-w-[45px] aspect-square rounded-xl ${isToday ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                        <span className="text-[10px] font-bold uppercase">{dateObj.toLocaleDateString('cs-CZ', { weekday: 'short' })}</span>
                        <span className="text-base font-black leading-none">{dateObj.getDate()}</span>
                      </div>
                      <div className="flex-grow">
                        <div className={`text-sm font-bold mb-0.5 ${isToday ? 'text-emerald-400' : 'text-slate-200'}`}>{booking.client_name}</div>
                        <div className="text-[11px] font-medium text-slate-500">
                          <span className="text-slate-400 font-bold mr-2">{dateObj.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}</span>
                          {booking.service_type}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Úkoly k webům */}
          <div className="bg-slate-900/40 rounded-3xl border border-slate-800 p-6 h-full min-h-[200px]">
             <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center"><CheckSquare className="w-4 h-4 mr-2" /> Úkoly z webů</h2>
             <div className="space-y-3">
               {tasks.length === 0 ? (
                 <div className="text-sm text-slate-500">Máš hotovo! Žádné čekající úkoly na webech.</div>
               ) : (
                 tasks.map(task => (
                   <div key={task.id} className="flex items-start gap-3 p-2 group cursor-pointer">
                     <button className="mt-0.5 w-4 h-4 rounded border border-slate-600 flex-shrink-0 group-hover:border-cyan-500 transition-colors"></button>
                     <div className="flex-grow">
                       <div className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors leading-tight mb-1">{task.title}</div>
                       {task.web_projects?.project_name && (
                         <div className="text-[9px] font-bold text-cyan-500/70 uppercase tracking-widest flex items-center">
                           <MonitorSmartphone className="w-3 h-3 mr-1" /> {task.web_projects.project_name}
                         </div>
                       )}
                     </div>
                   </div>
                 ))
               )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}