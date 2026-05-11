'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Save, FileText, Edit3 } from 'lucide-react';

export default function UpravitFakturu() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  
  const [invoice, setInvoice] = useState({
    invoice_number: '',
    variable_symbol: '',
    type: 'faktura',
    issue_date: '',
    due_date: '',
    bank_account: '',
    iban: '',
    status: 'nezaplaceno' 
  });

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      const { data: clientsData } = await supabase.from('billing_clients').select('*').order('name');
      if (clientsData) setClients(clientsData);

      const { data: invData } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', params.id)
        .single();

      if (invData) {
        setInvoice({
          invoice_number: invData.invoice_number,
          variable_symbol: invData.variable_symbol,
          type: invData.type,
          issue_date: invData.issue_date,
          due_date: invData.due_date,
          bank_account: invData.bank_account || '',
          iban: invData.iban || '',
          status: invData.status
        });
        setSelectedClientId(invData.client_id);
      }

      const { data: itemsData } = await supabase
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', params.id);

      if (itemsData && itemsData.length > 0) {
        setItems(itemsData);
      } else {
        setItems([{ id: Date.now().toString(), description: '', quantity: 1, unit_price: 0 }]);
      }
      
      setLoading(false);
    };

    fetchInvoiceData();
  }, [params.id]);

  const addItem = () => setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, unit_price: 0, isNew: true }]);
  const removeItem = (id: string | number) => setItems(items.filter(item => item.id !== id));
  const updateItem = (id: string | number, field: string, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const totalAmount = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unit_price)), 0);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (!selectedClientId) {
      alert('Prosím vyberte klienta.');
      setSaving(false);
      return;
    }

    const { error: invoiceError } = await supabase
      .from('invoices')
      .update({
        ...invoice,
        client_id: selectedClientId,
        total_amount: totalAmount
      })
      .eq('id', params.id);

    if (invoiceError) {
      alert('Chyba při aktualizaci faktury: ' + invoiceError.message);
      setSaving(false);
      return;
    }

    const { error: deleteError } = await supabase
      .from('invoice_items')
      .delete()
      .eq('invoice_id', params.id);

    if (!deleteError) {
      const itemsToInsert = items.map(item => ({
        invoice_id: params.id,
        description: item.description,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price)
      }));

      const { error: itemsError } = await supabase.from('invoice_items').insert(itemsToInsert);
      if (itemsError) alert('Chyba při ukládání položek: ' + itemsError.message);
    }

    router.push('/');
    router.refresh();
  };

  if (loading) return <div className="p-10 text-center text-zinc-500 dark:text-slate-400 bg-zinc-50 dark:bg-slate-950 min-h-screen transition-colors duration-500">Načítání faktury...</div>;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-slate-950 p-8 font-sans text-zinc-900 dark:text-slate-200 transition-colors duration-500 selection:bg-amber-500/30">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900/50 p-8 rounded-[2rem] shadow-sm dark:shadow-none border border-zinc-200 dark:border-slate-800 transition-colors duration-500">
        <Link href="/" className="inline-flex items-center text-xs font-bold uppercase text-zinc-500 dark:text-slate-500 hover:text-amber-500 dark:hover:text-amber-400 mb-8 tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Zpět na přehled
        </Link>
        
        <header className="flex items-center gap-4 mb-8 border-b border-zinc-100 dark:border-slate-800/50 pb-6">
          <div className="p-3 bg-amber-50 dark:bg-slate-800/50 rounded-xl border border-amber-100 dark:border-slate-700">
            <Edit3 className="w-6 h-6 text-amber-600 dark:text-amber-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-slate-100">Upravit fakturu</h1>
            <p className="text-sm text-zinc-500 dark:text-slate-400 font-medium mt-1">Číslo dokladu: {invoice.invoice_number}</p>
          </div>
        </header>

        <form onSubmit={handleUpdate} className="space-y-8">
          
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-slate-500 ml-1 block mb-2">Klient</label>
              <select 
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full p-3.5 bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-amber-500 outline-none font-bold text-zinc-900 dark:text-slate-200 transition-colors cursor-pointer"
              >
                <option value="">-- Vyberte klienta ze seznamu --</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name} {c.ic ? `(IČ: ${c.ic})` : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-slate-500 ml-1 block mb-2">Stav faktury</label>
              <select 
                value={invoice.status}
                onChange={(e) => setInvoice({...invoice, status: e.target.value})}
                className="w-full p-3.5 bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-amber-500 outline-none font-bold text-zinc-900 dark:text-slate-200 transition-colors cursor-pointer"
              >
                <option value="nezaplaceno">Nezaplaceno</option>
                <option value="zaplaceno">Zaplaceno</option>
                <option value="po_splatnosti">Po splatnosti</option>
                <option value="storno">Stornováno</option>
              </select>
            </div>
            
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-zinc-100 dark:border-slate-800/50">
               <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-slate-500 ml-1 block mb-2">Typ dokladu</label>
                  <select 
                    value={invoice.type}
                    onChange={(e) => setInvoice({...invoice, type: e.target.value})}
                    className="w-full p-3.5 bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-amber-500 outline-none font-bold text-zinc-900 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    <option value="faktura">Běžná faktura</option>
                    <option value="proforma">Zálohová faktura</option>
                  </select>
               </div>
               <div>
                 <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-slate-500 ml-1 block mb-2">Datum vystavení</label>
                 <input 
                   type="date" 
                   value={invoice.issue_date}
                   onChange={(e) => setInvoice({...invoice, issue_date: e.target.value})}
                   className="w-full p-3.5 bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-amber-500 outline-none text-zinc-900 dark:text-slate-200 transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                 />
               </div>
               <div>
                 <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-slate-500 ml-1 block mb-2">Datum splatnosti</label>
                 <input 
                   type="date" 
                   value={invoice.due_date}
                   onChange={(e) => setInvoice({...invoice, due_date: e.target.value})}
                   className="w-full p-3.5 bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-amber-500 outline-none font-bold text-emerald-600 dark:text-emerald-400 transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                 />
               </div>
            </div>
          </section>

          <section className="border-t border-zinc-100 dark:border-slate-800/50 pt-8">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-slate-100 flex items-center mb-6">
              <FileText className="w-5 h-5 mr-3 text-amber-500" /> Položky faktury
            </h3>
            
            <div className="space-y-3 mb-4">
              {items.map((item, index) => (
                <div key={item.id} className="flex gap-3 items-start">
                  <div className="flex-grow">
                    {index === 0 && <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-slate-500 ml-1 block mb-1">Popis položky</label>}
                    <input type="text" required placeholder="Popis..." value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} className="w-full p-3 bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-xl text-sm text-zinc-900 dark:text-slate-200 focus:ring-1 focus:ring-amber-500 outline-none transition-colors" />
                  </div>
                  <div className="w-24">
                    {index === 0 && <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-slate-500 ml-1 block mb-1">Množství</label>}
                    <input type="number" required min="1" step="0.5" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', e.target.value)} className="w-full p-3 bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-xl text-sm font-bold text-zinc-900 dark:text-slate-200 focus:ring-1 focus:ring-amber-500 outline-none text-center transition-colors" />
                  </div>
                  <div className="w-32">
                    {index === 0 && <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-slate-500 ml-1 block mb-1">Cena za ks</label>}
                    <input type="number" required value={item.unit_price} onChange={(e) => updateItem(item.id, 'unit_price', e.target.value)} className="w-full p-3 bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-xl text-sm font-bold text-zinc-900 dark:text-slate-200 focus:ring-1 focus:ring-amber-500 outline-none text-right transition-colors" />
                  </div>
                  <div className="w-10 pt-[22px]">
                    {items.length > 1 && (
                      <button type="button" onClick={() => removeItem(item.id)} className="p-3 text-zinc-400 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-slate-800 transition-colors rounded-xl">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <button type="button" onClick={addItem} className="text-sm font-bold text-amber-600 dark:text-amber-500 hover:text-amber-500 dark:hover:text-amber-400 flex items-center transition-colors px-1 py-2">
              <Plus className="w-4 h-4 mr-1" /> Přidat další řádek
            </button>
          </section>

          <div className="bg-zinc-50 dark:bg-slate-900/80 p-6 rounded-2xl border border-zinc-200 dark:border-slate-800 flex justify-between items-center mt-8 transition-colors">
            <span className="text-zinc-500 dark:text-slate-400 uppercase font-black tracking-widest text-sm">Nová celková cena</span>
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{totalAmount.toLocaleString()} Kč</span>
          </div>

          <button 
            type="submit" 
            disabled={saving || items.length === 0}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white p-5 rounded-xl font-black uppercase tracking-widest hover:from-amber-400 hover:to-orange-400 dark:hover:from-amber-500 dark:hover:to-orange-500 transition-colors disabled:opacity-50 mt-8 shadow-lg shadow-amber-500/20 dark:shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
          >
            {saving ? 'Ukládám změny...' : <><Save className="w-5 h-5" /> Uložit úpravy a přepsat fakturu</>}
          </button>

        </form>
      </div>
    </main>
  );
}