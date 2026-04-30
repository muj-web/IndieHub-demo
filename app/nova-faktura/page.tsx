'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Odebrána nepoužitá ikona UserPlus
import { ArrowLeft, Plus, Trash2, Save, Building, FileText, Receipt } from 'lucide-react';

export default function NovaFaktura() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  
  const [isNewClient, setIsNewClient] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [newClient, setNewClient] = useState({ name: '', ic: '', dic: '', street: '', city: '', zip: '' });
  
  const [invoice, setInvoice] = useState({
  invoice_number: '',
  variable_symbol: '',
  type: 'faktura',
  issue_date: new Date().toISOString().split('T')[0],
  due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  bank_account: process.env.NEXT_PUBLIC_BANK_ACCOUNT || '', // Změna zde
  iban: process.env.NEXT_PUBLIC_IBAN || ''                  // Změna zde
});

  const [items, setItems] = useState([{ id: Date.now(), description: '', quantity: 1, unit_price: 0 }]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const { data: clientsData } = await supabase.from('billing_clients').select('*').order('name');
      if (clientsData) setClients(clientsData);

      const year = new Date().getFullYear();
      const { data: lastInvoice } = await supabase
        .from('invoices')
        .select('invoice_number')
        .like('invoice_number', `${year}%`)
        .order('invoice_number', { ascending: false })
        .limit(1);

      let nextNum = 1;
      if (lastInvoice && lastInvoice.length > 0) {
        const lastSequence = parseInt(lastInvoice[0].invoice_number.slice(4));
        if (!isNaN(lastSequence)) nextNum = lastSequence + 1;
      }
      
      const formattedNum = `${year}${String(nextNum).padStart(3, '0')}`;
      setInvoice(prev => ({ ...prev, invoice_number: formattedNum, variable_symbol: formattedNum }));
    };

    fetchInitialData();
  }, []);

  const addItem = () => setItems([...items, { id: Date.now(), description: '', quantity: 1, unit_price: 0 }]);
  const removeItem = (id: number) => setItems(items.filter(item => item.id !== id));
  const updateItem = (id: number, field: string, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const totalAmount = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unit_price)), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalClientId = selectedClientId;

    if (isNewClient) {
      const { data: clientData, error: clientError } = await supabase
        .from('billing_clients')
        .insert([newClient])
        .select('id')
        .single();
        
      // Explicitní kontrola pro TypeScript, že clientData opravdu existuje
      if (clientError || !clientData) {
        alert('Chyba při ukládání klienta: ' + (clientError?.message || 'Neznámá chyba'));
        setLoading(false);
        return;
      }
      finalClientId = clientData.id;
    }

    if (!finalClientId) {
      alert('Prosím vyberte nebo vytvořte klienta.');
      setLoading(false);
      return;
    }

    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .insert([{
        ...invoice,
        client_id: finalClientId,
        total_amount: totalAmount
      }])
      .select('id')
      .single();

    // Explicitní kontrola pro TypeScript, že invoiceData opravdu existuje
    if (invoiceError || !invoiceData) {
      alert('Chyba při ukládání faktury: ' + (invoiceError?.message || 'Neznámá chyba'));
      setLoading(false);
      return;
    }

    const itemsToInsert = items.map(item => ({
      invoice_id: invoiceData.id,
      description: item.description,
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price)
    }));

    const { error: itemsError } = await supabase.from('invoice_items').insert(itemsToInsert);

    if (itemsError) {
      alert('Chyba při ukládání položek: ' + itemsError.message);
    } else {
      router.push(`/faktura/${invoiceData.id}`);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 p-8 font-sans text-slate-200 selection:bg-amber-500/30">
      <div className="max-w-4xl mx-auto bg-slate-900/50 p-8 rounded-3xl shadow-sm border border-slate-800">
        <Link href="/" className="inline-flex items-center text-xs font-bold uppercase text-slate-500 hover:text-amber-400 mb-8 tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Zpět na přehled
        </Link>
        
        <header className="flex items-center gap-4 mb-8 border-b border-slate-800/50 pb-6">
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <Receipt className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-100">Vystavit novou fakturu</h1>
            <p className="text-sm text-slate-400 font-medium mt-1">Číslo dokladu se vygeneruje automaticky.</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1 block mb-2">Typ dokladu</label>
              <select 
                value={invoice.type}
                onChange={(e) => setInvoice({...invoice, type: e.target.value})}
                className="w-full p-3.5 bg-slate-900 border border-slate-800 rounded-xl focus:ring-1 focus:ring-amber-500 outline-none font-bold text-slate-200"
              >
                <option value="faktura">Běžná faktura</option>
                <option value="proforma">Zálohová faktura (Proforma)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1 block mb-2">Číslo dokladu / VS</label>
              <input 
                type="text" 
                value={invoice.invoice_number}
                onChange={(e) => setInvoice({...invoice, invoice_number: e.target.value, variable_symbol: e.target.value})}
                className="w-full p-3.5 bg-slate-900/50 border border-slate-800 rounded-xl outline-none font-bold text-amber-400"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1 block mb-2">Datum vystavení</label>
              <input 
                type="date" 
                value={invoice.issue_date}
                onChange={(e) => setInvoice({...invoice, issue_date: e.target.value})}
                className="w-full p-3.5 bg-slate-900 border border-slate-800 rounded-xl focus:ring-1 focus:ring-amber-500 outline-none text-slate-200 [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1 block mb-2">Datum splatnosti</label>
              <input 
                type="date" 
                value={invoice.due_date}
                onChange={(e) => setInvoice({...invoice, due_date: e.target.value})}
                className="w-full p-3.5 bg-slate-900 border border-slate-800 rounded-xl focus:ring-1 focus:ring-amber-500 outline-none font-bold text-emerald-400 [color-scheme:dark]"
              />
            </div>
          </section>

          <section className="border-t border-slate-800/50 pt-8">
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-lg font-bold text-slate-100 flex items-center">
                <Building className="w-5 h-5 mr-3 text-amber-500" /> Odběratel (Klient)
              </h3>
              <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                <button type="button" onClick={() => setIsNewClient(false)} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${!isNewClient ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}>Vybrat existujícího</button>
                <button type="button" onClick={() => setIsNewClient(true)} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${isNewClient ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}>+ Vytvořit nového</button>
              </div>
            </div>

            {!isNewClient ? (
              <select 
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full p-3.5 bg-slate-900 border border-slate-800 rounded-xl focus:ring-1 focus:ring-amber-500 outline-none font-bold text-slate-200"
              >
                <option value="">-- Vyberte klienta ze seznamu --</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name} {c.ic ? `(IČ: ${c.ic})` : ''}</option>
                ))}
              </select>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-slate-900/40 rounded-2xl border border-amber-500/20">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 block mb-1">Jméno / Název firmy *</label>
                  <input type="text" required value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 outline-none focus:border-amber-500/50" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 block mb-1">IČO</label>
                  <input type="text" value={newClient.ic} onChange={e => setNewClient({...newClient, ic: e.target.value})} className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 outline-none focus:border-amber-500/50" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 block mb-1">DIČ</label>
                  <input type="text" value={newClient.dic} onChange={e => setNewClient({...newClient, dic: e.target.value})} className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 outline-none focus:border-amber-500/50" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 block mb-1">Ulice a číslo</label>
                  <input type="text" value={newClient.street} onChange={e => setNewClient({...newClient, street: e.target.value})} className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 outline-none focus:border-amber-500/50" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 block mb-1">Město</label>
                  <input type="text" value={newClient.city} onChange={e => setNewClient({...newClient, city: e.target.value})} className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 outline-none focus:border-amber-500/50" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 block mb-1">PSČ</label>
                  <input type="text" value={newClient.zip} onChange={e => setNewClient({...newClient, zip: e.target.value})} className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 outline-none focus:border-amber-500/50" />
                </div>
              </div>
            )}
          </section>

          <section className="border-t border-slate-800/50 pt-8">
            <h3 className="text-lg font-bold text-slate-100 flex items-center mb-6">
              <FileText className="w-5 h-5 mr-3 text-amber-500" /> Položky faktury
            </h3>
            
            <div className="space-y-3 mb-4">
              {items.map((item, index) => (
                <div key={item.id} className="flex gap-3 items-start">
                  <div className="flex-grow">
                    {index === 0 && <label className="text-[10px] font-black uppercase text-slate-500 ml-1 block mb-1">Popis položky</label>}
                    <input type="text" required placeholder="Např. Tvorba webových stránek" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 focus:ring-1 focus:ring-amber-500 outline-none" />
                  </div>
                  <div className="w-24">
                    {index === 0 && <label className="text-[10px] font-black uppercase text-slate-500 ml-1 block mb-1">Množství</label>}
                    <input type="number" required min="1" step="0.5" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', e.target.value)} className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-slate-200 focus:ring-1 focus:ring-amber-500 outline-none text-center" />
                  </div>
                  <div className="w-32">
                    {index === 0 && <label className="text-[10px] font-black uppercase text-slate-500 ml-1 block mb-1">Cena za ks (Kč)</label>}
                    <input type="number" required value={item.unit_price} onChange={(e) => updateItem(item.id, 'unit_price', e.target.value)} className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-slate-200 focus:ring-1 focus:ring-amber-500 outline-none text-right" />
                  </div>
                  <div className="w-10 pt-[22px]">
                    {items.length > 1 && (
                      <button type="button" onClick={() => removeItem(item.id)} className="p-3 text-slate-600 hover:text-rose-400 transition-colors rounded-xl hover:bg-slate-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <button type="button" onClick={addItem} className="text-sm font-bold text-amber-500 hover:text-amber-400 flex items-center transition-colors">
              <Plus className="w-4 h-4 mr-1" /> Přidat další řádek
            </button>
          </section>

          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 flex justify-between items-center mt-8">
            <span className="text-slate-400 uppercase font-black tracking-widest text-sm">Celkem k úhradě</span>
            <span className="text-3xl font-black text-emerald-400">{totalAmount.toLocaleString()} Kč</span>
          </div>

          <button 
            type="submit" 
            disabled={loading || items.length === 0}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white p-5 rounded-xl font-black uppercase tracking-widest hover:from-amber-500 hover:to-orange-500 transition-colors disabled:opacity-50 mt-8 shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center justify-center gap-3"
          >
            {loading ? 'Ukládám fakturu...' : <><Save className="w-5 h-5" /> Vystavit fakturu a zobrazit náhled</>}
          </button>

        </form>
      </div>
    </main>
  );
}