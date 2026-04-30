'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Camera, MonitorSmartphone, Receipt, Menu, X, Home, CalendarDays, Share2, Loader2 } from 'lucide-react'; 

import PhotoModule from './components/PhotoModule';
import WebModule from './components/WebModule';
import BillingModule from './components/BillingModule';
import HomeModule from './components/HomeModule';
import BookingModule from './components/BookingModule';
import ContentModule from './components/ContentModule';
import SettingsModule from './components/SettingsModule'; // Importujeme nový SettingsModule

const AVAILABLE_MODULES = [
  { id: 'web', name: 'Webové projekty', icon: MonitorSmartphone, color: 'blue' },
  { id: 'photo', name: 'Fotografické zakázky', icon: Camera, color: 'purple' },
  { id: 'billing', name: 'Fakturace', icon: Receipt, color: 'amber' },
  { id: 'bookings', name: 'Schůzky', icon: CalendarDays, color: 'emerald' },
  { id: 'content', name: 'Obsah & Sítě', icon: Share2, color: 'pink' }
];

export default function DashboardPage() {
  // Přidán stav 'settings' do možných modulů
  const [activeModule, setActiveModule] = useState<string>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Stav pro moduly načtené z databáze
  const [enabledModules, setEnabledModules] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    getInitialData();
  }, []);

  const getInitialData = async () => {
    setLoading(true);
    
    // 1. Získání aktuálně přihlášeného uživatele
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      setUserId(user.id);
      
      // 2. Načtení profilu ze Supabase
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('active_modules')
        .eq('id', user.id)
        .single();

      if (profile && profile.active_modules) {
        setEnabledModules(profile.active_modules);
      } else if (error) {
        // Pokud profil neexistuje, použijeme default
        setEnabledModules(['web', 'photo', 'billing', 'bookings', 'content']);
      }
    }

    // Načtení naposledy otevřeného modulu z localStorage
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
    const newEnabled = isEnabled
      ? enabledModules.filter(id => id !== moduleId)
      : [...enabledModules, moduleId];

    // Okamžitá aktualizace UI
    setEnabledModules(newEnabled);

    // Uložení do Supabase
    const { error } = await supabase
      .from('profiles')
      .update({ active_modules: newEnabled })
      .eq('id', userId);

    if (error) {
      alert('Chyba při ukládání nastavení: ' + error.message);
      // V případě chyby vrátit původní stav
      setEnabledModules(enabledModules);
    }
  };

  // Přidána funkce pro odhlášení
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload(); // Obnoví stránku a přesměruje uživatele na login (díky middleware/auth logice)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">IndieHub startuje...</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-20">
      
      {/* NAVIGACE */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center gap-4">
          
          {/* LOGO */}
          <div className="flex items-center cursor-pointer" onClick={() => handleModuleChange('home')}>
            <span className="text-xl font-black text-white tracking-wide italic">
              INDIE<span className="text-emerald-500">HUB</span>
            </span>
          </div>
          
          {/* DESKTOPOVÉ MENU */}
          <div className="hidden lg:flex gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button onClick={() => handleModuleChange('home')} className={`p-2 px-3 rounded-lg ${activeModule === 'home' ? 'bg-slate-800 text-white border-slate-700' : 'text-slate-400 hover:text-white'}`}>
              <Home className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-slate-800 my-auto mx-1"></div>
            
            {AVAILABLE_MODULES.filter(m => enabledModules.includes(m.id)).map(mod => (
              <button 
                key={mod.id}
                onClick={() => handleModuleChange(mod.id)} 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeModule === mod.id ? `bg-${mod.color}-500/20 text-${mod.color}-400 border border-${mod.color}-500/30` : 'text-slate-400 hover:text-white'}`}
              >
                <mod.icon className="w-4 h-4" /> {mod.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* PRAVÁ STRANA: AVATAR A MENU TLACITKO */}
          <div className="flex items-center gap-4">
             {/* Kliknutí nyní přepíná na modul 'settings' místo otevírání modalu */}
             <button 
               onClick={() => handleModuleChange('settings')}
               className={`w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 border flex items-center justify-center text-white font-black hover:scale-105 transition-all shadow-lg shadow-emerald-500/20 ${activeModule === 'settings' ? 'border-white scale-105 ring-2 ring-emerald-500/50' : 'border-emerald-400'}`}
             >
               R
             </button>
             <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 bg-slate-800 text-slate-300 rounded-lg border border-slate-700">
               <Menu className="w-5 h-5" />
             </button>
          </div>
        </div>
      </nav>

      {/* MOBILNÍ MENU (Vysouvací) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col p-6 animate-in fade-in duration-200 lg:hidden overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-black text-slate-400 tracking-widest uppercase">Moduly</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-slate-900/80 rounded-full text-slate-400 hover:text-white border border-slate-800"><X className="w-6 h-6" /></button>
          </div>
          <div className="flex flex-col gap-4 pb-10">
            {enabledModules.includes('web') && <button onClick={() => handleModuleChange('web')} className={`p-5 rounded-2xl font-black text-xl text-left flex items-center gap-4 transition-colors ${activeModule === 'web' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}><MonitorSmartphone className="w-6 h-6" /> Webové projekty</button>}
            {enabledModules.includes('photo') && <button onClick={() => handleModuleChange('photo')} className={`p-5 rounded-2xl font-black text-xl text-left flex items-center gap-4 transition-colors ${activeModule === 'photo' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}><Camera className="w-6 h-6" /> Fotografické zakázky</button>}
            {enabledModules.includes('billing') && <button onClick={() => handleModuleChange('billing')} className={`p-5 rounded-2xl font-black text-xl text-left flex items-center gap-4 transition-colors ${activeModule === 'billing' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}><Receipt className="w-6 h-6" /> Fakturace</button>}
            {enabledModules.includes('bookings') && <button onClick={() => handleModuleChange('bookings')} className={`p-5 rounded-2xl font-black text-xl text-left flex items-center gap-4 transition-colors ${activeModule === 'bookings' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}><CalendarDays className="w-6 h-6" /> Schůzky</button>}
            {enabledModules.includes('content') && <button onClick={() => handleModuleChange('content')} className={`p-5 rounded-2xl font-black text-xl text-left flex items-center gap-4 transition-colors ${activeModule === 'content' ? 'bg-pink-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}><Share2 className="w-6 h-6" /> Obsah & Sítě</button>}
          </div>
        </div>
      )}

      {/* OBSAH (Podmíněné renderování) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        {activeModule === 'home' && <HomeModule />}
        {activeModule === 'billing' && enabledModules.includes('billing') && <BillingModule />}
        {activeModule === 'web' && enabledModules.includes('web') && <WebModule />}
        {activeModule === 'photo' && enabledModules.includes('photo') && <PhotoModule />}
        {activeModule === 'bookings' && enabledModules.includes('bookings') && <BookingModule />}
        {activeModule === 'content' && enabledModules.includes('content') && <ContentModule />}
        
        {/* Zobrazení nového modulu nastavení */}
        {activeModule === 'settings' && (
          <SettingsModule 
            enabledModules={enabledModules} 
            toggleModule={toggleModule} 
            onLogout={handleLogout} 
          />
        )}
      </div>

    </main>
  );
}