'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, ExternalLink, ImageIcon, Clock, FileText, CheckCircle, Save, Mail, Send, Edit3 } from 'lucide-react';

export default function DetailZakazky() {
  const params = useParams();
  const [wedding, setWedding] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Stavy pro editaci
  const [notes, setNotes] = useState('');
  const [schedule, setSchedule] = useState('');
  const [galleryUrl, setGalleryUrl] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  
  // Stavy načítání pro zobrazení "Ukládám..."
  const [savingNotes, setSavingNotes] = useState(false);
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [savingGalleryUrl, setSavingGalleryUrl] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);

  const fetchWedding = async () => {
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('id', params.id)
      .single();

    if (data) {
      setWedding(data);
      setNotes(data.notes || '');
      setSchedule(data.schedule || '');
      setGalleryUrl(data.gallery_url || '');
      setClientEmail(data.client_email || '');
    }
    if (error) console.error(error);
    setLoading(false);
  };

  useEffect(() => {
    fetchWedding();
  }, [params.id]);

  const updateGalleryStatus = async (newStatus: string) => {
    const { error } = await supabase.from('weddings').update({ gallery_status: newStatus }).eq('id', wedding.id);
    if (!error) fetchWedding();
  };

  const saveField = async (field: string, value: string, setSavingState: (s: boolean) => void) => {
    setSavingState(true);
    const { error } = await supabase.from('weddings').update({ [field]: value }).eq('id', wedding.id);
    setSavingState(false);
    if (error) alert('Chyba při ukládání: ' + error.message);
  };

  // Generování předvyplněného e-mailu
  const handleSendEmail = () => {
    if (!clientEmail || !galleryUrl) return;

    // Extrakce jmen (pokud je formát např. "Tomáš & Michaela", vezme první část nebo celou string)
    const names = wedding.client_names.split('&').join('a').trim(); 
    
    const subject = encodeURIComponent('Vaše svatební galerie je připravena! 📸');
    const body = encodeURIComponent(`Milí novomanželé,

doufám, že se máte skvěle! 

Mám pro vás skvělou zprávu - vaše svatební galerie je hotová a připravená k prohlížení. Všechny fotky z vašeho úžasného dne najdete na tomto odkazu:

${galleryUrl}

Moc děkuji, že jsem mohl být součástí vaší svatby. Kdybyste k fotkám cokoliv potřebovali, určitě se ozvěte.

Mějte se krásně,
[Tvé Jméno]`);

    // Otevření výchozího e-mailového klienta
    window.open(`mailto:${clientEmail}?subject=${subject}&body=${body}`, '_blank');
    
    // Volitelně: Automaticky po kliknutí změnit status na "Odesláno"
    updateGalleryStatus('odeslano');
  };

  if (loading) return <div className="p-10 text-center text-slate-400 min-h-screen bg-slate-950">Načítání detailu...</div>;
  if (!wedding) return <div className="p-10 text-center text-rose-400 min-h-screen bg-slate-950">Zakázka nebyla nalezena.</div>;

return (
    <main className="min-h-screen bg-zinc-50 dark:bg-slate-950 text-zinc-900 dark:text-slate-200 p-8 font-sans selection:bg-purple-500/30 transition-colors duration-500">
      <div className="max-w-5xl mx-auto">
        
        <Link href="/" className="inline-flex items-center text-zinc-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm font-bold uppercase tracking-widest transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Zpět na přehled
        </Link>

        {/* Hlavička detailu */}
        <header className="bg-white dark:bg-slate-900/40 backdrop-blur-md p-8 rounded-3xl border border-zinc-200 dark:border-slate-800 mb-8 flex flex-col md:flex-row md:justify-between md:items-start gap-6 shadow-sm dark:shadow-none transition-colors duration-500">
          <div>
            <h1 className="text-4xl font-black text-zinc-900 dark:text-slate-100 mb-3">{wedding.client_names}</h1>
            <div className="flex flex-wrap items-center text-zinc-500 dark:text-slate-400 gap-6 text-sm font-medium">
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" /> {new Date(wedding.wedding_date).toLocaleDateString('cs-CZ')}</span>
              <span className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" /> {wedding.location_name || 'Lokalita neuvedena'}</span>
            </div>
          </div>
          <div className="md:text-right">
            <div className="text-xs text-zinc-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-2">Dohodnutá cena</div>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{Number(wedding.price_czk).toLocaleString()} Kč</div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Levý sloupec */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white dark:bg-slate-900/40 p-8 rounded-3xl border border-zinc-200 dark:border-slate-800 focus-within:border-purple-400 dark:focus-within:border-purple-500/50 shadow-sm dark:shadow-none transition-colors duration-500">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-slate-100 flex items-center">
                  <FileText className="w-5 h-5 mr-3 text-purple-600 dark:text-purple-400" /> Poznámky ze schůzky
                </h2>
                {savingNotes && <span className="text-xs text-zinc-400 dark:text-slate-500 flex items-center"><Save className="w-3 h-3 mr-1 animate-pulse" /> Ukládám...</span>}
              </div>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={() => saveField('notes', notes, setSavingNotes)}
                placeholder="Sem si piš vše důležité ze schůzek..."
                className="w-full min-h-[150px] bg-transparent text-zinc-700 dark:text-slate-300 placeholder-zinc-400 dark:placeholder-slate-600 outline-none resize-y leading-relaxed"
              />
            </section>

            <section className="bg-white dark:bg-slate-900/40 p-8 rounded-3xl border border-zinc-200 dark:border-slate-800 focus-within:border-blue-400 dark:focus-within:border-blue-500/50 shadow-sm dark:shadow-none transition-colors duration-500">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-slate-100 flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" /> Harmonogram dne
                </h2>
                {savingSchedule && <span className="text-xs text-zinc-400 dark:text-slate-500 flex items-center"><Save className="w-3 h-3 mr-1 animate-pulse" /> Ukládám...</span>}
              </div>
              <textarea 
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                onBlur={() => saveField('schedule', schedule, setSavingSchedule)}
                placeholder="10:00 - Příjezd..."
                className="w-full min-h-[250px] bg-transparent text-zinc-700 dark:text-slate-300 placeholder-zinc-400 dark:placeholder-slate-600 outline-none resize-y leading-relaxed font-mono text-sm"
              />
            </section>
          </div>

          {/* Pravý sloupec */}
          <div className="space-y-6">
            
            {/* Odeslání galerie a kontakty */}
            <div className="bg-white dark:bg-slate-900/40 p-6 rounded-3xl border border-zinc-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors duration-500">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-slate-500 mb-5 flex items-center">
                <Send className="w-4 h-4 mr-2" /> Odeslání galerie
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 block">E-mail klienta</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-400 dark:text-slate-600" />
                    <input 
                      type="email" 
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      onBlur={() => saveField('client_email', clientEmail, setSavingEmail)}
                      placeholder="novomanzele@email.cz"
                      className="w-full bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-zinc-900 dark:text-slate-300 placeholder-zinc-400 dark:placeholder-slate-600 outline-none focus:border-purple-400 dark:focus:border-purple-500/50 focus:ring-1 focus:ring-purple-400 dark:focus:ring-purple-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 block flex justify-between">
                    Odkaz na galerii
                    {savingGalleryUrl && <span className="text-xs text-zinc-400 dark:text-slate-500 animate-pulse">Ukládám...</span>}
                  </label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-3 w-4 h-4 text-zinc-400 dark:text-slate-600" />
                    <input 
                      type="url" 
                      value={galleryUrl}
                      onChange={(e) => setGalleryUrl(e.target.value)}
                      onBlur={() => saveField('gallery_url', galleryUrl, setSavingGalleryUrl)}
                      placeholder="https://tvoje-jmeno.pic-time.com/..."
                      className="w-full bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-zinc-900 dark:text-slate-300 placeholder-zinc-400 dark:placeholder-slate-600 outline-none focus:border-purple-400 dark:focus:border-purple-500/50 focus:ring-1 focus:ring-purple-400 dark:focus:ring-purple-500/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Chytré tlačítko pro odeslání e-mailu */}
                {galleryUrl && clientEmail ? (
                  <button 
                    onClick={handleSendEmail}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] mt-2"
                  >
                    <Send className="w-4 h-4" /> Odeslat e-mail klientovi
                  </button>
                ) : (
                  <div className="text-xs text-zinc-500 dark:text-slate-500 text-center italic mt-2 p-3 bg-zinc-50 dark:bg-slate-900/50 rounded-lg border border-zinc-200 dark:border-slate-800/50">
                    Vyplň e-mail i odkaz pro aktivaci odeslání.
                  </div>
                )}
              </div>
            </div>

            {/* Stav Odevzdání Galerie */}
            <div className="bg-white dark:bg-slate-900/40 p-6 rounded-3xl border border-zinc-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors duration-500">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-slate-500 mb-4 flex items-center">
                <ImageIcon className="w-4 h-4 mr-2" /> Stav odevzdání
              </h3>
              <div className="space-y-2">
                {[
                  { id: 'pripravuje_se', label: 'Zpracovává se' },
                  { id: 'k_odeslani', label: 'Čeká na odeslání' },
                  { id: 'odeslano', label: 'Odevzdáno klientovi' }
                ].map((status) => (
                  <button
                    key={status.id}
                    onClick={() => updateGalleryStatus(status.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-between ${
                      wedding.gallery_status === status.id 
                        ? 'bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 shadow-sm dark:shadow-none' 
                        : 'bg-zinc-50 dark:bg-slate-900/50 text-zinc-600 dark:text-slate-400 hover:bg-zinc-100 dark:hover:bg-slate-800 border border-transparent'
                    }`}
                  >
                    {status.label}
                    {wedding.gallery_status === status.id && <CheckCircle className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Rychlé akce */}
            <Link 
              href={`/upravit/${wedding.id}`} 
              className="flex items-center justify-center gap-2 w-full px-4 py-4 bg-zinc-100 dark:bg-slate-800 text-zinc-700 dark:text-slate-300 hover:text-zinc-900 dark:hover:text-white rounded-xl font-bold hover:bg-zinc-200 dark:hover:bg-slate-700 transition-colors border border-zinc-200 dark:border-slate-700 mt-6 shadow-sm dark:shadow-none"
            >
              <Edit3 className="w-4 h-4" /> Upravit základní údaje
            </Link>

          </div>
        </div>
      </div>
    </main>
  );
}