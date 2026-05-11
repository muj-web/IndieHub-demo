"use client";
import { useState, useEffect, use, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { 
  CheckCircle2, Plus, ArrowLeft, Loader2, 
  Layers, Trash2, Palette, EyeOff, Eye,
  ExternalLink, Type, Square, Layout, Rocket, 
  AlignLeft, Maximize, Sparkles, ChevronDown, FileText, Clock
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { THEME_PRESETS } from "@/lib/theme-presets";
import BuilderSectionCard from "@/app/components/engine/builder/BuilderSectionCard";

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

  // Stavy pro Roadmapu (Tasks)
  const [newTask, setNewTask] = useState("");

  // Stavy pro Sekce a Vzhled
  const [newSection, setNewSection] = useState("hero-cinematic");
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);
  const [themeToApply, setThemeToApply] = useState<string | null>(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'delete' });

  // --- STAVY A REFERENCE PRO MĚŘENÍ ČASU ---
  const sessionSecondsRef = useRef(0);
  const totalTimeSpentRef = useRef(0);
  const isTrackingRef = useRef(true);
  const [sessionSecondsState, setSessionSecondsState] = useState(0);

  useEffect(() => { fetchProject(); }, [id]);

  async function fetchProject() {
    const { data: projData, error: projError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
      
    if (projError || !projData) {
      setProject(null);
      setLoading(false);
      return;
    }

    // Inicializace historického času z databáze
    if (totalTimeSpentRef.current === 0 && projData.time_spent) {
      totalTimeSpentRef.current = Number(projData.time_spent);
    }

    const { data: pages } = await supabase.from('project_pages').select('*').eq('project_id', id).order('order_index');
    const { data: sections } = await supabase.from('project_sections').select('*').eq('project_id', id).order('order_index');
    const { data: tasks } = await supabase.from('tasks').select('*').eq('project_id', id).order('created_at'); 

    const fullProject = {
      ...projData,
      project_pages: pages || [],
      project_sections: sections || [],
      tasks: tasks || []
    };

    if (!activePageId && fullProject.project_pages.length > 0) {
      const homePage = fullProject.project_pages.find((p: any) => p.is_homepage) || fullProject.project_pages[0];
      setActivePageId(homePage.id);
    }

    setProject(fullProject);
    setLoading(false);
  }

  // --- AUTOMATICKÉ MĚŘENÍ ČASU ---
  useEffect(() => {
    if (!id) return;

    const syncTime = async () => {
      if (sessionSecondsRef.current === 0) return;
      
      const additionalHours = sessionSecondsRef.current / 3600;
      const newTotal = totalTimeSpentRef.current + additionalHours;
      
      // Uložíme do DB asynchronně (neblokujeme UI) a s přesností na 4 desetinná místa
      supabase.from('projects').update({ time_spent: Number(newTotal.toFixed(4)) }).eq('id', id).then();
      
      totalTimeSpentRef.current = newTotal;
      sessionSecondsRef.current = 0;
      setSessionSecondsState(0);
    };

    // Detekce překliknutí do jiné záložky (Pauza)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isTrackingRef.current = false;
        syncTime(); // Bezpečně uložíme čas, když uživatel odejde jinam
      } else {
        isTrackingRef.current = true;
      }
    };

    window.addEventListener('beforeunload', syncTime);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const interval = setInterval(() => {
      if (isTrackingRef.current) {
        sessionSecondsRef.current += 1;
        setSessionSecondsState(sessionSecondsRef.current);

        // Automatické uložení každou minutu jako záloha proti pádu prohlížeče
        if (sessionSecondsRef.current >= 60) {
           syncTime();
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', syncTime);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      syncTime(); // Uloží čas při opuštění Builderu
    };
  }, [id]);

  const triggerToast = (message: string, type: 'success' | 'delete') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  };

  async function updateDesignConfig(key: string, value: string) {
    setProject((prev: any) => ({ ...prev, design_config: { ...(prev?.design_config || {}), [key]: value } }));
    const currentConfig = project?.design_config || {};
    await supabase.from('projects').update({ design_config: { ...currentConfig, [key]: value } }).eq('id', id);
    triggerToast("Globální styl aktualizován", "success");
  }

  async function updatePalette(key: string, value: string) {
    setProject((prev: any) => ({ ...prev, color_palette: { ...(prev?.color_palette || {}), [key]: value } }));
    const currentPalette = project?.color_palette || {};
    await supabase.from('projects').update({ color_palette: { ...currentPalette, [key]: value } }).eq('id', id);
  }

  async function toggleWireframe() {
    const newVal = !project?.is_wireframe;
    setProject((prev: any) => ({ ...prev, is_wireframe: newVal }));
    await supabase.from('projects').update({ is_wireframe: newVal }).eq('id', id);
    triggerToast(newVal ? "Wireframe mód aktivován" : "Vizuální mód aktivován", "success");
  }

  async function confirmApplyTheme() {
    if (!themeToApply) return;
    const theme = THEME_PRESETS[themeToApply];
    
    setProject((prev: any) => ({ ...prev, color_palette: theme.color_palette, design_config: theme.design_config }));
    
    const { error } = await supabase.from('projects').update({ 
      color_palette: theme.color_palette, design_config: theme.design_config 
    }).eq('id', id);
    
    if (!error) triggerToast(`Vibe ${theme.name} aplikován`, "success");
    setThemeToApply(null);
  }

  async function createPage(e: React.FormEvent) {
    e.preventDefault();
    if (!newPageTitle.trim()) return;

    const slug = newPageTitle.toLowerCase().trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');

    const isFirstPage = !project?.project_pages || project.project_pages.length === 0;

    const { data, error } = await supabase.from('project_pages').insert({
      project_id: id,
      title: newPageTitle,
      slug: (isFirstPage && !creatingParentId) ? '' : slug,
      is_homepage: (isFirstPage && !creatingParentId),
      order_index: project?.project_pages?.length || 0,
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
      triggerToast("Nová stránka vytvořena", "success");
    }
  }

  async function deleteActivePage() {
    const activePage = project?.project_pages?.find((p: any) => p.id === activePageId);
    if (!activePage) return;
    if (activePage.is_homepage) return alert("Domovskou stránku nelze smazat.");
    if (!confirm(`Opravdu chcete smazat stránku "${activePage.title}" včetně všech jejích sekcí?`)) return;

    await supabase.from('project_pages').delete().eq('id', activePageId);
    setActivePageId(null);
    fetchProject();
    triggerToast("Stránka byla smazána", "delete");
  }

  async function saveSectionContentFromCard(sectionId: string, updatedContent: any) {
    setProject((prev: any) => ({
      ...prev, project_sections: prev.project_sections.map((s: any) => s.id === sectionId ? { ...s, content_data: updatedContent } : s)
    }));
    await supabase.from('project_sections').update({ content_data: updatedContent }).eq('id', sectionId);
    triggerToast("Změny byly uloženy", "success");
  }

  async function changeComponentVariant(sectionId: string, newVariant: string) {
    setProject((prev: any) => ({
      ...prev, project_sections: prev.project_sections.map((s: any) => s.id === sectionId ? { ...s, component_type: newVariant } : s)
    }));
    await supabase.from('project_sections').update({ component_type: newVariant }).eq('id', sectionId);
    triggerToast("Komponenta změněna", "success");
  }

  async function confirmDeleteSection() {
    if (!sectionToDelete) return;
    setProject((prev: any) => ({ ...prev, project_sections: prev.project_sections.filter((s: any) => s.id !== sectionToDelete) }));
    await supabase.from('project_sections').delete().eq('id', sectionToDelete);
    setSectionToDelete(null);
    triggerToast("Sekce odstraněna", "delete");
  }

  async function moveSection(index: number, direction: 'up' | 'down') {
    const sections = [...activeSections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;
    
    await supabase.from('project_sections').update({ order_index: sections[newIndex].order_index }).eq('id', sections[index].id);
    await supabase.from('project_sections').update({ order_index: sections[index].order_index }).eq('id', sections[newIndex].id);
    fetchProject();
  }

  async function addSection(e: React.FormEvent) {
    e.preventDefault(); 
    if (!activePageId) return alert("Vyberte stránku.");
    await supabase.from('project_sections').insert({ 
      project_id: id, page_id: activePageId, component_type: newSection, order_index: activeSections.length || 0 
    });
    fetchProject();
    triggerToast("Nová sekce přidána", "success");
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTask.trim()) return;
    await supabase.from('tasks').insert({ project_id: id, title: newTask });
    setNewTask("");
    fetchProject();
    triggerToast("Úkol přidán", "success");
  }

  async function toggleTask(taskId: string, currentState: boolean) {
    await supabase.from('tasks').update({ is_completed: !currentState }).eq('id', taskId);
    fetchProject();
  }

  if (loading) return <div className="min-h-screen bg-[var(--background)] flex items-center justify-center"><Loader2 className="w-12 h-12 text-purple-600 animate-spin" /></div>;
  if (!project) return <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center text-zinc-500 font-bold uppercase tracking-widest">Projekt nebyl nalezen.</div>;

  const accentColor = project?.accent_color || "#8E44ED";
  const activeSections = project?.project_sections?.filter((s: any) => s.page_id === activePageId) || [];
  const activePageObj = project?.project_pages?.find((p: any) => p.id === activePageId);
  const isHomePage = activePageObj?.is_homepage || false;
  const previewUrl = activePageObj && !isHomePage ? `/demo/${project?.slug}/${activePageObj.slug}` : `/demo/${project?.slug}`;

  // Formátování zobrazeného času
  const totalSeconds = Math.floor((totalTimeSpentRef.current * 3600) + sessionSecondsState);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-4 md:p-8 pt-24 md:pt-32 overflow-x-hidden font-sans transition-colors duration-500 relative">
      <div className="max-w-[1600px] mx-auto w-[95%] md:w-[90%] relative z-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 md:mb-16">
          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/" className="p-4 bg-white dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-[1.5rem] hover:text-purple-600 transition-all shrink-0 shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none flex flex-wrap items-center gap-2 md:gap-4 text-zinc-900 dark:text-white">
                <span className="truncate max-w-[200px] sm:max-w-md">{project?.project_name}</span>
                <span className="text-zinc-400 dark:text-slate-600 text-xl md:text-2xl whitespace-nowrap">/ Builder</span>
              </h1>
              
              {/* TIMER UI */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                   <Clock className="w-3 h-3 text-emerald-500" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-slate-400 flex items-center gap-2">
                  Pracovní čas: 
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs">{formattedTime}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Link 
              href={previewUrl || '#'} 
              target="_blank" 
              className="flex items-center justify-center flex-grow md:flex-grow-0 gap-3 px-8 py-4 bg-white dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 text-zinc-700 dark:text-slate-300 rounded-2xl font-bold text-xs uppercase tracking-widest hover:text-purple-600 transition-all shadow-sm"
            >
              Live náhled <ExternalLink className="w-4 h-4" />
            </Link>
            <button className="flex items-center justify-center flex-grow md:flex-grow-0 gap-3 px-8 py-4 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg hover:scale-105" style={{ backgroundColor: accentColor, boxShadow: `0 10px 30px ${accentColor}40` }}>
              Publikovat <Rocket className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* --- HLAVNÍ GRID 33 / 66 --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEVÝ SLOUPEC: DESIGN A ROADMAPA */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900/50 border border-zinc-200 dark:border-slate-800 rounded-[2.5rem] p-6 md:p-8 shadow-sm">
              
              <div className="flex items-center gap-4 mb-8">
                <Palette className="w-6 h-6 shrink-0" style={{ color: accentColor }} />
                <h2 className="text-xl font-bold uppercase tracking-tight text-zinc-900 dark:text-white truncate">Design System</h2>
              </div>

              {/* --- VÝBĚR TÉMATU --- */}
              <div className="mb-6 p-4 border border-zinc-200 dark:border-slate-800 rounded-2xl bg-zinc-50/50 dark:bg-slate-950/50">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-slate-500 mb-2 flex items-center gap-2">
                   <Sparkles size={12} /> Zvolit přednastavený Vibe
                </label>
                <select 
                  onChange={(e) => {
                    setThemeToApply(e.target.value);
                    e.target.value = ""; 
                  }}
                  value=""
                  className="w-full bg-white dark:bg-slate-900 border border-zinc-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-zinc-700 dark:text-slate-200 focus:outline-none focus:border-purple-600 transition-all cursor-pointer shadow-sm"
                >
                  <option value="" disabled>-- Vyberte téma pro aplikaci --</option>
                  {Object.entries(THEME_PRESETS).map(([key, theme]: any) => (
                    <option key={key} value={key}>{theme.name}</option>
                  ))}
                </select>
                <p className="text-[9px] text-zinc-400 mt-2 leading-relaxed">
                  Upozornění: Výběr tématu přepíše aktuální barvy, font a zaoblení níže.
                </p>
              </div>

              <button 
                onClick={toggleWireframe}
                className={`w-full flex items-center justify-center gap-3 px-4 md:px-6 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all mb-10 border ${
                  project?.is_wireframe ? 'bg-zinc-50 dark:bg-slate-950 text-zinc-400 border-zinc-200 dark:border-slate-800' : 'text-white border-transparent shadow-lg'
                }`}
                style={!project?.is_wireframe ? { backgroundColor: accentColor, boxShadow: `0 10px 20px ${accentColor}30` } : {}}
              >
                {project?.is_wireframe ? <EyeOff size={16} /> : <Eye size={16} />}
                <span className="truncate">{project?.is_wireframe ? 'Mód: Wireframe' : 'Mód: Vizuální Design'}</span>
              </button>

              <div className="space-y-6 mb-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-slate-600 border-b border-zinc-100 dark:border-slate-800 pb-2">Barevná paleta</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[{ key: 'bg', label: 'Pozadí' }, { key: 'text', label: 'Text' }, { key: 'accent', label: 'Akcent' }, { key: 'surface', label: 'Karty' }].map(c => (
                    <div key={c.key} className="space-y-2">
                      <label className="text-[9px] uppercase font-bold text-zinc-400 dark:text-slate-500 ml-1">{c.label}</label>
                      <div className="flex gap-2">
                        <input type="color" value={project?.color_palette?.[c.key] || '#ffffff'} onChange={(e) => updatePalette(c.key, e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer shrink-0 border border-zinc-200 dark:border-slate-700 bg-transparent" />
                        <input type="text" value={project?.color_palette?.[c.key] || '#ffffff'} onChange={(e) => updatePalette(c.key, e.target.value)} className="w-full bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-lg px-3 text-[10px] font-mono min-w-0 focus:outline-none focus:border-purple-600 transition-colors text-zinc-900 dark:text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-slate-600 border-b border-zinc-100 dark:border-slate-800 pb-2">Globální styl a rozložení</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold flex items-center gap-2 text-zinc-500 dark:text-slate-400 whitespace-nowrap"><Type size={14}/> Nadpisy</span>
                    <select value={project?.design_config?.font_heading || 'Inter'} onChange={(e) => updateDesignConfig('font_heading', e.target.value)} className="bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-lg px-3 py-2 text-[11px] md:text-xs min-w-0 flex-1 ml-2 focus:outline-none focus:border-purple-600 transition-colors text-zinc-900 dark:text-white">
                      <option value="Inter">Inter (Modern)</option>
                      <option value="Lexend">Lexend (Geometric)</option>
                      <option value="Playfair Display">Playfair (Elegant)</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold flex items-center gap-2 text-zinc-500 dark:text-slate-400 whitespace-nowrap"><Square size={14}/> Zaoblení</span>
                    <select value={project?.design_config?.radius || '0.75rem'} onChange={(e) => updateDesignConfig('radius', e.target.value)} className="bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-lg px-3 py-2 text-[11px] md:text-xs min-w-0 flex-1 ml-2 focus:outline-none focus:border-purple-600 transition-colors text-zinc-900 dark:text-white">
                      <option value="0px">Ostré (0px)</option>
                      <option value="0.75rem">Střední (12px)</option>
                      <option value="9999px">Kulaté / Full</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold flex items-center gap-2 text-zinc-500 dark:text-slate-400 whitespace-nowrap"><AlignLeft size={14}/> Zarovnání</span>
                    <select value={project?.design_config?.align || 'center'} onChange={(e) => updateDesignConfig('align', e.target.value)} className="bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-lg px-3 py-2 text-[11px] md:text-xs min-w-0 flex-1 ml-2 focus:outline-none focus:border-purple-600 transition-colors text-zinc-900 dark:text-white">
                      <option value="left">Doleva</option>
                      <option value="center">Na střed</option>
                      <option value="right">Doprava</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold flex items-center gap-2 text-zinc-500 dark:text-slate-400 whitespace-nowrap"><Maximize size={14}/> Šířka webu</span>
                    <select value={project?.design_config?.content_width || '60'} onChange={(e) => updateDesignConfig('content_width', e.target.value)} className="bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-lg px-3 py-2 text-[11px] md:text-xs min-w-0 flex-1 ml-2 focus:outline-none focus:border-purple-600 transition-colors text-zinc-900 dark:text-white">
                      <option value="100">Celá šířka</option>
                      <option value="80">Široký</option>
                      <option value="60">Standard</option>
                      <option value="50">Úzký</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* ROADMAPA */}
            <div className="bg-white dark:bg-slate-900/50 border border-zinc-200 dark:border-slate-800 rounded-[2.5rem] p-6 md:p-8 shadow-sm transition-colors">
               <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-zinc-900 dark:text-white"><CheckCircle2 size={16} style={{ color: accentColor }}/> Roadmapa a úkoly</h3>
               <form onSubmit={addTask} className="relative mb-6">
                 <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Přidat úkol..." className="w-full bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-zinc-900 dark:text-slate-200 focus:outline-none focus:border-purple-600 transition-all pr-12" />
                 <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-zinc-900 dark:bg-slate-800 text-white rounded-lg hover:bg-purple-600 transition-all"><Plus className="w-4 h-4" /></button>
               </form>
               <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                 {project?.tasks?.map((t: any) => (
                   <div key={t.id} onClick={() => toggleTask(t.id, t.is_completed)} className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-slate-900/50 rounded-xl border border-zinc-100 dark:border-slate-800 text-[11px] cursor-pointer hover:border-zinc-300 dark:hover:border-slate-600 transition-all group">
                     <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${t.is_completed ? 'bg-purple-600 border-purple-600' : 'border-zinc-300 dark:border-slate-600 bg-white dark:bg-slate-950 group-hover:border-purple-300'}`}>
                       {t.is_completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                     </div>
                     <span className={`break-words ${t.is_completed ? 'line-through text-zinc-400 dark:text-slate-600' : 'text-zinc-700 dark:text-slate-300'}`}>{t.title}</span>
                   </div>
                 ))}
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
            <div className="bg-white dark:bg-slate-900/50 border border-zinc-200 dark:border-slate-800 rounded-[3rem] p-6 md:p-10 shadow-sm min-h-[600px] transition-colors">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8 md:mb-12">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl" style={{ backgroundColor: `${accentColor}15` }}>
                     <Layout className="w-6 h-6" style={{ color: accentColor }} />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Struktura stránky</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-zinc-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                        {activePageObj?.title || "Vyberte stránku"}
                      </p>
                      {!isHomePage && activePageObj && (
                        <button 
                          onClick={deleteActivePage} 
                          className="text-red-400 hover:text-red-600 p-1.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors border border-red-100 dark:border-red-500/20" 
                          title="Smazat celou tuto stránku"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <form onSubmit={addSection} className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                  <select value={newSection} onChange={(e) => setNewSection(e.target.value)} className="w-full sm:w-auto bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-2xl px-5 py-3 text-sm focus:border-purple-600 outline-none min-w-0 font-medium text-zinc-900 dark:text-white">
                    {Array.from(new Set(availableComponents
                      .filter(c => c.scope.includes(isHomePage ? 'home' : 'sub'))
                      .map(c => c.id.split('-')[0])
                    )).map(category => (
                      <optgroup key={category} label={category.toUpperCase()} className="text-purple-600 dark:text-purple-400 font-bold bg-white dark:bg-slate-900">
                        {availableComponents
                          .filter(c => c.id.startsWith(category + '-') && c.scope.includes(isHomePage ? 'home' : 'sub'))
                          .map(c => (
                            <option key={c.id} value={c.id} className="text-zinc-900 dark:text-slate-200 font-normal">{c.name}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <button disabled={!activePageId} type="submit" className="w-full sm:w-auto text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase transition-all whitespace-nowrap shrink-0 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100" style={{ backgroundColor: accentColor, boxShadow: `0 5px 15px ${accentColor}30` }}>
                    + Přidat sekci
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 gap-4">
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
                  <div className="py-20 border-2 border-dashed border-zinc-200 dark:border-slate-800 rounded-[3rem] flex flex-col items-center justify-center text-zinc-400 dark:text-slate-500 bg-zinc-50/50 dark:bg-slate-900/30">
                    <Layers className="w-12 h-12 mb-4 opacity-30" />
                    <p className="text-xs font-bold uppercase tracking-widest text-center px-4">Tato stránka je prázdná. Přidejte první sekci.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* --- MODALY --- */}
      <AnimatePresence>
        {sectionToDelete && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSectionToDelete(null)} className="absolute inset-0 bg-zinc-900/40 dark:bg-slate-950/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-2xl text-center">
              <div className="w-16 h-16 bg-red-50 dark:bg-rose-500/10 text-red-500 dark:text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6"><Trash2 size={32} /></div>
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2 text-zinc-900 dark:text-white">Odstranit sekci?</h3>
              <p className="text-zinc-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">Tato akce je nevratná. Sekce bude trvale odstraněna.</p>
              <div className="flex flex-col gap-3">
                <button onClick={confirmDeleteSection} className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-red-600 transition-all shadow-lg shadow-red-500/20">Ano, smazat</button>
                <button onClick={() => setSectionToDelete(null)} className="w-full py-4 bg-zinc-50 dark:bg-slate-800 text-zinc-400 dark:text-slate-400 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:text-zinc-900 dark:hover:text-white transition-all">Zrušit</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {themeToApply && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setThemeToApply(null)} className="absolute inset-0 bg-zinc-900/40 dark:bg-slate-950/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-2xl text-center">
              <div className="w-16 h-16 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto mb-6"><Sparkles size={32} /></div>
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2 text-zinc-900 dark:text-white">Aplikovat téma?</h3>
              <p className="text-zinc-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">Opravdu chcete přepsat aktuální barvy a styly presetem <strong className="text-zinc-800 dark:text-slate-200">{THEME_PRESETS[themeToApply]?.name}</strong>?</p>
              <div className="flex flex-col gap-3">
                <button onClick={confirmApplyTheme} className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20">Ano, aplikovat styl</button>
                <button onClick={() => setThemeToApply(null)} className="w-full py-4 bg-zinc-50 dark:bg-slate-800 text-zinc-400 dark:text-slate-400 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:text-zinc-900 dark:hover:text-white transition-all">Zrušit</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[10002] flex items-center gap-5 px-6 py-4 bg-white dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toast.type === 'success' ? 'bg-green-50 dark:bg-emerald-500/10 text-green-500 dark:text-emerald-500' : 'bg-red-50 dark:bg-rose-500/10 text-red-500 dark:text-rose-500'}`}>
                {toast.type === 'success' ? <CheckCircle2 size={18} /> : <Trash2 size={18} />}
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold text-zinc-900 dark:text-white leading-none">{toast.message}</p>
                <p className="text-[9px] text-zinc-400 uppercase tracking-widest mt-1">Synchronizováno s DB</p>
              </div>
            </div>
            {toast.type === 'success' && project?.slug && (
              <div className="pl-5 border-l border-zinc-100 dark:border-slate-800">
                <Link href={previewUrl || '#'} target="_blank" onClick={() => setToast({ ...toast, show: false })} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 px-4 py-2.5 rounded-xl">
                  Na web <ExternalLink size={12} />
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}