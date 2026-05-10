"use client";
import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";
import { 
  CheckCircle2, Plus, ArrowLeft, Loader2, 
  Layers, Trash2, Palette, EyeOff, Eye,
  ExternalLink, Type, Square, Layout, Rocket, 
  AlignLeft, Maximize, Sparkles, ChevronDown, FileText
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { THEME_PRESETS } from "@/lib/theme-presets";
import BuilderSectionCard from "@/app/components/builder/BuilderSectionCard";

const availableComponents = [
  // HLAVIČKY
  { id: "header-standard", name: "Hlavička (Standard)", scope: ['home', 'sub'] },
  { id: "header-neon", name: "Hlavička (Tech / Neon)", scope: ['home', 'sub'] },
  { id: "header-cinematic", name: "Hlavička (Cinematic Glass)", scope: ['home', 'sub'] },
  { id: "header-elegant", name: "Hlavička (Elegant Minimal)", scope: ['home', 'sub'] },
  { id: "header-industrial", name: "Hlavička (Industrial Topbar)", scope: ['home', 'sub'] },
  { id: "header-utilitarian", name: "Hlavička (Utilitarian Tech)", scope: ['home', 'sub'] },
  { id: "header-luxury", name: "Hlavička (Luxusní butik)", scope: ['home', 'sub'] },

  // HERO SEKCE
  { id: "hero-split", name: "Hero (Text vlevo, Fotka vpravo)", scope: ['home', 'sub'] },
  { id: "hero-subpage", name: "Hero (Čistá pro podstránky)", scope: ['sub'] },
  { id: "hero-cinematic", name: "Hero (Cinematic Impact)", scope: ['home'] },
  { id: "hero-neon", name: "Hero (Neon Tech Vibe)", scope: ['home'] },
  { id: "hero-interactive", name: "Hero (Interactive AI Chat)", scope: ['home'] },
  { id: "hero-circle", name: "Hero (Clean Circle Orbit)", scope: ['home'] },
  { id: "hero-industrial", name: "Hero (Industrial Radar)", scope: ['home'] },
  { id: "hero-utilitarian", name: "Hero (Utilitarian 60/40)", scope: ['home'] },
  { id: "hero-luxury", name: "Hero (Luxusní s parallaxem)", scope: ['home', 'sub'] },

  // OBSAH
  { id: "content-standard", name: "Obsah (Standard: Text a foto)", scope: ['home', 'sub'] },

  // SLUŽBY
  { id: "services-standard", name: "Služby (Standard Grid)", scope: ['home', 'sub'] },
  { id: "services-bento", name: "Služby (Moderní Bento Grid)", scope: ['home', 'sub'] },
  { id: "services-utilitarian", name: "Služby (Utilitarian Grid)", scope: ['home', 'sub'] },
  { id: "services-grid", name: "Služby (Vzdušný Grid)", scope: ['home', 'sub'] },
  { id: "services-interactive", name: "Služby (Interaktivní foto grid)", scope: ['home', 'sub'] },

  // REFERENCE A TESTIMONIALS
  { id: "testimonials-standard", name: "Reference (Standard karty)", scope: ['home', 'sub'] },
  { id: "testimonials-premium", name: "Reference (Prémiový tmavý slider)", scope: ['home', 'sub'] },
  { id: "testimonials-video", name: "Reference (Video Grid)", scope: ['home', 'sub'] },

  // PATIČKY
  { id: "footer-standard", name: "Patička (Standard)", scope: ['home', 'sub'] },
  { id: "footer-industrial", name: "Patička (Industrial Hexagon)", scope: ['home', 'sub'] },
  { id: "footer-neon", name: "Patička (Tech / Neon)", scope: ['home', 'sub'] },
  { id: "footer-cinematic", name: "Patička (Cinematic Impact)", scope: ['home', 'sub'] },
  { id: "footer-elegant", name: "Patička (Elegant Minimal)", scope: ['home', 'sub'] },
  { id: "footer-utilitarian", name: "Patička (Utilitarian Bento)", scope: ['home', 'sub'] },
  { id: "footer-luxury", name: "Patička (Luxusní butik)", scope: ['home', 'sub'] },
];

export default function ProjectBuilder({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Stavy pro Stránky a Menu
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<'primary' | 'secondary'>('primary');
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [creatingParentId, setCreatingParentId] = useState<string | null>(null);
  const [isAnchor, setIsAnchor] = useState(false);

  // Stavy pro Sekce a Vzhled
  const [newSection, setNewSection] = useState("hero-cinematic");
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);
  const [themeToApply, setThemeToApply] = useState<string | null>(null);

  useEffect(() => { fetchProject(); }, [id]);

  async function fetchProject() {
    const { data } = await supabase
      .from('projects')
      .select('*, tasks(*), project_pages(*), project_sections(*)')
      .eq('id', id)
      .single();
      
    if (data) {
      if (data.tasks) data.tasks.sort((a: any, b: any) => a.order_index - b.order_index);
      if (data.project_pages) data.project_pages.sort((a: any, b: any) => a.order_index - b.order_index);
      if (data.project_sections) data.project_sections.sort((a: any, b: any) => a.order_index - b.order_index);
      
      // Nastavíme aktivní stránku na Homepage, pokud žádná není vybraná
      if (!activePageId && data.project_pages && data.project_pages.length > 0) {
        const homePage = data.project_pages.find((p: any) => p.is_homepage) || data.project_pages[0];
        setActivePageId(homePage.id);
      }
    }
    setProject(data);
    setLoading(false);
  }

  // --- LOGIKA PRO PODSTRÁNKY ---
  async function createPage(e: React.FormEvent) {
    e.preventDefault();
    if (!newPageTitle.trim()) return;

    const slug = newPageTitle.toLowerCase().trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');

    const isFirstPage = !project.project_pages || project.project_pages.length === 0;

    const { data, error } = await supabase.from('project_pages').insert({
      project_id: id,
      title: newPageTitle,
      slug: (isFirstPage && !creatingParentId) ? '' : slug,
      is_homepage: (isFirstPage && !creatingParentId),
      order_index: project.project_pages?.length || 0,
      parent_id: creatingParentId,
      is_anchor: isAnchor,
      menu_type: activeMenu
    }).select().single();

    if (!error && data) {
      setNewPageTitle("");
      setIsCreatingPage(false);
      setCreatingParentId(null);
      setIsAnchor(false);
      setActivePageId(data.id);
      fetchProject();
    } else {
      alert("Chyba při vytváření stránky: " + (error?.message || "Neznámá chyba"));
    }
  }

  async function deleteActivePage() {
    const activePage = project?.project_pages?.find((p: any) => p.id === activePageId);
    if (!activePage) return;
    if (activePage.is_homepage) {
      alert("Domovskou stránku nelze smazat.");
      return;
    }
    if (!confirm(`Opravdu chcete smazat stránku "${activePage.title}" včetně všech jejích sekcí?`)) return;

    const { error } = await supabase.from('project_pages').delete().eq('id', activePageId);
    if (!error) {
      setActivePageId(null);
      fetchProject();
    } else {
      alert("Chyba při mazání stránky: " + error.message);
    }
  }

  // --- LOGIKA PRO SEKCE ---
  async function saveSectionContentFromCard(sectionId: string, updatedContent: any) {
    const { error } = await supabase.from('project_sections').update({ content_data: updatedContent }).eq('id', sectionId);
    if (!error) fetchProject();
  }

  async function changeComponentVariant(sectionId: string, newVariant: string) {
    await supabase.from('project_sections').update({ component_type: newVariant }).eq('id', sectionId);
    fetchProject();
  }

  async function confirmDeleteSection() {
    if (!sectionToDelete) return;
    await supabase.from('project_sections').delete().eq('id', sectionToDelete);
    fetchProject();
    setSectionToDelete(null);
  }

  async function moveSection(index: number, direction: 'up' | 'down') {
    const sections = activeSections;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;
    await supabase.from('project_sections').update({ order_index: newIndex }).eq('id', sections[index].id);
    await supabase.from('project_sections').update({ order_index: index }).eq('id', sections[newIndex].id);
    fetchProject();
  }

  async function updateDesignConfig(key: string, value: string) {
    const currentConfig = project.design_config || {};
    await supabase.from('projects').update({ design_config: { ...currentConfig, [key]: value } }).eq('id', id);
    fetchProject();
  }

  async function updatePalette(key: string, value: string) {
    const currentPalette = project.color_palette || {};
    await supabase.from('projects').update({ color_palette: { ...currentPalette, [key]: value } }).eq('id', id);
    fetchProject();
  }

  async function confirmApplyTheme() {
    if (!themeToApply) return;
    const theme = THEME_PRESETS[themeToApply];
    const { error } = await supabase.from('projects').update({ 
      color_palette: theme.color_palette, design_config: theme.design_config 
    }).eq('id', id);
    if (!error) fetchProject();
    setThemeToApply(null);
  }

  async function addSection(e: React.FormEvent) {
    e.preventDefault(); 
    if (!activePageId) return alert("Vyberte stránku.");
    await supabase.from('project_sections').insert({ 
      project_id: id, 
      page_id: activePageId, 
      component_type: newSection, 
      order_index: activeSections.length || 0 
    });
    fetchProject();
  }

  const accentColor = project?.accent_color || "#8E44ED";
  const activeSections = project?.project_sections?.filter((s: any) => s.page_id === activePageId) || [];
  const activePageObj = project?.project_pages?.find((p: any) => p.id === activePageId);
  const isHomePage = activePageObj?.is_homepage || false;
  const previewUrl = activePageObj && !isHomePage ? `/demo/${project?.slug}/${activePageObj.slug}` : `/demo/${project?.slug}`;

  if (loading) return <div className="min-h-screen bg-[var(--background)] flex items-center justify-center"><Loader2 className="w-12 h-12 text-purple-600 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-4 md:p-8 overflow-x-hidden font-sans transition-colors duration-500">
      <div className="max-w-[1600px] mx-auto w-full relative z-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-3 bg-white dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-xl hover:text-purple-600 transition-all shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-2">
                <span className="truncate max-w-[200px] sm:max-w-md">{project?.project_name}</span>
                <span className="text-zinc-400 dark:text-slate-500 font-light">/ Builder</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link href={previewUrl || '#'} target="_blank" className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-xl font-bold text-xs uppercase tracking-widest hover:text-purple-600 transition-all shadow-sm">
              Live náhled <ExternalLink className="w-4 h-4" />
            </Link>
            <button className="flex items-center gap-2 px-6 py-3 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg hover:scale-105" style={{ backgroundColor: accentColor }}>
              Publikovat <Rocket className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* --- HLAVNÍ GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEVÝ SLOUPEC: DESIGN */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900/50 border border-zinc-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-5 h-5" style={{ color: accentColor }} />
                <h2 className="text-lg font-bold uppercase tracking-tight">Design System</h2>
              </div>

              {/* VÝBĚR TÉMATU */}
              <div className="mb-6 p-4 border border-zinc-200 dark:border-slate-800 rounded-2xl bg-zinc-50 dark:bg-slate-950/50">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-slate-400 mb-2 flex items-center gap-2">
                   <Sparkles size={12} /> Zvolit Vibe
                </label>
                <select onChange={(e) => { setThemeToApply(e.target.value); e.target.value = ""; }} value="" className="w-full bg-white dark:bg-slate-900 border border-zinc-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-purple-600 transition-all cursor-pointer text-zinc-900 dark:text-white">
                  <option value="" disabled>-- Vyberte téma --</option>
                  {Object.entries(THEME_PRESETS).map(([key, theme]: any) => (
                    <option key={key} value={key}>{theme.name}</option>
                  ))}
                </select>
              </div>

              {/* BAREVNÁ PALETA */}
              <div className="space-y-6 mb-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-slate-500 border-b border-zinc-100 dark:border-slate-800 pb-2">Barevná paleta</p>
                <div className="grid grid-cols-2 gap-4">
                  {[{ key: 'bg', label: 'Pozadí' }, { key: 'text', label: 'Text' }, { key: 'accent', label: 'Akcent' }, { key: 'surface', label: 'Karty' }].map(c => (
                    <div key={c.key} className="space-y-2">
                      <label className="text-[9px] uppercase font-bold text-zinc-400 dark:text-slate-500">{c.label}</label>
                      <div className="flex gap-2">
                        <input type="color" value={project.color_palette?.[c.key]} onChange={(e) => updatePalette(c.key, e.target.value)} className="w-8 h-8 rounded cursor-pointer border border-zinc-200 dark:border-slate-700 p-0.5 bg-transparent" />
                        <input type="text" value={project.color_palette?.[c.key]} onChange={(e) => updatePalette(c.key, e.target.value)} className="w-full bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-lg px-2 text-[10px] font-mono focus:outline-none focus:border-purple-600 text-zinc-900 dark:text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* GLOBÁLNÍ STYLY */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-slate-500 border-b border-zinc-100 dark:border-slate-800 pb-2">Globální styl</p>
                
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-zinc-500 dark:text-slate-400 flex items-center gap-2"><Type size={14}/> Nadpisy</span>
                  <select value={project.design_config?.font_heading} onChange={(e) => updateDesignConfig('font_heading', e.target.value)} className="bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none text-zinc-900 dark:text-white">
                    <option value="Inter">Inter (Modern)</option>
                    <option value="Lexend">Lexend (Tech)</option>
                    <option value="Playfair Display">Playfair (Elegant)</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-zinc-500 dark:text-slate-400 flex items-center gap-2"><Square size={14}/> Zaoblení</span>
                  <select value={project.design_config?.radius} onChange={(e) => updateDesignConfig('radius', e.target.value)} className="bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none text-zinc-900 dark:text-white">
                    <option value="0px">Ostré</option>
                    <option value="0.75rem">Střední</option>
                    <option value="9999px">Kulaté</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* PRAVÝ SLOUPEC: MENU A BUILDER */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* --- SPRÁVA MENU A STRÁNEK --- */}
            <div className="mb-6">
              
              <div className="flex items-center gap-6 mb-4 border-b border-zinc-200 dark:border-slate-800 pb-2">
                <button
                  onClick={() => setActiveMenu('primary')}
                  className={`text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 transition-colors ${activeMenu === 'primary' ? 'border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400' : 'border-transparent text-zinc-400 dark:text-slate-500 hover:text-zinc-700 dark:hover:text-slate-300'}`}
                >
                  Primární Menu
                </button>
                <button
                  onClick={() => setActiveMenu('secondary')}
                  className={`text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 transition-colors ${activeMenu === 'secondary' ? 'border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400' : 'border-transparent text-zinc-400 dark:text-slate-500 hover:text-zinc-700 dark:hover:text-slate-300'}`}
                >
                  Sekundární Menu
                </button>
              </div>

              <div className="flex items-start gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {project?.project_pages?.filter((p: any) => p.menu_type === activeMenu && p.parent_id === null).map((page: any) => (
                  <div key={page.id} className="flex flex-col gap-2 shrink-0">
                    
                    <div className="flex items-center group relative">
                      <button
                        onClick={() => setActivePageId(page.id)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all whitespace-nowrap border ${
                          activePageId === page.id
                            ? 'bg-zinc-900 dark:bg-slate-800 text-white border-zinc-900 dark:border-slate-700 shadow-md'
                            : 'bg-white dark:bg-slate-900/50 text-zinc-500 dark:text-slate-400 border-zinc-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-500/50 hover:text-purple-600 dark:hover:text-purple-400 shadow-sm'
                        }`}
                      >
                        <FileText size={14} />
                        {page.title}
                        {page.is_homepage && <span className="ml-1 w-2 h-2 rounded-full bg-purple-500" />}
                      </button>

                      <button
                        onClick={() => { setIsCreatingPage(true); setCreatingParentId(page.id); setNewPageTitle(""); setIsAnchor(false); }}
                        className="absolute -right-3 -top-2 p-1.5 bg-zinc-100 dark:bg-slate-800 text-zinc-400 dark:text-slate-500 hover:text-white hover:bg-purple-600 dark:hover:bg-purple-500 rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-sm z-10"
                        title="Přidat podstránku / kotvu"
                      >
                        <Plus size={12} strokeWidth={3} />
                      </button>
                    </div>

                    {project?.project_pages?.filter((p: any) => p.parent_id === page.id).length > 0 && (
                      <div className="flex flex-col gap-1.5 pl-4 ml-4 border-l-2 border-zinc-100 dark:border-slate-800">
                        {project.project_pages.filter((p: any) => p.parent_id === page.id).map((sub: any) => (
                          <button
                            key={sub.id}
                            onClick={() => setActivePageId(sub.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
                              activePageId === sub.id
                                ? 'bg-zinc-100 dark:bg-slate-800 text-zinc-900 dark:text-white border-zinc-300 dark:border-slate-700'
                                : 'bg-transparent text-zinc-400 dark:text-slate-500 border-transparent hover:text-purple-600 dark:hover:text-purple-400'
                            }`}
                          >
                            <span className="text-zinc-300 dark:text-slate-600 font-mono text-xs">{sub.is_anchor ? '#' : '/'}</span> {sub.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {!isCreatingPage ? (
                  <button
                    onClick={() => { setIsCreatingPage(true); setCreatingParentId(null); setNewPageTitle(""); setIsAnchor(false); }}
                    className="flex items-center gap-2 px-5 py-3 bg-zinc-50 dark:bg-slate-900/30 border border-dashed border-zinc-300 dark:border-slate-700 text-zinc-400 dark:text-slate-500 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:border-purple-400 dark:hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all whitespace-nowrap mt-0 h-[46px]"
                  >
                    <Plus size={14} /> Nová {activeMenu === 'primary' ? 'stránka' : 'položka'}
                  </button>
                ) : (
                  <form onSubmit={createPage} className="flex flex-col gap-3 p-4 bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-500/50 rounded-2xl shadow-lg min-w-[220px] z-20">
                    <span className="text-[9px] font-bold uppercase text-purple-600 dark:text-purple-400 tracking-widest">
                      {creatingParentId ? "Nová podkategorie" : "Nová hlavní stránka"}
                    </span>
                    <input
                      autoFocus
                      type="text"
                      placeholder="Název (např. Ceník)"
                      value={newPageTitle}
                      onChange={(e) => setNewPageTitle(e.target.value)}
                      className="px-3 py-2.5 bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-300 dark:focus:border-purple-500 text-zinc-900 dark:text-white w-full"
                    />
                    {creatingParentId && (
                      <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 dark:text-slate-400 uppercase cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isAnchor}
                          onChange={(e) => setIsAnchor(e.target.checked)}
                          className="rounded border-zinc-300 dark:border-slate-700"
                        />
                        Tvořím kotvu (#) na stránce
                      </label>
                    )}
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors text-[10px] uppercase tracking-widest font-bold">
                        Uložit
                      </button>
                      <button type="button" onClick={() => { setIsCreatingPage(false); setCreatingParentId(null); }} className="px-3 py-2.5 bg-zinc-100 dark:bg-slate-800 text-zinc-500 dark:text-slate-400 rounded-xl hover:bg-zinc-200 dark:hover:bg-slate-700 transition-colors">
                        Zrušit
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* --- BUILDER KARTY --- */}
            <div className="bg-white dark:bg-slate-900/50 border border-zinc-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm min-h-[600px] transition-colors">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-500/10">
                     <Layout className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
                      Struktura stránky
                      {!isHomePage && activePageObj && (
                        <button onClick={deleteActivePage} className="text-rose-400 hover:text-rose-600 p-1.5 bg-rose-50 dark:bg-rose-500/10 rounded-lg transition-colors" title="Smazat tuto stránku">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </h2>
                    <p className="text-zinc-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
                      {activePageObj?.title || "Vyberte stránku z menu výše"}
                    </p>
                  </div>
                </div>

                <form onSubmit={addSection} className="flex gap-2 w-full xl:w-auto">
                  <select 
                    value={newSection} 
                    onChange={(e) => setNewSection(e.target.value)} 
                    className="w-full bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 text-zinc-900 dark:text-white"
                  >
                    {Array.from(new Set(availableComponents
                      .filter(c => c.scope.includes(isHomePage ? 'home' : 'sub'))
                      .map(c => c.id.split('-')[0])
                    )).map(category => (
                      <optgroup key={category} label={category.toUpperCase()} className="font-bold bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400">
                        {availableComponents
                          .filter(c => c.id.startsWith(category + '-') && c.scope.includes(isHomePage ? 'home' : 'sub'))
                          .map(c => (
                            <option key={c.id} value={c.id} className="font-normal text-zinc-900 dark:text-slate-200">{c.name}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <button type="submit" disabled={!activePageId} className="px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold text-xs uppercase whitespace-nowrap shadow-sm hover:opacity-90 disabled:opacity-50">
                    Přidat
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {activeSections.map((section: any, index: number) => (
                    <BuilderSectionCard
                      key={section.id}
                      section={section}
                      index={index}
                      availableComponents={availableComponents}
                      accentColor={accentColor}
                      onUpdateVariant={changeComponentVariant}
                      onSave={saveSectionContentFromCard}
                      onDelete={() => setSectionToDelete(section.id)}
                      onMove={moveSection}
                    />
                  ))}
                </AnimatePresence>
                
                {activeSections.length === 0 && (
                  <div className="py-20 border-2 border-dashed border-zinc-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-zinc-400 dark:text-slate-500 bg-zinc-50 dark:bg-slate-900/30">
                    <Layers className="w-12 h-12 mb-4 opacity-30" />
                    <p className="text-xs font-bold uppercase tracking-widest text-center px-4">Tato stránka je prázdná. Přidejte první sekci.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* MODAL PRO SMAZÁNÍ */}
      <AnimatePresence>
        {sectionToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSectionToDelete(null)} className="absolute inset-0 bg-zinc-900/40 dark:bg-slate-950/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-2xl text-center">
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6"><Trash2 size={32} /></div>
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2 text-zinc-900 dark:text-white">Odstranit sekci?</h3>
              <p className="text-zinc-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">Tato akce je nevratná. Sekce bude trvale odstraněna.</p>
              <div className="flex flex-col gap-3">
                <button onClick={confirmDeleteSection} className="w-full py-4 bg-rose-500 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20">Ano, smazat</button>
                <button onClick={() => setSectionToDelete(null)} className="w-full py-4 bg-zinc-50 dark:bg-slate-800 text-zinc-500 dark:text-slate-400 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:text-zinc-900 dark:hover:text-white transition-all">Zrušit</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL PRO ZMĚNU THEME */}
      <AnimatePresence>
        {themeToApply && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setThemeToApply(null)} className="absolute inset-0 bg-zinc-900/40 dark:bg-slate-950/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-2xl text-center">
              <div className="w-16 h-16 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto mb-6"><Sparkles size={32} /></div>
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2 text-zinc-900 dark:text-white">Aplikovat téma?</h3>
              <p className="text-zinc-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">Opravdu chcete přepsat aktuální barvy a styly presetem <strong className="text-zinc-800 dark:text-slate-200">{THEME_PRESETS[themeToApply]?.name}</strong>?</p>
              <div className="flex flex-col gap-3">
                <button onClick={confirmApplyTheme} className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20">Ano, aplikovat styl</button>
                <button onClick={() => setThemeToApply(null)} className="w-full py-4 bg-zinc-50 dark:bg-slate-800 text-zinc-500 dark:text-slate-400 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:text-zinc-900 dark:hover:text-white transition-all">Zrušit</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}