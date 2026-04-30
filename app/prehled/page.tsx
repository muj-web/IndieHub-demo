'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, BarChart3, Plus, Trash2, Calendar, CreditCard, X, Edit3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function FinancniPrehled() {
  const [loading, setLoading] = useState(true);
  
  // Stavy pro data
  const [invoices, setInvoices] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  
  // Stavy pro formulář (přidávání i editace)
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formExpense, setFormExpense] = useState({
    title: '',
    amount: '',
    category: 'Osobní a Domácnost',
    due_day: '15'
  });

  const fetchData = async () => {
    setLoading(true);
    const [invRes, expRes] = await Promise.all([
      supabase.from('invoices').select('*').eq('status', 'zaplaceno').order('issue_date', { ascending: true }),
      supabase.from('expenses').select('*').order('due_day', { ascending: true })
    ]);
    
    if (invRes.data) setInvoices(invRes.data);
    if (expRes.data) setExpenses(expRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- LOGIKA FORMULÁŘE (Uložit / Aktualizovat) ---
  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formExpense.title || !formExpense.amount) return alert('Vyplňte název a částku');

    const payload = {
      title: formExpense.title,
      amount: Number(formExpense.amount),
      category: formExpense.category,
      due_day: Number(formExpense.due_day)
    };

    let result;
    if (editingId) {
      // Editace stávajícího
      result = await supabase.from('expenses').update(payload).eq('id', editingId);
    } else {
      // Nový záznam
      result = await supabase.from('expenses').insert([payload]);
    }

    if (result.error) alert(result.error.message);
    else {
      resetForm();
      fetchData();
    }
  };

  const startEdit = (exp: any) => {
    setEditingId(exp.id);
    setFormExpense({
      title: exp.title,
      amount: exp.amount.toString(),
      category: exp.category,
      due_day: exp.due_day.toString()
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Vyjet nahoru k formuláři
  };

  const resetForm = () => {
    setEditingId(null);
    setFormExpense({ title: '', amount: '', category: 'Osobní a Domácnost', due_day: '15' });
    setShowForm(false);
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Opravdu smazat tento výdaj?')) return;
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) alert(error.message);
    else setExpenses(expenses.filter(e => e.id !== id));
  };

  // --- LOGIKA GRAFU ---
  const getChartData = () => {
    const months: Record<string, number> = {};
    const czechMonths = ['Led', 'Úno', 'Bře', 'Dub', 'Kvě', 'Čer', 'Čec', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro'];
    
    invoices.forEach(inv => {
      const date = new Date(inv.issue_date);
      const monthName = czechMonths[date.getMonth()];
      if (!months[monthName]) months[monthName] = 0;
      months[monthName] += Number(inv.total_amount);
    });

    return Object.keys(months).map(name => ({ name, Prijmy: months[name] }));
  };

  const chartData = getChartData();
  const celkovyPrijem = invoices.reduce((s, i) => s + Number(i.total_amount), 0);
  const celkoveMescniVydaje = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const prumernyMesicniPrijem = chartData.length > 0 ? (celkovyPrijem / chartData.length) : 0;
  const ocekavanyCistyZisk = prumernyMesicniPrijem - celkoveMescniVydaje;

  if (loading) return <div className="min-h-screen bg-slate-950 p-10 text-center text-slate-500 font-sans">Načítání přehledů...</div>;

  return (
    <main className="min-h-screen bg-slate-950 p-4 md:p-8 font-sans text-slate-200">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex justify-between items-start mb-10">
          <div>
            <Link href="/" className="inline-flex items-center text-xs font-bold uppercase text-slate-500 hover:text-amber-400 mb-4 tracking-widest transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Zpět na nástěnku
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-slate-100 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-amber-500" /> Firemní finance
            </h1>
          </div>
        </div>

        {/* Hlavní karty */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
             <span className="text-sm font-bold text-slate-400 block mb-4">Průměrný měsíční příjem</span>
             <div className="text-4xl font-black text-slate-100 mb-1">{prumernyMesicniPrijem.toLocaleString('cs-CZ', {maximumFractionDigits: 0})} Kč</div>
             <div className="text-xs text-emerald-500 font-bold">Z historických faktur</div>
          </div>
          
          <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
             <span className="text-sm font-bold text-slate-400 block mb-4">Měsíční výdaje</span>
             <div className="text-4xl font-black text-slate-100 mb-1">{celkoveMescniVydaje.toLocaleString('cs-CZ')} Kč</div>
             <div className="text-xs text-rose-400 font-bold">Pravidelné náklady</div>
          </div>

          <div className={`p-6 rounded-3xl border ${ocekavanyCistyZisk >= 0 ? 'bg-gradient-to-br from-amber-600/20 to-orange-600/10 border-amber-500/20' : 'bg-gradient-to-br from-rose-600/20 to-red-600/10 border-rose-500/20'}`}>
             <span className={`text-sm font-bold block mb-4 ${ocekavanyCistyZisk >= 0 ? 'text-amber-500' : 'text-rose-400'}`}>Odhad čistého zisku</span>
             <div className={`text-4xl font-black mb-1 ${ocekavanyCistyZisk >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>{ocekavanyCistyZisk.toLocaleString('cs-CZ', {maximumFractionDigits: 0})} Kč</div>
             <div className="text-xs font-bold opacity-70">Příjem mínus fixní náklady</div>
          </div>
        </div>

        {/* GRAF */}
        <div className="bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-slate-800 mb-10">
            <h3 className="text-lg font-bold text-slate-100 mb-8 flex items-center gap-2"><Calendar className="w-5 h-5 text-slate-400" /> Vývoj příjmů</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip 
                    cursor={{fill: '#1e293b'}}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                    itemStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="Prijmy" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#f59e0b' : '#334155'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
        </div>

        {/* SPRÁVCE VÝDAJŮ */}
        <div className="bg-slate-900/40 rounded-3xl border border-slate-800 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/60">
            <div>
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-rose-400" /> Fixní náklady
              </h3>
            </div>
            <button 
              onClick={() => { if(showForm) resetForm(); else setShowForm(true); }}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-bold border border-slate-700 transition-colors text-sm"
            >
               {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
               {showForm ? 'Zavřít' : 'Přidat náklad'}
            </button>
          </div>

          {showForm && (
            <div className="p-6 bg-slate-800/30 border-b border-slate-800 animate-in fade-in slide-in-from-top-2">
              <form onSubmit={handleSaveExpense} className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Název</label>
                  <input type="text" value={formExpense.title} onChange={e => setFormExpense({...formExpense, title: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition" placeholder="Např. Adobe CC..." required />
                </div>
                <div className="w-full sm:w-32">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Částka (Kč)</label>
                  <input type="number" value={formExpense.amount} onChange={e => setFormExpense({...formExpense, amount: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition" placeholder="0" required />
                </div>
                <div className="w-full sm:w-48">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Kategorie</label>
                  <select value={formExpense.category} onChange={e => setFormExpense({...formExpense, category: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition">
                    <option>Osobní a Domácnost</option>
                    <option>Software a Nástroje</option>
                    <option>Provoz a Domény</option>
                    <option>Daně a Odvody</option>
                  </select>
                </div>
                <div className="w-full sm:w-24">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Splatnost</label>
                  <input type="number" min="1" max="31" value={formExpense.due_day} onChange={e => setFormExpense({...formExpense, due_day: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition" required />
                </div>
                <button type="submit" className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold transition-colors h-[50px] ${editingId ? 'bg-amber-600 hover:bg-amber-500' : 'bg-rose-600 hover:bg-rose-500'} text-white`}>
                  {editingId ? 'Aktualizovat' : 'Uložit náklad'}
                </button>
              </form>
            </div>
          )}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/30 border-b border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <th className="px-6 py-4">Název</th>
                <th className="px-6 py-4">Splatnost</th>
                <th className="px-6 py-4">Částka</th>
                <th className="px-6 py-4 text-right">Akce</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {expenses.map(exp => (
                <tr key={exp.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-200">{exp.title}</div>
                    <div className="text-[10px] font-medium text-slate-500 uppercase">{exp.category}</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-400">
                    {exp.due_day}. v měsíci
                  </td>
                  <td className="px-6 py-4 font-black text-rose-400">-{Number(exp.amount).toLocaleString('cs-CZ')} Kč</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => startEdit(exp)} className="p-2 text-slate-600 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteExpense(exp.id)} className="p-2 text-slate-600 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}