'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Camera, MonitorSmartphone, Receipt, Menu, X, Home, 
  CalendarDays, Share2, Loader2, FileSignature, Sun, Moon, Settings, 
  Sparkles, FileText, ShieldAlert, Image as ImageIcon 
} from 'lucide-react'; 
import { useTheme } from '../../lib/components/ThemeProvider';

// OPRAVENÉ IMPORTY - přidáno /admin/
import PhotoModule from '../components/admin/PhotoModule';
import WebModule from '../components/admin/WebModule';
import BillingModule from '../components/admin/BillingModule';
import HomeModule from '../components/admin/HomeModule';
import BookingModule from '../components/admin/BookingModule';
import ContentModule from '../components/admin/ContentModule';
import SettingsModule from '../components/admin/SettingsModule';
import Onboarding from '../components/admin/Onboarding';
import QuotesModule from '../components/admin/QuotesModule';
import EngineModule from '../components/admin/EngineModule'; 
import SuperadminModule from '../components/admin/SuperadminModule'; 
import ArticlesModule from '../components/admin/ArticlesModule';
import GalleryModule from '../components/admin/GalleryModule';

const AVAILABLE_MODULES = [
  { id: 'web', name: 'Webové projekty', icon: MonitorSmartphone, color: 'blue' },
  { id: 'photo', name: 'Fotografické zakázky', icon: Camera, color: 'purple' },
  { id: 'quotes', name: 'Cenové nabídky', icon: FileSignature, color: 'indigo' },
  { id: 'billing', name: 'Fakturace', icon: Receipt, color: 'amber' },
  { id: 'bookings', name: 'Schůzky', icon: CalendarDays, color: 'emerald' },
  { id: 'content', name: 'Obsah & Sítě', icon: Share2, color: 'pink' },
  { id: 'articles', name: 'Články (Blog)', icon: FileText, color: 'orange' },
  { id: 'gallery', name: 'Správce galerií', icon: ImageIcon, color: 'teal' }
];

export default function AdminPage() {
  const [activeModule, setActiveModule] = useState<string>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [enabledModules, setEnabledModules] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userRole, setUserRole] = useState<'client' | 'superadmin'>('client');

  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    getInitialData();
  }, []);

 const getInitialData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      setUserId(user.id);
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, active_modules, user_type, role') 
        .eq('id', user.id)
        .single();

      if (profile) {
        setUserProfile(profile);
        if (profile.role) setUserRole(profile.role);
        
        if (profile.active_modules) {
          setEnabledModules(profile.active_modules);
        } else {
          setEnabledModules(['web', 'photo', 'billing', 'bookings', 'content', 'quotes', 'articles', 'gallery']);
        }
        if (!profile.user_type || profile.user_type === '') setShowOnboarding(true);
      } else {
        // ZÁCHRANNÁ BRZDA: Pokud profil neexistuje, dáme ti plný přístup
        setEnabledModules(['web', 'photo', 'billing', 'bookings', 'content', 'quotes', 'articles', 'gallery']);
        setUserRole('superadmin'); 
      }
    } else {
      // 🛑 VYHAZOVAČ: Pokud uživatel není přihlášený, okamžitě ho přesměruj na login!
      window.location.replace('/login');
      return; // Důležité: Ukončíme funkci, aby se dole nevypnulo načítání (loading)
    }

    const savedModule = localStorage.getItem('indiehub_active_module');
    if (savedModule) setActiveModule(savedModule);
    setLoading(false);
  };

  const handleModuleChange = (module: string) => {
    setActiveModule(module);
    localStorage.setItem('indiehub_active_module', module);
    setIsMobileMenuOpen(false);
  };

  const toggleModule = async (moduleId: string) => {
    if (!userId) return;
    const isEnabled = enabledModules.includes(moduleId);
    const newEnabled = isEnabled ? enabledModules.filter(id => id !== moduleId) : [...enabledModules, moduleId];
    setEnabledModules(newEnabled);

    const { error } = await supabase.from('profiles').update({ active_modules: newEnabled }).eq('id', userId);
    if (error) {
      alert('Chyba při ukládání: ' + error.message);
      setEnabledModules(enabledModules); // Revert na předchozí stav
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload(); 
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--background)] text-[var(--foreground)]">
        <Loader2 className="w-8 h-8 text-purple-600 dark:text-emerald-500 animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest opacity-50">Chameleon OS startuje...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[var(--background)] transition-colors duration-500">
      
      {showOnboarding && userProfile && (
        <Onboarding userId={userProfile.id} onComplete={() => { setShowOnboarding(false); window.location.reload(); }} />
      )}

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex flex-col w-72 fixed inset-y-0 left-0 border-r border-zinc-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 backdrop-blur-xl z-40 transition-colors duration-500">
        
        {/* Logo */}
        <div className="h-24 flex items-center px-8 border-b border-zinc-200 dark:border-slate-800">
          <div 
            className="flex items-center gap-4 cursor-pointer group" 
            onClick={() => handleModuleChange('home')}
          >
            <div className="relative w-10 h-20 flex items-center justify-center transition-all duration-300 group-hover:scale-105 shrink-0">
              <img 
                src={theme === 'light' 
                  ? "https://okmxoxaxsotxkiyljcuy.supabase.co/storage/v1/object/public/galleries/Chameleon/logo-chameleon-purple-transparent.png" 
                  : "https://okmxoxaxsotxkiyljcuy.supabase.co/storage/v1/object/public/galleries/Chameleon/logo-chameleon-green-transparent.png"
                } 
                alt="Chameleon Engine Symbol" 
                className={`w-full h-full object-contain transition-all duration-500 ${
                  theme === 'light' ? 'drop-shadow-[0_0_8px_rgba(142,68,237,0.3)]' : 'drop-shadow-[0_0_12px_rgba(204,255,0,0.5)]'
                }`}
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className={`font-black text-2xl tracking-[0.1em] leading-none transition-colors duration-500 ${
                  theme === 'light' ? 'text-zinc-800' : 'text-white'
                }`}>
                CHMLN<span className={theme === 'light' ? 'text-[#8E44ED]' : 'text-[#ccff00]'}>.</span>
              </span>
              <span className={`font-mono text-[9px] tracking-[0.15em] uppercase mt-1.5 transition-colors duration-500 ${
                  theme === 'light' ? 'text-zinc-500' : 'text-[#ccff00]/60'
                }`}>
                engine v1 & flow
              </span>
            </div>
          </div>
        </div>

        {/* Hlavní navigace */}
        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2 custom-scrollbar">
          <button 
            onClick={() => handleModuleChange('home')} 
            className={`flex items-center gap-3 w-full p-3.5 rounded-2xl font-bold transition-all ${
              activeModule === 'home' 
                ? 'bg-zinc-100 dark:bg-slate-800 text-zinc-900 dark:text-white shadow-sm dark:shadow-none' 
                : 'text-zinc-500 dark:text-slate-400 hover:bg-zinc-50 dark:hover:bg-slate-800/50 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Home className="w-5 h-5" /> Nástěnka
          </button>

          {/* TLAČÍTKO SUPERADMIN - Zobrazí se jen tobě */}
          {userRole === 'superadmin' && (
            <button 
              onClick={() => handleModuleChange('superadmin')} 
              className={`flex items-center gap-3 w-full p-3.5 rounded-2xl font-bold transition-all ${
                activeModule === 'superadmin' 
                  ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-sm' 
                  : 'text-zinc-500 dark:text-slate-400 hover:bg-red-500/5 hover:text-red-400'
              }`}
            >
              <ShieldAlert className="w-5 h-5" /> Mission Control
            </button>
          )}
          
          <div className="h-px bg-zinc-200 dark:bg-slate-800 my-2 mx-4"></div>

          <span className="px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-slate-500 mb-1">Aktivní moduly</span>
          
          {AVAILABLE_MODULES.filter(m => enabledModules.includes(m.id)).map(mod => (
            <button 
              key={mod.id}
              onClick={() => handleModuleChange(mod.id)} 
              className={`flex items-center gap-3 w-full p-3.5 rounded-2xl font-bold transition-all ${
                activeModule === mod.id 
                  ? 'bg-zinc-100 dark:bg-slate-800 text-zinc-900 dark:text-white shadow-sm dark:shadow-none' 
                  : 'text-zinc-500 dark:text-slate-400 hover:bg-zinc-50 dark:hover:bg-slate-800/50 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <mod.icon className="w-5 h-5" /> {mod.name}
            </button>
          ))}
        </div>

        {/* Tlačítko pro spuštění Engine (nad nastavením) */}
        {enabledModules.includes('web') && (
          <div className="p-4 border-t border-zinc-200 dark:border-slate-800">
            <div className={`rounded-2xl p-4 text-white shadow-lg relative overflow-hidden group transition-all ${
              activeModule === 'engine' 
                ? 'bg-gradient-to-br from-purple-500 to-blue-500 shadow-purple-500/30 scale-[1.02]' 
                : 'bg-gradient-to-br from-purple-600 to-blue-600 shadow-purple-500/10 hover:scale-[1.02]'
            }`}>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700 pointer-events-none">
                <Sparkles className="w-16 h-16" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4" />
                  <h4 className="font-black text-sm tracking-wide">Engine</h4>
                </div>
                <p className="text-[10px] text-white/70 mb-3 font-medium uppercase tracking-widest">Vizuální editor webů</p>
                <button 
                  onClick={() => handleModuleChange('engine')}
                  className="w-full py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors backdrop-blur-sm"
                >
                  Spustit editor
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Spodní akce (Theme & Nastavení) */}
        <div className="p-6 border-t border-zinc-200 dark:border-slate-800 flex items-center justify-between gap-2 bg-zinc-50/50 dark:bg-slate-900/50">
          <button 
            onClick={() => handleModuleChange('settings')}
            className={`flex items-center gap-3 p-3 flex-1 rounded-xl font-bold transition-all ${
              activeModule === 'settings' 
                ? 'bg-zinc-200 dark:bg-slate-800 text-zinc-900 dark:text-white' 
                : 'text-zinc-500 dark:text-slate-400 hover:bg-zinc-100 dark:hover:bg-slate-800 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5" /> Nastavení
          </button>
          <button 
            onClick={toggleTheme}
            className="p-3 rounded-xl bg-white dark:bg-slate-800 text-zinc-500 dark:text-slate-400 border border-zinc-200 dark:border-slate-700 hover:text-purple-600 dark:hover:text-emerald-400 transition-colors shadow-sm dark:shadow-none"
            title="Přepnout motiv"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* --- MOBILE TOP BAR --- */}
      <nav className="lg:hidden fixed top-0 inset-x-0 h-20 border-b border-zinc-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-40 flex items-center justify-between px-6 transition-colors duration-500">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleModuleChange('home')}>
           <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
             <img
               src={theme === 'light'
                 ? "https://okmxoxaxsotxkiyljcuy.supabase.co/storage/v1/object/public/galleries/Chameleon/logo-chameleon-purple-transparent.png"
                 : "https://okmxoxaxsotxkiyljcuy.supabase.co/storage/v1/object/public/galleries/Chameleon/logo-chameleon-green-transparent.png"
               }
               alt="Chameleon Engine Symbol"
               className={`w-full h-full object-contain ${
                 theme === 'light' ? 'drop-shadow-[0_0_8px_rgba(142,68,237,0.3)]' : 'drop-shadow-[0_0_10px_rgba(204,255,0,0.5)]'
               }`}
             />
           </div>
           <div className="flex flex-col justify-center">
             <span className={`font-black text-lg tracking-[0.1em] leading-none ${theme === 'light' ? 'text-zinc-800' : 'text-white'}`}>
               CHMLN<span className={theme === 'light' ? 'text-[#8E44ED]' : 'text-[#ccff00]'}>.</span>
             </span>
             <span className={`font-mono text-[7px] tracking-[0.15em] uppercase mt-1 ${theme === 'light' ? 'text-zinc-500' : 'text-[#ccff00]/60'}`}>
               engine v1 & flow
             </span>
           </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 rounded-xl text-zinc-500 dark:text-slate-400 border border-zinc-200 dark:border-slate-700">
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-zinc-100 dark:bg-slate-800 text-zinc-600 dark:text-slate-300 rounded-xl border border-zinc-200 dark:border-slate-700">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* --- MOBILE MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl flex flex-col p-6 animate-in fade-in duration-200 lg:hidden overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-black text-zinc-500 dark:text-slate-400 tracking-widest uppercase">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-zinc-100 dark:bg-slate-900/80 rounded-full text-zinc-600 dark:text-slate-400 border border-zinc-200 dark:border-slate-800"><X className="w-6 h-6" /></button>
          </div>
          <div className="flex flex-col gap-3 pb-10">
            <button onClick={() => handleModuleChange('home')} className={`p-5 rounded-2xl font-black text-xl text-left flex items-center gap-4 transition-colors ${activeModule === 'home' ? 'bg-zinc-900 dark:bg-slate-800 text-white' : 'bg-zinc-50 dark:bg-slate-900 text-zinc-600 dark:text-slate-400 border border-zinc-200 dark:border-slate-800'}`}><Home className="w-6 h-6" /> Nástěnka</button>
            
            {userRole === 'superadmin' && (
              <button 
                onClick={() => handleModuleChange('superadmin')} 
                className={`p-5 rounded-2xl font-black text-xl text-left flex items-center gap-4 transition-colors ${
                  activeModule === 'superadmin' 
                    ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                    : 'bg-zinc-50 dark:bg-slate-900 text-zinc-600 dark:text-slate-400 border border-zinc-200 dark:border-slate-800'
                }`}
              >
                <ShieldAlert className="w-6 h-6" /> Mission Control
              </button>
            )}

            {AVAILABLE_MODULES.filter(m => enabledModules.includes(m.id)).map(mod => (
              <button 
                key={mod.id}
                onClick={() => handleModuleChange(mod.id)} 
                className={`p-5 rounded-2xl font-black text-xl text-left flex items-center gap-4 transition-colors ${activeModule === mod.id ? 'bg-zinc-900 dark:bg-slate-800 text-white' : 'bg-zinc-50 dark:bg-slate-900 text-zinc-600 dark:text-slate-400 border border-zinc-200 dark:border-slate-800'}`}
              >
                <mod.icon className="w-6 h-6" /> {mod.name}
              </button>
            ))}

            <button onClick={() => handleModuleChange('settings')} className={`p-5 rounded-2xl font-black text-xl text-left flex items-center gap-4 transition-colors ${activeModule === 'settings' ? 'bg-zinc-900 dark:bg-slate-800 text-white' : 'bg-zinc-50 dark:bg-slate-900 text-zinc-600 dark:text-slate-400 border border-zinc-200 dark:border-slate-800'}`}><Settings className="w-6 h-6" /> Nastavení</button>
          </div>
        </div>
      )}

      {/* --- HLAVNÍ OBSAH --- */}
      <div className="flex-1 min-w-0 overflow-x-hidden lg:ml-72 min-h-screen pt-24 lg:pt-8 px-4 sm:px-8 xl:px-12 pb-20">
        <div className="max-w-6xl mx-auto">
          
          {/* Nástěnka je nyní pro všechny, Superadmin má svůj vlastní modul */}
          {activeModule === 'home' && <HomeModule />}
          {activeModule === 'superadmin' && userRole === 'superadmin' && <SuperadminModule />}

          {activeModule === 'engine' && enabledModules.includes('web') && <EngineModule />} 
          {activeModule === 'billing' && enabledModules.includes('billing') && <BillingModule />}
          {activeModule === 'web' && enabledModules.includes('web') && <WebModule />}
          {activeModule === 'photo' && enabledModules.includes('photo') && <PhotoModule />}
          {activeModule === 'quotes' && enabledModules.includes('quotes') && <QuotesModule />}
          {activeModule === 'bookings' && enabledModules.includes('bookings') && <BookingModule />}
          {activeModule === 'content' && enabledModules.includes('content') && <ContentModule />}
          
          {/* Nově napojené moduly */}
          {activeModule === 'articles' && enabledModules.includes('articles') && <ArticlesModule />}
          {activeModule === 'gallery' && enabledModules.includes('gallery') && <GalleryModule />}
          
          {activeModule === 'settings' && (
            <SettingsModule enabledModules={enabledModules} toggleModule={toggleModule} onLogout={handleLogout} userId={userId} />
          )}
        </div>
      </div>

    </div>
  );
}