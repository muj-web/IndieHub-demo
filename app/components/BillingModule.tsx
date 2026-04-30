'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { DollarSign, Clock, AlertTriangle, FileText, UserSquare, TrendingUp, Plus, Trash2, Edit3, Eye } from 'lucide-react';

export default function BillingModule() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoiceFilter, setInvoiceFilter] = useState('vse');
  const [loading, setLoading] = useState(true);

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

  const filteredInvoices = invoices.filter(inv => invoiceFilter === 'vse' || inv.status === invoiceFilter);

  const getInvoiceStatusStyle = (status: string) => {
    switch(status) {
      case 'zaplaceno': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      case 'nezaplaceno': return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      case 'po_splatnosti': return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
      case 'storno': return 'bg-slate-800 text-slate-500 border border-slate-700';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Načítám...</div>;

  return (
    <div className="animate-in fade-in duration-300">
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-extrabold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Fakturační přehled</h1>
          <p className="text-slate-400 text-sm font-medium">Správa dokladů, záloh a klientů</p>
        </div>
        <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto">
          <div className="flex gap-3 w-full md:w-auto">
            <Link href="/klienti" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl font-bold transition-colors text-sm border border-slate-800"><UserSquare className="w-4 h-4" /> Adresář</Link>
            <Link href="/prehled" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors text-sm border border-slate-700"><TrendingUp className="w-4 h-4" /> Přehled</Link>
          </div>
          <Link href="/nova-faktura" className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold transition-colors text-sm whitespace-nowrap"><Plus className="w-4 h-4" /> Faktura</Link>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Obrat (30 dní)', value: `${invoices.filter(i => i.status === 'zaplaceno').reduce((s, i) => s + Number(i.total_amount), 0).toLocaleString('cs-CZ')} Kč`, icon: <DollarSign className="w-6 h-6 text-emerald-400" /> },              
          { label: 'Nezaplaceno', value: invoices.filter(i=>i.status==='nezaplaceno').length, icon: <Clock className="w-6 h-6 text-amber-400" /> },
          { label: 'Po splatnosti', value: invoices.filter(i=>i.status==='po_splatnosti').length, icon: <AlertTriangle className="w-6 h-6 text-rose-400" /> },
          { label: 'Vystaveno celkem', value: invoices.length, icon: <FileText className="w-6 h-6 text-blue-400" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50 flex items-center justify-between">
            <div><div className="text-sm text-slate-400 mb-1">{stat.label}</div><div className="text-3xl font-black text-slate-100">{stat.value}</div></div>
            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">{stat.icon}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-3 mb-8 bg-slate-900/30 p-2 rounded-2xl border border-slate-800/50 w-full items-center">
        <span className="px-3 py-2 text-sm font-bold text-slate-500 hidden sm:block whitespace-nowrap">Filtrovat:</span>
        {[
          { id: 'vse', label: 'Vše', count: invoices.length },
          { id: 'nezaplaceno', label: 'Nezaplaceno', count: invoices.filter(i=>i.status==='nezaplaceno').length },
          { id: 'zaplaceno', label: 'Zaplaceno', count: invoices.filter(i=>i.status==='zaplaceno').length },
          { id: 'po_splatnosti', label: 'Po splatnosti', count: invoices.filter(i=>i.status==='po_splatnosti').length },
          { id: 'storno', label: 'Storno', count: invoices.filter(i=>i.status==='storno').length }
        ].map((f) => (
          <button key={f.id} onClick={() => setInvoiceFilter(f.id)} className={`flex-grow md:flex-none flex justify-center items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-colors whitespace-nowrap ${invoiceFilter === f.id ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
            {f.label} <span className={`text-[10px] px-2 py-0.5 rounded-full ${invoiceFilter === f.id ? 'bg-white/20' : 'bg-slate-800'}`}>{f.count}</span>
          </button>
        ))}
      </div>

      <div className="bg-slate-900/40 rounded-3xl border border-slate-800 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-900/60 border-b border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <th className="px-6 py-4">Číslo / VS</th>
              <th className="px-6 py-4">Klient</th>
              <th className="px-6 py-4">Datum splatnosti</th>
              <th className="px-6 py-4">Částka</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Akce</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredInvoices.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-500 italic">Zadanému filtru neodpovídají žádné faktury.</td></tr>
            ) : (
              filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-200">
                    <div className="text-sm flex items-center gap-2">
                      {inv.invoice_number}
                      {inv.type === 'proforma' && <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">ZÁLOHA</span>}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">VS: {inv.variable_symbol}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-300">{inv.billing_clients?.name || 'Neznámý klient'}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{new Date(inv.due_date).toLocaleDateString('cs-CZ')}</td>
                  <td className="px-6 py-4 font-black text-slate-100">{Number(inv.total_amount).toLocaleString('cs-CZ')} Kč</td>
                  <td className="px-6 py-4">
                    <select value={inv.status} onChange={(e) => updateInvoiceStatus(inv.id, e.target.value)} className={`text-[9px] font-black uppercase px-2.5 py-1.5 rounded-md border tracking-wider cursor-pointer outline-none transition-colors ${getInvoiceStatusStyle(inv.status)}`}>
                      <option value="nezaplaceno" className="bg-slate-900 text-amber-400">Nezaplaceno</option>
                      <option value="zaplaceno" className="bg-slate-900 text-emerald-400">Zaplaceno</option>
                      <option value="po_splatnosti" className="bg-slate-900 text-rose-400">Po splatnosti</option>
                      <option value="storno" className="bg-slate-900 text-slate-500">Storno</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                     <button onClick={() => handleInvoiceDelete(inv.id)} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                     <Link href={`/upravit-fakturu/${inv.id}`} className="p-2 text-slate-500 hover:text-amber-400 hover:bg-slate-800 rounded-lg"><Edit3 className="w-4 h-4" /></Link>
                     <Link href={`/faktura/${inv.id}`} className="p-2 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 hover:text-amber-400 rounded-lg"><Eye className="w-4 h-4" /></Link>
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