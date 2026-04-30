'use client';

import { useState } from 'react';
import { User, LayoutGrid, LogOut, Camera, MonitorSmartphone, Receipt, CalendarDays, Share2 } from 'lucide-react';

const MODULES_INFO = [
  { 
    id: 'web', 
    name: 'Webové projekty', 
    icon: MonitorSmartphone, 
    color: 'blue',
    description: 'Správa webových zakázek, tasky, předávací protokoly a hlídání termínů.'
  },
  { 
    id: 'photo', 
    name: 'Fotografické zakázky', 
    icon: Camera, 
    color: 'purple',
    description: 'Organizace focení, svateb, klientské galerie a výběry fotek.'
  },
  { 
    id: 'billing', 
    name: 'Fakturace', 
    icon: Receipt, 
    color: 'amber',
    description: 'Vystavování faktur, evidence příjmů a sledování čekajících plateb.'
  },
  { 
    id: 'bookings', 
    name: 'Schůzky', 
    icon: CalendarDays, 
    color: 'emerald',
    description: 'Rezervace konzultací z webu a chytrá synchronizace s Google Kalendářem.'
  },
  { 
    id: 'content', 
    name: 'Obsah & Sítě', 
    icon: Share2, 
    color: 'pink',
    description: 'Plánovač příspěvků pro sociální sítě, Kanban nástěnka a checklisty.'
  }
];

interface SettingsProps {
  enabledModules: string[];
  toggleModule: (id: string) => void;
  onLogout: () => void;
}

export default function SettingsModule({ enabledModules, toggleModule, onLogout }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'modules'>('modules');

  return (
    <div className="animate-in fade-in duration-300 max-w-5xl mx-auto">
      
      {/* HLAVIČKA */}
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold mb-1 text-white tracking-tight">Nastavení účtu</h1>
        <p className="text-slate-400 text-sm font-medium">Správa tvého profilu a modulů IndieHubu</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* LEVÝ PANEL (Menu) */}
        <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-2 bg-slate-900/40 p-3 rounded-3xl border border-slate-800">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'profile' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
          >
            <User className="w-4 h-4" /> Osobní údaje
          </button>
          
          <button 
            onClick={() => setActiveTab('modules')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'modules' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
          >
            <LayoutGrid className="w-4 h-4" /> Aktivní moduly
          </button>

          <div className="h-px bg-slate-800 my-2 mx-2"></div>

          <button 
            onClick={onLogout}
            className="flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Odhlásit se
          </button>
        </div>

        {/* PRAVÝ PANEL (Obsah) */}
        <div className="flex-grow w-full">
          
          {/* TAB: MODULY */}
          {activeTab === 'modules' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Tvoje pracovní plocha</h2>
                <p className="text-sm text-slate-400">Zapni si jen ty nástroje, které aktuálně potřebuješ. Kdykoliv je můžeš zase vypnout.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {MODULES_INFO.map(mod => {
                  const isEnabled = enabledModules.includes(mod.id);
                  const Icon = mod.icon;

                  return (
                    <div 
                      key={mod.id} 
                      className={`p-6 rounded-3xl border transition-all ${isEnabled ? 'bg-slate-900 border-slate-700' : 'bg-slate-900/40 border-slate-800/50 opacity-60 hover:opacity-100'}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isEnabled ? `bg-${mod.color}-500/20 text-${mod.color}-400` : 'bg-slate-800 text-slate-500'}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        
                        {/* Toggle Switch */}
                        <button 
                          onClick={() => toggleModule(mod.id)}
                          className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center cursor-pointer ${isEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                      </div>

                      <h3 className={`text-lg font-bold mb-2 ${isEnabled ? 'text-white' : 'text-slate-400'}`}>{mod.name}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed min-h-[40px]">{mod.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: PROFIL (Příprava do budoucna) */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Osobní údaje</h2>
                <p className="text-sm text-slate-400">Zde si budeš moci změnit fotku, e-mail a další detaily profilu.</p>
              </div>
              <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-3xl p-10 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">
                Připravujeme...
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}