'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
// @ts-ignore
import 'react-quill-new/dist/quill.snow.css';

// Dynamický import Quill editoru (řeší chybu `document is not defined` při SSR)
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function ArticlesModule() {
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
      // Vyčištění formuláře po uložení
      setFormData({ title: '', slug: '', category: 'Svatební focení', excerpt: '', cover_image: '', is_published: true });
      setContent('');
    }
    setLoading(false);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-extrabold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
            Napsat článek
          </h1>
          <p className="text-zinc-500 dark:text-slate-400 text-sm font-medium">Editor obsahu pro blog a deník.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Uložit a publikovat
        </button>
      </header>

      <div className="bg-white dark:bg-slate-900/40 rounded-3xl p-8 border border-zinc-200 dark:border-slate-800 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 dark:text-slate-400">Název článku</label>
            <input
              type="text"
              className="w-full bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-slate-200 outline-none focus:border-orange-500 transition-colors font-bold"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 dark:text-slate-400">URL Adresa (slug)</label>
            <input
              type="text"
              placeholder="napr: svatba-u-jezera"
              className="w-full bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-slate-200 outline-none focus:border-orange-500 transition-colors font-mono text-sm"
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 dark:text-slate-400">Kategorie</label>
            <select
              className="w-full bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-slate-200 outline-none focus:border-orange-500 transition-colors cursor-pointer"
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
            <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 dark:text-slate-400">URL Náhledové fotky</label>
            <input
              type="text"
              className="w-full bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-slate-200 outline-none focus:border-orange-500 transition-colors"
              value={formData.cover_image}
              onChange={(e) => setFormData({...formData, cover_image: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 dark:text-slate-400">Krátký úryvek (excerpt)</label>
          <textarea
            className="w-full bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-slate-200 outline-none focus:border-orange-500 transition-colors resize-y min-h-[100px]"
            value={formData.excerpt}
            onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 dark:text-slate-400 block mb-2">Obsah článku</label>
          <div className="bg-white dark:bg-slate-200 text-zinc-900 dark:text-slate-900 rounded-xl overflow-hidden border border-orange-500/50">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              className="min-h-[400px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}