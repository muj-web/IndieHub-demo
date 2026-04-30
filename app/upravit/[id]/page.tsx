'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditaceZakazky() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    client_names: '',
    wedding_date: '',
    location_name: '',
    price_czk: '',
    status: '',
    notes: ''
  });

  // Načtení dat stávající zakázky
  useEffect(() => {
    const fetchWedding = async () => {
      const { data, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('id', params.id)
        .single();

      if (data) {
        setFormData({
          client_names: data.client_names,
          wedding_date: data.wedding_date,
          location_name: data.location_name || '',
          price_czk: data.price_czk.toString(),
          status: data.status,
          notes: data.notes || ''
        });
      }
      setLoading(false);
    };

    fetchWedding();
  }, [params.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('weddings')
      .update({
        ...formData,
        price_czk: Number(formData.price_czk)
      })
      .eq('id', params.id);

    if (error) {
      alert('Chyba: ' + error.message);
      setSaving(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  if (loading) return <div className="p-10 text-center font-sans">Načítám data zakázky...</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <Link href="/" className="text-xs font-bold uppercase text-gray-400 hover:text-gray-900 mb-6 block">← Zpět</Link>
        <h1 className="text-2xl font-black mb-8">Upravit zakázku</h1>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Klienti</label>
            <input 
              required
              type="text" 
              value={formData.client_names}
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-bold"
              onChange={(e) => setFormData({...formData, client_names: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Datum</label>
              <input 
                required
                type="date" 
                value={formData.wedding_date}
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-bold"
                onChange={(e) => setFormData({...formData, wedding_date: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Cena (Kč)</label>
              <input 
                type="number" 
                value={formData.price_czk}
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-bold"
                onChange={(e) => setFormData({...formData, price_czk: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Lokalita</label>
            <input 
              type="text" 
              value={formData.location_name}
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-bold"
              onChange={(e) => setFormData({...formData, location_name: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full bg-gray-900 text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-purple-600 transition disabled:bg-gray-200 mt-4"
          >
            {saving ? 'Ukládám změny...' : 'Uložit zakázku'}
          </button>
        </form>
      </div>
    </main>
  );
}