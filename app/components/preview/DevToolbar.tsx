"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, CheckCircle2, Clock, ChevronDown, Circle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function DevToolbar() {
  const pathname = usePathname();
  const [projectData, setProjectData] = useState<any>(null);
  const [status, setStatus] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false); // Nový stav pro rozbalení

  useEffect(() => {
    const slug = pathname.split('/').filter(Boolean)[0];
    if (slug) fetchProject(slug);
  }, [pathname]);

  async function fetchProject(slug: string) {
    const { data } = await supabase
      .from('client_projects')
      .select('*, project_tasks(*)')
      .eq('slug', slug)
      .single();

    if (data) {
      const tasks = data.project_tasks || [];
      // Seřadíme úkoly tak, jak byly vytvořeny
      tasks.sort((a: any, b: any) => a.order_index - b.order_index); 
      
      const completedTasks = tasks.filter((t: any) => t.is_completed).length;
      const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
      
      setProjectData({ ...data, project_tasks: tasks });
      setStatus(progress);
    }
  }

  if (!projectData) return null;

  // Tady taháme tvoji barvu z databáze (pokud tam není, dáme defaultní žlutou)
  const accentColor = projectData.accent_color || "#EAB308"; 

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-3xl flex flex-col gap-2"
      >
        {/* ROZBALOVACÍ SEZNAM ÚKOLŮ (Zobrazí se nad lištou) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: 20 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: 20 }}
              className="bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6">
                <h5 className="text-white text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
                  <span style={{ color: accentColor }}>Fáze projektu:</span> {projectData.current_phase}
                </h5>
                <div className="flex flex-col gap-4">
                  {projectData.project_tasks.length === 0 && (
                    <p className="text-zinc-500 text-xs italic">Zatím nebyly zadány žádné úkoly.</p>
                  )}
                  {projectData.project_tasks.map((task: any) => (
                    <div key={task.id} className="flex items-center gap-4">
                      {task.is_completed ? (
                        <CheckCircle2 className="w-5 h-5" style={{ color: accentColor }} />
                      ) : (
                        <Circle className="w-5 h-5 text-zinc-600" />
                      )}
                      <span className={`text-sm font-medium ${task.is_completed ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                        {task.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HLAVNÍ LIŠTA */}
        <div className="bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-6">
          
          {/* Tlačítko pro rozbalení (levá část) */}
          <div 
            className="flex items-center gap-4 cursor-pointer group select-none" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-105"
              // Dynamická barva z DB (1A je 10% průhlednost, 33 je 20% průhlednost pro rámeček)
              style={{ backgroundColor: `${accentColor}1A`, border: `1px solid ${accentColor}33` }} 
            >
              {isExpanded ? (
                <ChevronDown className="w-5 h-5" style={{ color: accentColor }} />
              ) : (
                <Settings className="w-5 h-5 animate-spin-slow" style={{ color: accentColor }} />
              )}
            </div>
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest group-hover:text-white transition-colors">
                {projectData.client_name} — Preview
              </h4>
              <p className="text-zinc-400 text-[10px] font-medium uppercase tracking-wider flex items-center gap-2 transition-colors" style={{ color: isExpanded ? accentColor : '' }}>
                <Clock className="w-3 h-3" /> {isExpanded ? "Zavřít detail" : "Zobrazit úkoly"}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex-grow max-w-xs hidden md:block">
            <div className="flex justify-between mb-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Dokončeno</span>
              <span className="text-[10px] font-bold uppercase" style={{ color: accentColor }}>{status}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${status}%` }}
                className="h-full"
                // Dynamická barva i neonový stín
                style={{ 
                  backgroundColor: accentColor,
                  boxShadow: `0 0 10px ${accentColor}80` 
                }}
              />
            </div>
          </div>

          {/* Akce */}
          <button 
            className="px-6 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-2"
            style={{ backgroundColor: 'white', color: 'black' }}
            // Hover efekt pro inline styl barvu
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = accentColor;
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = 'black';
            }}
          >
            <CheckCircle2 className="w-4 h-4" /> Schválit
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}