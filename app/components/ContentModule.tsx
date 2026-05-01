'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Edit3, Image as ImageIcon, Calendar as CalendarIcon, LayoutGrid, ChevronLeft, ChevronRight, X, Save, Share2, Globe, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamický import Quillu (vypne SSR, protože potřebuje přístup k window/prohlížeči)
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

// Konfigurace tlačítek pro editor (odpovídá potřebám WordPressu)
const quillModules = {
  toolbar: [
    [{ 'header': [2, 3, 4, false] }], // H2, H3, H4, Normální text
    ['bold', 'italic', 'underline', 'blockquote'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'clean'] // Odkazy a vyčištění formátování
  ],
};

export default function ContentModule() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'kanban' | 'calendar'>('kanban');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [editingPost, setEditingPost] = useState<any | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase.from('content_posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('content_posts').update({ status: newStatus }).eq('id', id);
    if (!error) {
      setPosts(posts.map(p => p.id === id ? { ...p, status: newStatus } : p));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu smazat tento příspěvek?')) return;
    const { error } = await supabase.from('content_posts').delete().eq('id', id);
    if (!error) {
      setPosts(posts.filter(p => p.id !== id));
      if (editingPost?.id === id) setEditingPost(null);
    }
  };

  const addQuickIdea = (type: 'social' | 'web') => {
    setEditingPost({
      title: '',
      content: '',
      media_link: [],
      status: 'napad',
      publish_date: '',
      post_type: type
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    
    try {
      const uploadPromises = fileArray.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;
        const { error: uploadError } = await supabase.storage.from('content-media').upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('content-media').getPublicUrl(filePath);
        return data.publicUrl;
      });

      const newUrls = await Promise.all(uploadPromises);
      const currentLinks = Array.isArray(editingPost.media_link) ? editingPost.media_link : (editingPost.media_link ? [editingPost.media_link] : []);
      
      setEditingPost({ ...editingPost, media_link: [...currentLinks, ...newUrls] });
    } catch (error: any) {
      alert("Chyba při nahrávání: " + error.message);
    }
  };

  const handleSavePost = async () => {
    if (!editingPost) return;
    const payload = { ...editingPost };
    if (!payload.publish_date) payload.publish_date = null;

    if (!payload.title || !payload.title.trim()) {
      alert("Vyplň alespoň název příspěvku.");
      return;
    }

    if (!payload.id) {
      const { data, error } = await supabase.from('content_posts').insert([{
        title: payload.title,
        content: payload.content,
        media_link: payload.media_link, 
        publish_date: payload.publish_date,
        status: payload.status,
        post_type: payload.post_type || 'social'
      }]).select();

      if (!error && data) {
        setPosts([data[0], ...posts]);
        setEditingPost(null);
      } else {
        alert('Chyba při vytváření: ' + (error?.message || 'Neznámá chyba'));
      }
    } else {
      const { error } = await supabase.from('content_posts').update({
        title: payload.title,
        content: payload.content,
        media_link: payload.media_link, 
        publish_date: payload.publish_date,
        status: payload.status,
        post_type: payload.post_type
      }).eq('id', payload.id);

      if (!error) {
        setPosts(posts.map(p => p.id === payload.id ? payload : p));
        setEditingPost(null);
      } else {
        alert('Chyba při ukládání: ' + error.message);
      }
    }
  };

  const handlePublishToMake = async () => {
    if (!editingPost) return;
    const WEBHOOK_URL = process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL || "https://hook.eu1.make.com/7ya71wgig0cz61284bly43tlgkelfr2d";

    const formattedMedia = Array.isArray(editingPost.media_link)
      ? editingPost.media_link.map((url: string) => ({ type: 'url', url: url }))
      : (editingPost.media_link ? [{ type: 'url', url: editingPost.media_link }] : []);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingPost.id,
          title: editingPost.title,
          content: editingPost.content,
          media_link: formattedMedia, 
          publish_date: editingPost.publish_date,
          post_type: editingPost.post_type
        })
      });

      if (response.ok) {
        alert("Odesláno přes Make.com! 🚀");
        handleStatusChange(editingPost.id, 'vydano');
        setEditingPost(null);
      } else {
        alert("Chyba při odesílání do Make.com.");
      }
    } catch (error) {
      alert("Nepodařilo se spojit s Make.com");
    }
  };

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; 
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysCount = daysInMonth(year, month);
    const startOffset = firstDayOfMonth(year, month);
    const days = [];

    for (let i = 0; i < startOffset; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-[100px] border border-slate-800/30 opacity-20 bg-slate-900/10"></div>);
    }

    for (let d = 1; d <= daysCount; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const postsThisDay = posts.filter(p => p.publish_date && p.publish_date.startsWith(dateStr));
      const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();

      days.push(
        <div key={d} className={`min-h-[120px] border border-slate-800 p-2 transition-colors hover:bg-slate-900/30 ${isToday ? 'bg-emerald-500/5 border-emerald-500/30' : ''}`}>
          <div className={`text-xs font-bold mb-2 flex justify-between items-center ${isToday ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span>{d}.</span>
          </div>
          <div className="space-y-1">
            {postsThisDay.map(post => {
              const isWeb = post.post_type === 'web';
              const btnClass = isWeb 
                ? "bg-sky-500/20 border-sky-500/30 text-sky-300 hover:bg-sky-500/40" 
                : "bg-fuchsia-500/20 border-fuchsia-500/30 text-fuchsia-300 hover:bg-fuchsia-500/40";
              
              return (
                <button key={post.id} onClick={() => setEditingPost(post)} className={`w-full text-left text-[9px] p-1.5 rounded border truncate font-bold uppercase transition-colors ${btnClass}`}>
                  {post.title}
                </button>
              )
            })}
          </div>
        </div>
      );
    }
    return days;
  };

  const columns = [
    { id: 'napad', title: '💡 Nápady', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { id: 'rozpracovano', title: '✍️ Rozpracováno', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { id: 'pripraveno', title: '⏳ Připraveno', color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { id: 'vydano', title: '✅ Vydáno', color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
  ];

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-slate-500 font-bold text-xs uppercase tracking-widest">Načítám...</div>;

  return (
    <div className="animate-in fade-in duration-300 relative">
      
      <header className="mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
        <div>
          <h1 className="text-4xl font-extrabold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Obsah & Sítě</h1>
          <div className="flex items-center gap-4 mt-4 bg-slate-900 p-1 rounded-xl border border-slate-800 w-fit">
            <button onClick={() => setView('kanban')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'kanban' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500'}`}><LayoutGrid className="w-4 h-4" /> Kanban</button>
            <button onClick={() => setView('calendar')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'calendar' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500'}`}><CalendarIcon className="w-4 h-4" /> Kalendář</button>
          </div>
        </div>
        
        <div className="flex gap-3 w-full xl:w-auto">
          <button onClick={() => addQuickIdea('social')} className="flex-1 xl:flex-none justify-center bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center transition-all shadow-lg shadow-pink-500/20">
            <Sparkles className="w-4 h-4 mr-2" /> Příspěvek na sítě
          </button>
          <button onClick={() => addQuickIdea('web')} className="flex-1 xl:flex-none justify-center bg-[#21759b] hover:bg-[#1a5d7c] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center transition-colors shadow-lg shadow-sky-900/50">
            <Globe className="w-4 h-4 mr-2" /> Článek na web
          </button>
        </div>
      </header>

      {view === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
          {columns.map(col => (
            <div key={col.id} className="bg-slate-900/40 rounded-3xl border border-slate-800 p-5 min-h-[500px] flex flex-col">
              <div className={`text-[10px] font-black uppercase tracking-widest mb-4 p-2 rounded-lg ${col.bg} ${col.color} text-center border border-current/10`}>{col.title}</div>
              <div className="space-y-4 flex-grow">
                {posts.filter(p => p.status === col.id).map(post => {
                  const isWeb = post.post_type === 'web';
                  const borderHover = isWeb ? 'hover:border-sky-500/50' : 'hover:border-fuchsia-500/50';
                  const badgeClass = isWeb ? 'bg-sky-900/30 text-sky-400 border-sky-800' : 'bg-fuchsia-900/30 text-fuchsia-400 border-fuchsia-800';
                  const badgeText = isWeb ? 'WORDPRESS' : 'SÍTĚ';

                  return (
                    <div key={post.id} className={`bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50 group transition-all shadow-sm ${borderHover}`}>
                      <div className={`text-[8px] font-black tracking-wider px-2 py-0.5 rounded-md border inline-block mb-2 ${badgeClass}`}>
                        {badgeText}
                      </div>
                      <div className="font-bold text-slate-200 mb-3 leading-tight">{post.title}</div>
                      
                      <div className="pt-3 border-t border-slate-800/50 flex justify-between items-center">
                        <select value={post.status} onChange={(e) => handleStatusChange(post.id, e.target.value)} className="bg-transparent text-[10px] font-bold uppercase text-slate-400 outline-none cursor-pointer hover:text-white transition-colors">
                          {columns.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.title}</option>)}
                        </select>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setEditingPost(post)} className="p-1.5 text-slate-500 hover:text-purple-400 hover:bg-slate-800 rounded-md transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(post.id)} className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'calendar' && (
        <div className="bg-slate-900/40 rounded-3xl border border-slate-800 overflow-hidden"><div className="grid grid-cols-7">{renderCalendar()}</div></div>
      )}

      {editingPost && (
        <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          
          <div className={`bg-slate-900 border-t-4 rounded-3xl w-full max-h-[90vh] flex flex-col shadow-2xl transition-all duration-300 ${editingPost.post_type === 'web' ? 'max-w-5xl border-t-[#21759b]' : 'max-w-2xl border-t-fuchsia-500'}`}>
            
            {/* ZDE BYL SMAZANÝ OBALOVACÍ DIV - OPRAVENO */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                {editingPost.post_type === 'web' ? <Globe className="text-[#21759b] w-6 h-6" /> : <Sparkles className="text-fuchsia-500 w-6 h-6" />}
                <h3 className="text-xl font-black text-white">
                  {editingPost.id ? 'Upravit ' : 'Nový '} 
                  {editingPost.post_type === 'web' ? 'článek' : 'příspěvek'}
                </h3>
              </div>
              <button onClick={() => setEditingPost(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-grow custom-scrollbar">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Název / Téma *</label>
                <input type="text" value={editingPost.title} onChange={(e) => setEditingPost({...editingPost, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-purple-500 transition-all font-bold" placeholder="O čem to bude?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center"><CalendarIcon className="w-3.5 h-3.5 mr-1.5" /> Plánovaný čas</label>
                  <input type="datetime-local" value={editingPost.publish_date ? editingPost.publish_date.slice(0, 16) : ''} onChange={(e) => setEditingPost({...editingPost, publish_date: e.target.value || null})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-purple-500 transition-all shadow-inner [color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Stav</label>
                  <select value={editingPost.status} onChange={(e) => setEditingPost({...editingPost, status: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-purple-500 transition-all appearance-none">
                    {columns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
              </div>

              {editingPost.post_type === 'social' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center"><ImageIcon className="w-3.5 h-3.5 mr-1.5" /> Galerie příspěvku</label>
                  <div className="flex gap-2">
                    <div className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-500 text-sm italic">
                      {Array.isArray(editingPost.media_link) ? `${editingPost.media_link.length} fotek` : (editingPost.media_link ? "1 fotka" : "Žádné soubory")}
                    </div>
                    <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl transition-colors shadow-lg shadow-blue-500/20">
                      <Plus className="w-5 h-5" />
                      <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" multiple />
                    </label>
                  </div>

                  {Array.isArray(editingPost.media_link) && editingPost.media_link.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {editingPost.media_link.map((url: string, index: number) => (
                        <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-800 aspect-square">
                          <img src={url} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            onClick={() => {
                              const newLinks = editingPost.media_link.filter((_: any, i: number) => i !== index);
                              setEditingPost({...editingPost, media_link: newLinks});
                            }}
                            className="absolute top-1 right-1 bg-rose-600 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Text s Quill Editorem pro web */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  {editingPost.post_type === 'web' ? 'Text článku' : 'Text příspěvku (Copy)'}
                </label>
                
                {editingPost.post_type === 'web' ? (
                  <div className="bg-slate-200 text-slate-900 rounded-xl overflow-hidden border border-[#21759b]">
                    <ReactQuill 
                      theme="snow" 
                      value={editingPost.content || ''} 
                      onChange={(content) => setEditingPost({...editingPost, content: content})} 
                      modules={quillModules}
                      className="min-h-[300px]"
                    />
                  </div>
                ) : (
                  <textarea 
                    value={editingPost.content || ''} 
                    onChange={(e) => setEditingPost({...editingPost, content: e.target.value})} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-slate-200 focus:outline-none transition-all resize-y placeholder:text-slate-700 min-h-[150px] focus:border-fuchsia-500" 
                    placeholder="Sem napiš své copy pro sítě..." 
                  />
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-between items-center rounded-b-3xl">
              <div>
                {editingPost.id && (
                  <button onClick={handlePublishToMake} className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors border border-slate-700 flex items-center">
                    <Share2 className="w-4 h-4 mr-2" /> 
                    {editingPost.post_type === 'web' ? 'Odeslat na WP (Make)' : 'Vydat na sítě (Make)'}
                  </button>
                )}
              </div>
              <div className="flex gap-4">
                <button onClick={() => setEditingPost(null)} className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-400 hover:text-white transition-colors">Zrušit</button>
                <button onClick={handleSavePost} className={`text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center transition-colors shadow-lg ${editingPost.post_type === 'web' ? 'bg-[#21759b] hover:bg-[#1a5d7c] shadow-sky-900/50' : 'bg-fuchsia-600 hover:bg-fuchsia-500 shadow-fuchsia-500/20'}`}>
                  <Save className="w-4 h-4 mr-2" /> Uložit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}