'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { ChevronLeft, Save, Loader2, Globe } from 'lucide-react';
import Link from 'next/navigation';
import dynamic from 'next/dynamic';

// Načteme editor dynamicky (jen u klienta), aby Next.js neházel chybu
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function NewArticle() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Svatební focení',
    excerpt: '',
    cover_image: '',
    is_published: true
  });

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('blog_posts')
      .insert([{
        ...formData,
        content_html: content,
        created_at: new Date().toISOString(),
      }]);

    if (error) {
      alert('Chyba: ' + error.message);
    } else {
      alert('Článek byl úspěšně uložen!');
      // Tady bys mohl přesměrovat zpět na seznam článků
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F4EF] p-8 md:p-16">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest hover:text-[#B09B84] transition-colors">
            <ChevronLeft size={16} /> Zpět
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="bg-[#1A1A1A] text-white px-8 py-3 rounded-xl text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-[#B09B84] transition-all flex items-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} 
            Uložit článek
          </button>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-black/5 p-10 space-y-8">
          {/* HLAVNÍ NASTAVENÍ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest opacity-30">Název článku</label>
              <input 
                type="text" 
                className="w-full border-b border-black/10 py-2 outline-none focus:border-[#B09B84] font-serif text-2xl"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest opacity-30">URL Adresa (slug)</label>
              <input 
                type="text" 
                placeholder="napr: svatba-u-jezera"
                className="w-full border-b border-black/10 py-2 outline-none focus:border-[#B09B84] font-mono text-sm"
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest opacity-30">Kategorie</label>
              <select 
                className="w-full border-b border-black/10 py-2 outline-none focus:border-[#B09B84] bg-transparent"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option>Svatební focení</option>
                <option>Osobní</option>
                <option>Vzpomínky</option>
                <option>Fotogalerie</option>
                <option>Svatební inspirace</option>
                <option>Svatební místa</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest opacity-30">URL Náhledové fotky</label>
              <input 
                type="text" 
                className="w-full border-b border-black/10 py-2 outline-none focus:border-[#B09B84] text-sm"
                value={formData.cover_image}
                onChange={(e) => setFormData({...formData, cover_image: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest opacity-30">Krátký úryvek (excerpt)</label>
            <textarea 
              className="w-full border border-black/5 rounded-xl p-4 outline-none focus:border-[#B09B84] text-sm h-24 resize-none"
              value={formData.excerpt}
              onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
            />
          </div>

          {/* VIZUÁLNÍ EDITOR */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest opacity-30 block mb-2">Obsah článku</label>
            <div className="prose max-w-none">
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent}
                className="h-[400px] mb-12 rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}