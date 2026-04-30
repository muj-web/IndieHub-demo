'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FileSignature, Plus, CheckCircle2, Clock, XCircle, FileEdit, Trash2, Loader2, X, Save } from 'lucide-react';

interface QuoteItem {
  id: string; // Slouží jen pro React klíč při tvorbě
  name: string;
  qty: number;
  unit: string;
  price: number;
}

export default function QuotesModule() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Stavy pro Modal (vyskakovací okno)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  
  // Výchozí stav pro položky - jeden prázdný řádek
  const [items, setItems] = useState<QuoteItem[]>([
    { id: '1', name: '', qty: 1, unit: 'ks', price: 0 }
  ]);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('quotes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setQuotes(data);
    setLoading(false);
  };

  const deleteQuote = async (id: string) => {
    await supabase.from('quotes').delete().eq('id', id);
    fetchQuotes();
  };

  // --- LOGIKA PRO KALKULÁTOR --- //

  // Výpočet celkové ceny (Množství * Cena za všechny řádky)
  const totalAmount = items.reduce((sum, item) => sum + (item.qty * item.price), 0);

  const handleAddItem = () => {
    setItems([...items, { id: Math.random().toString(), name: '', qty: 1, unit: 'hod', price: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSaveQuote = async () => {
    if (!clientName) return alert('Doplňte jméno klienta');
    
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Uložíme hlavičku nabídky do tabulky quotes
    const { data: newQuote, error: quoteError } = await supabase
      .from('quotes')
      .insert([{ 
        user_id: user.id, 
        client_name: clientName, 
        project_name: projectName, 
        amount: totalAmount,
        status: 'draft' 
      }])
      .select()
      .single();

    // 2. Uložíme položky do tabulky quote_items
    if (newQuote && !quoteError) {
      const itemsToInsert = items.filter(i => i.name !== '').map(item => ({
        quote_id: newQuote.id,
        name: item.name,
        quantity: item.qty,
        unit: item.unit,
        unit_price: item.price
      }));

      if (itemsToInsert.length > 0) {
        await supabase.from('quote_items').insert(itemsToInsert);
      }
    }

    // Vyčistíme formulář a zavřeme okno
    setClientName('');
    setProjectName('');
    setItems([{ id: '1', name: '', qty: 1, unit: 'ks', price: 0 }]);
    setIsModalOpen(false);
    setIsSaving(false);
    fetchQuotes(); // Načteme aktualizovaný seznam
  };

  // --- POMOCNÉ FUNKCE --- //
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved': return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Schváleno</span>;
      case 'sent': return <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Odesláno</span>;
      case 'rejected': return <span className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> Zamítnuto</span>;
      default: return <span className="px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-xs font-bold flex items-center gap-1"><FileEdit className="w-3 h-3" /> Návrh</span>;
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* --- VYSKAKOVACÍ OKNO PRO NOVOU NABÍDKU --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto pt-20 pb-20">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Hlavička modalu */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <FileSignature className="w-6 h-6 text-indigo-500" /> Nová cenová nabídka
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tělo modalu */}
            <div className="p-6 md:p-8 space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Jméno klienta / Firmy *</label>
                  <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="např. Novák s.r.o." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Název projektu</label>
                  <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="např. Tvorba firemního webu" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
              </div>

              {/* Kalkulátor položek */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                <div className="hidden md:grid grid-cols-12 gap-4 mb-2 px-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <div className="col-span-5">Položka</div>
                  <div className="col-span-2">Množství</div>
                  <div className="col-span-2">Jednotka</div>
                  <div className="col-span-2">Cena/jedn.</div>
                  <div className="col-span-1"></div>
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-slate-900 md:bg-transparent p-3 md:p-0 rounded-xl border border-slate-800 md:border-none">
                      <div className="col-span-1 md:col-span-5">
                        <input type="text" placeholder="Popis práce (např. Programování, Cestovné...)" value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 text-sm" />
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <input type="number" min="0" value={item.qty} onChange={(e) => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 text-sm" />
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <select value={item.unit} onChange={(e) => updateItem(item.id, 'unit', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 text-sm appearance-none cursor-pointer">
                          <option value="ks">ks (Kusy)</option>
                          <option value="hod">hod (Hodiny)</option>
                          <option value="kpl">kpl (Komplet)</option>
                          <option value="km">km (Kilometry)</option>
                        </select>
                      </div>
                      <div className="col-span-1 md:col-span-2 relative">
                        <input type="number" min="0" value={item.price} onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 text-sm" />
                        <span className="absolute right-3 top-3 text-slate-500 text-sm pointer-events-none">Kč</span>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button onClick={() => handleRemoveItem(item.id)} className="p-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors w-full md:w-auto flex justify-center">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={handleAddItem} className="mt-4 flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors px-2 py-2">
                  <Plus className="w-4 h-4" /> Přidat další položku
                </button>
              </div>

            </div>

            {/* Patička modalu (Součet a uložení) */}
            <div className="p-6 border-t border-slate-800 bg-slate-950 flex flex-col md:flex-row justify-between items-center gap-6 rounded-b-3xl">
              <div>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Celková cena bez DPH</p>
                <p className="text-4xl font-black text-white">{totalAmount.toLocaleString('cs-CZ')} <span className="text-indigo-500">Kč</span></p>
              </div>
              
              <div className="flex w-full md:w-auto gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-800 transition-colors flex-grow md:flex-grow-0">
                  Zrušit
                </button>
                <button 
                  onClick={handleSaveQuote} 
                  disabled={isSaving}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20 flex-grow md:flex-grow-0 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Uložit návrh
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
      {/* --- KONEC MODALU --- */}


      {/* HLAVNÍ STRÁNKA MODULU */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl">
              <FileSignature className="w-8 h-8" />
            </div>
            Cenové nabídky
          </h1>
          <p className="text-slate-400 mt-2">Vytvářejte a sledujte nabídky pro své klienty.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-5 h-5" /> Nová nabídka
        </button>
      </header>

      {/* Rychlé statistiky */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-1">V řešení</p>
          <p className="text-3xl font-black text-white">{quotes.filter(q => q.status === 'draft' || q.status === 'sent').length}</p>
        </div>
        <div className="bg-emerald-900/10 border border-emerald-900/30 p-6 rounded-3xl">
          <p className="text-emerald-500/70 font-bold text-sm uppercase tracking-widest mb-1">Schváleno</p>
          <p className="text-3xl font-black text-emerald-400">{quotes.filter(q => q.status === 'approved').length}</p>
        </div>
        <div className="bg-indigo-900/10 border border-indigo-900/30 p-6 rounded-3xl">
          <p className="text-indigo-500/70 font-bold text-sm uppercase tracking-widest mb-1">Celková hodnota návrhů</p>
          <p className="text-3xl font-black text-indigo-400">
            {quotes.filter(q => q.status !== 'rejected').reduce((sum, q) => sum + Number(q.amount), 0).toLocaleString('cs-CZ')} Kč
          </p>
        </div>
      </div>

      {/* Seznam nabídek */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>
        ) : quotes.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
              <FileSignature className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Zatím tu nic není</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Vytvořte svou první cenovou nabídku a oslňte klienta profesionálním vzhledem.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {quotes.map((quote) => (
              <div key={quote.id} className="p-6 hover:bg-slate-800/20 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-white">{quote.client_name}</h3>
                    {getStatusBadge(quote.status)}
                  </div>
                  <p className="text-slate-400 text-sm">{quote.project_name}</p>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-slate-500 font-medium">Hodnota</p>
                    <p className="text-xl font-black text-white">{Number(quote.amount).toLocaleString('cs-CZ')} Kč</p>
                  </div>
                  
                  <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => deleteQuote(quote.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}