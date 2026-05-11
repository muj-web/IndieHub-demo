'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CalendarDays, Clock, CheckCircle, ChevronRight, ChevronLeft, User, Mail, MessageSquare } from 'lucide-react';

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Stav formuláře
  const [formData, setFormData] = useState({
    service_type: 'Rezervace schůzky',
    booking_date: '',
    booking_time: '14:00',
    client_name: '',
    client_email: '',
    notes: ''
  });

  // Stav pro navigaci v kalendáři
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const availableTimes = ['09:00', '10:30', '13:00', '14:30', '16:00', '18:00'];

  // --- LOGIKA KALENDÁŘE ---
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  // Posuneme tak, aby pondělí bylo první (0) místo neděle
  const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isDateInPast = (day: number) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const handleDateSelect = (day: number) => {
    if (isDateInPast(day)) return;
    
    // YYYY-MM-DD format (správně ošetřeno pro lokální časovou zónu)
    const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day, 12);
    const dateString = dateObj.toISOString().split('T')[0];
    
    setFormData({ ...formData, booking_date: dateString });
  };

  // --- ODESLÁNÍ FORMULÁŘE ---
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const combinedDateTime = new Date(`${formData.booking_date}T${formData.booking_time}:00`);

      // 1. Uložení do Supabase
      const { error, data: insertedData } = await supabase.from('bookings').insert([{
        client_name: formData.client_name,
        client_email: formData.client_email,
        booking_date: combinedDateTime.toISOString(),
        service_type: formData.service_type,
        notes: formData.notes,
        status: 'nova'
      }]).select();

      if (error) throw error;

      // 2. Odeslání do Google Tabulky / Kalendáře přes tvůj skript
      const newBookingId = insertedData && insertedData.length > 0 ? insertedData[0].id : `web-${Date.now()}`;
      
      const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyvVicrcgpBmIEb2QeBYoH4kcfNBqMREj4To22pBr7t_ywsDNkmX408Qpv_5GXjb2QD/exec";

      const payload = {
        booking: {
          id: newBookingId,
          client_name: formData.client_name,
          client_email: formData.client_email,
          booking_date: combinedDateTime.toISOString(),
          service_type: formData.service_type,
          notes: formData.notes,
          status: 'nova_poptavka'
        }
      };

      // Vystřelíme požadavek na Google (nepoužíváme await, ať klient nečeká)
      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        mode: 'no-cors' 
      }).catch(err => console.error("Chyba synchronizace s Googlem:", err));

      setSuccess(true);
    } catch (error: any) {
      alert('Došlo k chybě při odesílání rezervace: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- ÚSPĚŠNÁ OBRAZOVKA ---
  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-slate-900/50 p-8 md:p-12 rounded-3xl border border-slate-800 text-center max-w-md w-full animate-in fade-in zoom-in duration-500">
          <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-white mb-4">Máme to!</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Tvá rezervace byla úspěšně odeslána. Brzy se ti ozvu s potvrzením na e-mail <strong className="text-slate-300">{formData.client_email}</strong>.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors w-full"
          >
            Zpět na hlavní stránku
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans py-12 md:py-20 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Hlavička */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            Rezervace termínu
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Pojďme to probrat</h1>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">Vyber si termín v kalendáři a já se ti brzy ozvu s potvrzením schůzky.</p>
        </div>

        {/* Formulářový box */}
        <div className="bg-slate-900/40 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative">
          
          {/* Progress bar */}
          <div className="h-1.5 w-full bg-slate-800">
            <div className={`h-full bg-emerald-500 transition-all duration-500 ${step === 1 ? 'w-1/2' : 'w-full'}`}></div>
          </div>

          <div className="p-6 md:p-10">
            <form onSubmit={handleSubmit}>
              
              {/* KROK 1: Výběr termínu v Kalendáři */}
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    
                    {/* LEVÁ STRANA: Kalendář */}
                    <div>
                      {/* Navigace kalendáře */}
                      <div className="flex items-center justify-between mb-6">
                        <h2 suppressHydrationWarning className="text-lg font-bold text-white capitalize">
  {currentMonth.toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' })}
</h2>
                        <div className="flex gap-2">
                          <button type="button" onClick={handlePrevMonth} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors border border-slate-800"><ChevronLeft className="w-5 h-5" /></button>
                          <button type="button" onClick={handleNextMonth} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors border border-slate-800"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                      </div>

                      {/* Dny v týdnu hlavička */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'].map(d => (
                          <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest text-slate-500 py-2">{d}</div>
                        ))}
                      </div>

                      {/* Mřížka dnů */}
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: offset }).map((_, i) => (
                          <div key={`empty-${i}`} className="p-2"></div>
                        ))}
                        
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                          const dayNumber = i + 1;
                          const isPast = isDateInPast(dayNumber);
                          
                          // Zjistíme, zda je to víkend pro lehké zešednutí
                          const dateCheck = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNumber);
                          const isWeekend = dateCheck.getDay() === 0 || dateCheck.getDay() === 6;

                          const dateString = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNumber, 12).toISOString().split('T')[0];
                          const isSelected = formData.booking_date === dateString;

                          return (
                            <button
                              key={dayNumber}
                              type="button"
                              onClick={() => handleDateSelect(dayNumber)}
                              disabled={isPast}
                              className={`
                                aspect-square rounded-full flex items-center justify-center text-sm font-bold transition-all
                                ${isPast ? 'text-slate-700 cursor-not-allowed' : ''}
                                ${!isPast && !isSelected && isWeekend ? 'text-slate-500 hover:bg-slate-800 hover:text-white' : ''}
                                ${!isPast && !isSelected && !isWeekend ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : ''}
                                ${isSelected ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-110' : ''}
                              `}
                            >
                              {dayNumber}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* PRAVÁ STRANA: Výběr času a pokračovat */}
                    <div className="flex flex-col h-full">
                      {formData.booking_date ? (
                        <div className="animate-in fade-in duration-300 flex-grow">
                          <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider flex items-center">
                            <Clock className="w-4 h-4 mr-2" /> 
                            Čas pro {new Date(formData.booking_date).toLocaleDateString('cs-CZ')}
                          </h3>
                          <div className="grid grid-cols-2 gap-2 mb-6">
                            {availableTimes.map((time) => (
                              <button
                                key={time}
                                type="button"
                                onClick={() => setFormData({ ...formData, booking_time: time })}
                                className={`py-3 rounded-lg border font-bold transition-all ${formData.booking_time === time ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'}`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex-grow flex items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl p-6 text-center text-slate-500 text-sm">
                          Vyber si datum v kalendáři pro zobrazení dostupných časů.
                        </div>
                      )}

                      <button 
                        type="button" 
                        disabled={!formData.booking_date}
                        onClick={() => setStep(2)} 
                        className="w-full mt-auto bg-white text-slate-950 hover:bg-emerald-400 hover:text-slate-950 py-4 rounded-xl font-black text-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        Pokračovat <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* KROK 2: Kontaktní údaje */}
              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center"><User className="w-6 h-6 mr-3 text-emerald-400" /> Tvoje údaje</h2>
                  
                  {/* Rekapitulace */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center mb-8">
                    <div>
                      <div className="text-emerald-400 font-bold">{new Date(formData.booking_date).toLocaleDateString('cs-CZ')} v {formData.booking_time}</div>
                    </div>
                    <button type="button" onClick={() => setStep(1)} className="text-xs font-bold text-slate-400 hover:text-white underline underline-offset-4 transition-colors">Změnit datum</button>
                  </div>

                  <div className="space-y-5 mb-8">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Jméno a příjmení</label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-600" />
                        <input required type="text" name="client_name" value={formData.client_name} onChange={handleChange} placeholder="Jan Novák" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-700" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">E-mail</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-600" />
                        <input required type="email" name="client_email" value={formData.client_email} onChange={handleChange} placeholder="jan@novak.cz" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-700" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Máš nějakou otázku předem? (Volitelné)</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-3.5 w-5 h-5 text-slate-600" />
                        <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Chtěl bych probrat..." rows={3} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-700 resize-none"></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button type="button" onClick={() => setStep(1)} className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors text-center">
                      Zpět
                    </button>
                    <button 
                      type="submit" 
                      disabled={loading || !formData.client_name || !formData.client_email}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-4 rounded-xl font-black text-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Odesílám...' : 'Potvrdit rezervaci'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
        
        <p className="text-center text-slate-600 text-xs font-bold mt-8">
          Tvoje data jsou u mě v bezpečí. Nikomu je nedám.
        </p>

      </div>
    </div>
  );
}