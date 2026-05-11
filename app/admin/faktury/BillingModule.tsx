'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { 
  DollarSign, Clock, AlertTriangle, FileText, UserSquare, TrendingUp, 
  Plus, Trash2, Edit3, Eye, Smartphone, X, Settings2, ShoppingCart, QrCode 
} from 'lucide-react';

export default function BillingModule() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoiceFilter, setInvoiceFilter] = useState('vse');
  const [loading, setLoading] = useState(true);

  // --- STAVY PRO RYCHLOU PLATBU (POS TERMINÁL) ---
  const [isPosOpen, setIsPosOpen] = useState(false);
  const [posTotal, setPosTotal] = useState<number>(0);
  const [posCart, setPosCart] = useState<{name: string, price: number}[]>([]);
  const [customPosAmount, setCustomPosAmount] = useState<string>('');
  const [customPosName, setCustomPosName] = useState<string>('Vlastní částka');
  
  const [posServices, setPosServices] = useState<{id: string, name: string, price: number}[]>([]);
  const [isEditingPos, setIsEditingPos] = useState(false);
  const [newPosService, setNewPosService] = useState({name: '', price: ''});

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      const { data } = await supabase.from('invoices').select('*, billing_clients(name)').order('invoice_number', { ascending: false });
      
      if (data) {
        const dnesniPulnoc = new Date();
        dnesniPulnoc.setHours(0, 0, 0, 0);

        const zpracovaneFaktury = data.map(inv => {
          const datumSplatnosti = new Date(inv.due_date);
          if (inv.status === 'nezaplaceno' && datumSplatnosti < dnesniPulnoc) {
            supabase.from('invoices').update({ status: 'po_splatnosti' }).eq('id', inv.id).then();
            return { ...inv, status: 'po_splatnosti' };
          }
          return inv;
        });
        setInvoices(zpracovaneFaktury);
      }
      setLoading(false);
    };
    fetchInvoices();

    const savedPosServices = localStorage.getItem('chameleon_pos_services');
    if (savedPosServices) {
      setPosServices(JSON.parse(savedPosServices));
    }
  }, []);

  const handleInvoiceDelete = async (id: string) => {
    if (!confirm('Opravdu chcete tuto fakturu trvale smazat?')) return;
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) alert(error.message);
    else setInvoices(invoices.filter(i => i.id !== id));
  };

  const updateInvoiceStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('invoices').update({ status: newStatus }).eq('id', id);
    if (error) alert(error.message);
    else setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv));
  };

  const savePosServices = (services: any[]) => {
    setPosServices(services);
    localStorage.setItem('chameleon_pos_services', JSON.stringify(services));
  };

  const handleAddPosService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPosService.name || !newPosService.price) return;
    const updated = [...posServices, { id: Date.now().toString(), name: newPosService.name, price: Number(newPosService.price) }];
    savePosServices(updated);
    setNewPosService({ name: '', price: '' });
  };

  const handleDeletePosService = (id: string) => {
    const updated = posServices.filter(s => s.id !== id);
    savePosServices(updated);
  };

  const addToCart = (name: string, price: number) => {
    setPosCart([...posCart, { name, price }]);
    setPosTotal(prev => prev + price);
  };

  const addCustomToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPosAmount) return;
    const price = Number(customPosAmount);
    setPosCart([...posCart, { name: customPosName || 'Vlastní částka', price }]);
    setPosTotal(prev => prev + price);
    setCustomPosAmount('');
    setCustomPosName('Vlastní částka');
  };

  const clearCart = () => {
    setPosCart([]);
    setPosTotal(0);
  };

  const posIban = process.env.NEXT_PUBLIC_IBAN || 'CZ0000000000000000000000';
  const posSpaydString = `SPD*1.0*ACC:${posIban}*AM:${posTotal.toFixed(2)}*CC:CZK*MSG:Rychla platba`;

  const filteredInvoices = invoices.filter(inv => invoiceFilter === 'vse' || inv.status === invoiceFilter);

  const getInvoiceStatusStyle = (status: string) => {
    switch(status) {
      case 'zaplaceno': return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30';
      case 'nezaplaceno': return 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30';
      case 'po_splatnosti': return 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30';
      case 'storno': return 'bg-zinc-100 dark:bg-slate-800 text-zinc-500 dark:text-slate-500 border border-zinc-200 dark:border-slate-700';
      default: return 'bg-zinc-100 dark:bg-slate-800 text-zinc-600 dark:text-slate-300';
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">Načítám...</div>;

  return (
    <div className="animate-in fade-in duration-300">
      
      {/* POS TERMINÁL (Modal) */}
      {isPosOpen && (
        <div className="fixed inset-0 z-[100] bg-zinc-900/60 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-[2rem] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="w-full md:w-3/5 bg-zinc-50 dark:bg-slate-900 flex flex-col h-[60vh] md:h-auto overflow-hidden">
              <div className="p-6 border-b border-zinc-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-950">
                <h2 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-amber-500" /> Pokladna
                </h2>
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsEditingPos(!isEditingPos)} className={`p-2 rounded-xl transition-colors ${isEditingPos ? 'bg-amber-500/20 text-amber-500' : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-slate-800'}`}>
                    <Settings2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => setIsPosOpen(false)} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors md:hidden">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 flex-grow overflow-y-auto">
                {isEditingPos ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Správa přednastavených služeb</h3>
                      <form onSubmit={handleAddPosService} className="flex gap-2 mb-6">
                        <input type="text" value={newPosService.name} onChange={e => setNewPosService({...newPosService, name: e.target.value})} placeholder="Název" className="flex-1 bg-white dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-500 text-zinc-900 dark:text-white" />
                        <input type="number" value={newPosService.price} onChange={e => setNewPosService({...newPosService, price: e.target.value})} placeholder="Cena" className="w-24 bg-white dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-500 text-zinc-900 dark:text-white" />
                        <button type="submit" className="bg-amber-600 text-white px-3 rounded-xl hover:bg-amber-500"><Plus className="w-5 h-5" /></button>
                      </form>
                    </div>
                    <div className="space-y-2">
                      {posServices.map(srv => (
                        <div key={srv.id} className="flex justify-between items-center p-3 bg-white dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-xl">
                          <span className="font-bold text-sm text-zinc-900 dark:text-slate-200">{srv.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-black text-amber-600 dark:text-amber-500">{srv.price} Kč</span>
                            <button onClick={() => handleDeletePosService(srv.id)} className="text-zinc-400 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {posServices.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Rychlá volba</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {posServices.map(srv => (
                            <button 
                              key={srv.id} 
                              onClick={() => addToCart(srv.name, srv.price)}
                              className="p-4 bg-white dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-2xl text-left hover:border-amber-400 transition-colors shadow-sm active:scale-95"
                            >
                              <div className="font-bold text-zinc-900 dark:text-slate-200 text-sm mb-1 truncate">{srv.name}</div>
                              <div className="font-black text-amber-600 dark:text-amber-500">{srv.price} Kč</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Vlastní částka</h3>
                      <form onSubmit={addCustomToCart} className="flex gap-2">
                        <input type="text" value={customPosName} onChange={e => setCustomPosName(e.target.value)} placeholder="Popis..." className="flex-1 bg-white dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500 text-zinc-900 dark:text-white" />
                        <input type="number" value={customPosAmount} onChange={e => setCustomPosAmount(e.target.value)} placeholder="0 Kč" className="w-28 bg-white dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500 text-zinc-900 dark:text-white font-black" />
                        <button type="submit" className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all">Přidat</button>
                      </form>
                    </div>

                    {posCart.length > 0 && (
                      <div className="border-t border-zinc-200 dark:border-slate-800 pt-6">
                        <div className="flex justify-between items-end mb-4">
                          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><ShoppingCart className="w-4 h-4"/> Účtenka</h3>
                          <button onClick={clearCart} className="text-[10px] uppercase font-bold text-rose-500 hover:text-rose-600">Vymazat</button>
                        </div>
                        <div className="space-y-2 mb-4">
                          {posCart.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-zinc-700 dark:text-slate-300">{item.name}</span>
                              <span className="font-bold text-zinc-900 dark:text-white">{item.price} Kč</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full md:w-2/5 bg-zinc-900 dark:bg-slate-950 p-8 flex flex-col items-center justify-center text-center relative border-l border-zinc-800 h-[40vh] md:h-auto">
              <button onClick={() => setIsPosOpen(false)} className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors hidden md:block">
                <X className="w-6 h-6" />
              </button>
              
              <div className="mb-8">
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-2">K úhradě celkem</p>
                <p className="text-5xl font-black text-amber-500">{posTotal} Kč</p>
              </div>

              <div className="bg-white p-4 rounded-3xl shadow-[0_0_40px_rgba(245,158,11,0.15)] relative">
                {posTotal > 0 ? (
                  <QRCodeSVG value={posSpaydString} size={200} />
                ) : (
                  <div className="w-[200px] h-[200px] flex flex-col items-center justify-center bg-zinc-100 rounded-2xl text-zinc-400">
                    <QrCode className="w-12 h-12 mb-2 opacity-50" />
                    <span className="text-xs font-bold uppercase text-center px-4">Přidejte položku<br/>pro vygenerování</span>
                  </div>
                )}
              </div>
              
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-8 flex items-center gap-2">
                <Smartphone className="w-4 h-4"/> Naskenujte v bankovní aplikaci
              </p>
            </div>
          </div>
        </div>
      )}

      {/* HLAVIČKA MODULU */}
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-extrabold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500 dark:from-amber-400 dark:to-orange-400">Fakturační přehled</h1>
          <p className="text-zinc-500 dark:text-slate-400 text-sm font-medium">Správa dokladů, záloh a klientů</p>
        </div>
        <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsPosOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl font-bold transition-all text-sm whitespace-nowrap shadow-lg shadow-zinc-900/20"
          >
            <Smartphone className="w-4 h-4" /> Platba ihned
          </button>

          <Link href="/klienti" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-100 dark:bg-slate-900 hover:bg-zinc-200 dark:hover:bg-slate-800 text-zinc-700 dark:text-slate-300 rounded-xl font-bold transition-colors text-sm border border-zinc-200 dark:border-slate-800"><UserSquare className="w-4 h-4" /> Adresář</Link>
          
          {/* PŘIDÁNO: Zpět odkaz na Finanční přehled */}
          <Link href="/prehled" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-800 dark:bg-slate-800 hover:bg-zinc-700 dark:hover:bg-slate-700 text-white rounded-xl font-bold transition-colors text-sm border border-zinc-700 dark:border-slate-700"><TrendingUp className="w-4 h-4" /> Přehled</Link>
          
          <Link href="/nova-faktura" className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold transition-colors text-sm whitespace-nowrap shadow-lg shadow-amber-500/20 dark:shadow-none"><Plus className="w-4 h-4" /> Faktura</Link>
        </div>
      </header>

      {/* ... zbytek souboru (statistiky a tabulka) zůstává stejný ... */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Obrat (30 dní)', value: `${invoices.filter(i => i.status === 'zaplaceno').reduce((s, i) => s + Number(i.total_amount), 0).toLocaleString('cs-CZ')} Kč`, icon: <DollarSign className="w-6 h-6 text-emerald-500 dark:text-emerald-400" /> },              
          { label: 'Nezaplaceno', value: invoices.filter(i=>i.status==='nezaplaceno').length, icon: <Clock className="w-6 h-6 text-amber-500 dark:text-amber-400" /> },
          { label: 'Po splatnosti', value: invoices.filter(i=>i.status==='po_splatnosti').length, icon: <AlertTriangle className="w-6 h-6 text-rose-500 dark:text-rose-400" /> },
          { label: 'Vystaveno celkem', value: invoices.length, icon: <FileText className="w-6 h-6 text-blue-500 dark:text-blue-400" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900/40 p-6 rounded-3xl border border-zinc-200 dark:border-slate-800/50 flex items-center justify-between shadow-sm dark:shadow-none transition-colors">
            <div><div className="text-sm text-zinc-500 dark:text-slate-400 mb-1">{stat.label}</div><div className="text-3xl font-black text-zinc-900 dark:text-slate-100">{stat.value}</div></div>
            <div className="p-3 bg-zinc-50 dark:bg-slate-800/50 rounded-xl border border-zinc-100 dark:border-slate-700/50">{stat.icon}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-3 mb-8 bg-white dark:bg-slate-900/30 p-2 rounded-2xl border border-zinc-200 dark:border-slate-800/50 w-full items-center shadow-sm dark:shadow-none transition-colors">
        <span className="px-3 py-2 text-sm font-bold text-zinc-500 hidden sm:block whitespace-nowrap">Filtrovat:</span>
        {[
          { id: 'vse', label: 'Vše', count: invoices.length },
          { id: 'nezaplaceno', label: 'Nezaplaceno', count: invoices.filter(i=>i.status==='nezaplaceno').length },
          { id: 'zaplaceno', label: 'Zaplaceno', count: invoices.filter(i=>i.status==='zaplaceno').length },
          { id: 'po_splatnosti', label: 'Po splatnosti', count: invoices.filter(i=>i.status==='po_splatnosti').length },
          { id: 'storno', label: 'Storno', count: invoices.filter(i=>i.status==='storno').length }
        ].map((f) => (
          <button key={f.id} onClick={() => setInvoiceFilter(f.id)} className={`flex-grow md:flex-none flex justify-center items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-colors whitespace-nowrap ${invoiceFilter === f.id ? 'bg-amber-600 text-white shadow-sm' : 'text-zinc-500 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-slate-200 hover:bg-zinc-100 dark:hover:bg-slate-800'}`}>
            {f.label} <span className={`text-[10px] px-2 py-0.5 rounded-full ${invoiceFilter === f.id ? 'bg-white/20' : 'bg-zinc-200 dark:bg-slate-800 text-zinc-600 dark:text-slate-300'}`}>{f.count}</span>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900/40 rounded-3xl border border-zinc-200 dark:border-slate-800 overflow-x-auto shadow-sm dark:shadow-none transition-colors">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-zinc-50 dark:bg-slate-900/60 border-b border-zinc-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-slate-500">
              <th className="px-6 py-4">Číslo / VS</th>
              <th className="px-6 py-4">Klient</th>
              <th className="px-6 py-4">Datum splatnosti</th>
              <th className="px-6 py-4">Částka</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Akce</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-slate-800/50">
            {filteredInvoices.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-zinc-400 dark:text-slate-500 italic">Zadanému filtru neodpovídají žádné faktury.</td></tr>
            ) : (
              filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-zinc-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4 font-bold text-zinc-900 dark:text-slate-200">
                    <div className="text-sm flex items-center gap-2">
                      {inv.invoice_number}
                      {inv.type === 'proforma' && <span className="text-[9px] bg-zinc-100 dark:bg-slate-800 text-zinc-500 dark:text-slate-400 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-slate-700">ZÁLOHA</span>}
                    </div>
                    <div className="text-[10px] text-zinc-500 dark:text-slate-500 font-medium">VS: {inv.variable_symbol}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-zinc-700 dark:text-slate-300">{inv.billing_clients?.name || 'Neznámý klient'}</td>
                  <td className="px-6 py-4 text-sm text-zinc-500 dark:text-slate-400">{new Date(inv.due_date).toLocaleDateString('cs-CZ')}</td>
                  <td className="px-6 py-4 font-black text-zinc-900 dark:text-slate-100">{Number(inv.total_amount).toLocaleString('cs-CZ')} Kč</td>
                  <td className="px-6 py-4">
                    <select value={inv.status} onChange={(e) => updateInvoiceStatus(inv.id, e.target.value)} className={`text-[9px] font-black uppercase px-2.5 py-1.5 rounded-md border tracking-wider cursor-pointer outline-none transition-colors ${getInvoiceStatusStyle(inv.status)}`}>
                      <option value="nezaplaceno" className="bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400">Nezaplaceno</option>
                      <option value="zaplaceno" className="bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400">Zaplaceno</option>
                      <option value="po_splatnosti" className="bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400">Po splatnosti</option>
                      <option value="storno" className="bg-white dark:bg-slate-900 text-zinc-500 dark:text-slate-500">Storno</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                     <button onClick={() => handleInvoiceDelete(inv.id)} className="p-2 text-zinc-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-slate-800 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                     <Link href={`/upravit-fakturu/${inv.id}`} className="p-2 text-zinc-400 dark:text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-zinc-100 dark:hover:bg-slate-800 rounded-lg"><Edit3 className="w-4 h-4" /></Link>
                     <Link href={`/faktura/${inv.id}`} className="p-2 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-500/20 hover:text-amber-700 dark:hover:text-amber-400 rounded-lg"><Eye className="w-4 h-4" /></Link>
                   </div>
                 </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}