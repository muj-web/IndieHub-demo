'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NovaZakazka() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Stavy pro pole formuláře
  const [formData, setFormData] = useState({
    client_names: '',
    wedding_date: '',
    location_name: '',
    price_czk: '',
    status: 'ceka',
    gallery_status: 'pripravuje_se',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('weddings')
      .insert([
        { 
          ...formData, 
          price_czk: Number(formData.price_czk) // Převod textu na číslo
        }
      ]);

    if (error) {
      alert('Chyba při ukládání: ' + error.message);
      setLoading(false);
    } else {
      // Po úspěchu se vrátíme na dashboard
      router.push('/');
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 mb-6 block">← Zpět na přehled</Link>
        
        <h1 className="text-2xl font-bold mb-8">Nová svatební zakázka</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jména novomanželů</label>
            <input 
              required
              type="text" 
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Např. Jana & Michal"
              onChange={(e) => setFormData({...formData, client_names: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Datum svatby</label>
              <input 
                required
                type="date" 
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setFormData({...formData, wedding_date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cena (Kč)</label>
              <input 
                type="number" 
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="25000"
                onChange={(e) => setFormData({...formData, price_czk: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lokalita</label>
            <input 
              type="text" 
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Např. Zámek Blatná"
              onChange={(e) => setFormData({...formData, location_name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Poznámky</label>
            <textarea 
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Ukládám...' : 'Vytvořit zakázku'}
          </button>
        </form>
      </div>
    </main>
  );
}