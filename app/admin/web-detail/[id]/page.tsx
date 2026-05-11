'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Globe, Calendar, Clock, CheckCircle, AlertTriangle, 
  Save, Edit3, MonitorSmartphone, Key, ListTodo, Plus, Trash2,
  Mail, DollarSign, CalendarDays
} from 'lucide-react';

export default function WebDetail() {
  const params = useParams();
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Editovatelná pole (původní)
  const [description, setDescription] = useState('');
  const [credentials, setCredentials] = useState('');
  const [url, setUrl] = useState('');
  const [stagingUrl, setStagingUrl] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Editovatelná pole (NOVÁ)
  const [clientEmail, setClientEmail] = useState('');
  const [managementPrice, setManagementPrice] = useState<number | string>('');
  const [managementFrom, setManagementFrom] = useState('');
  const [managementTo, setManagementTo] = useState('');
  const [launchDate, setLaunchDate] = useState('');
  
  // Stavy ukládání
  const [savingDesc, setSavingDesc] = useState(false);
  const [savingCreds, setSavingCreds] = useState(false);
  const [savingUrls, setSavingUrls] = useState(false);
  const [savingAdmin, setSavingAdmin] = useState(false);

  const fetchProjectAndTasks = async () => {
    const { data: projData } = await supabase.from('projects').select('*').eq('id', params.id).single();
    const { data: tasksData } = await supabase.from('tasks').select('*').eq('project_id', params.id).order('created_at', { ascending: true });

    if (projData) {
      setProject(projData);
      setDescription(projData.description || '');
      setCredentials(projData.access_credentials || '');
      setUrl(projData.url || '');
      setStagingUrl(projData.staging_url || '');
      
      // Nastavení nových stavů z DB
      setClientEmail(projData.client_email || '');
      setManagementPrice(projData.management_price || '');
      setManagementFrom(projData.management_from || '');
      setManagementTo(projData.management_to || '');
      setLaunchDate(projData.launch_date || '');
    }
    if (tasksData) setTasks(tasksData);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjectAndTasks();
  }, [params.id]);

  const saveField = async (field: string, value: string | number | null, setSavingState: (s: boolean) => void) => {
    setSavingState(true);
    // Pokud je hodnota u datumu prázdná, pošleme do DB null
    const finalValue = value === '' && field.includes('date') ? null : value;
    await supabase.from('projects').update({ [field]: finalValue }).eq('id', project.id);
    setSavingState(false);
    fetchProjectAndTasks(); // Zajišťuje propis i do hlavičky
  };

  const updateStatus = async (newStatus: string) => {
    await supabase.from('projects').update({ status: newStatus }).eq('id', project.id);
    fetchProjectAndTasks(); 
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await supabase.from('tasks').insert([{ project_id: project.id, title: newTaskTitle }]);
    setNewTaskTitle('');
    fetchProjectAndTasks();
  };

  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    await supabase.from('tasks').update({ is_completed: !currentStatus }).eq('id', taskId);
    fetchProjectAndTasks();
  };

  const deleteTask = async (taskId: string) => {
    await supabase.from('tasks').delete().eq('id', taskId);
    fetchProjectAndTasks();
  };

  // --- POMOCNÁ FUNKCE PRO HEZKÝ FORMÁT ČASU ---
  const formatTime = (hoursFloat: number | null | undefined) => {
    if (!hoursFloat) return '00:00:00';
    const totalSeconds = Math.floor(hoursFloat * 3600);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="p-10 text-center text-zinc-500 dark:text-slate-400 min-h-screen bg-zinc-50 dark:bg-slate-950 font-sans transition-colors duration-500">Načítání detailu...</div>;
  if (!project) return <div className="p-10 text-center text-rose-500 dark:text-rose-400 min-h-screen bg-zinc-50 dark:bg-slate-950 font-sans transition-colors duration-500">Projekt nebyl nalezen.</div>;

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'rozpracovano': return 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30';
      case 'hotovo': return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30';
      case 'po_terminu': return 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30';
      default: return 'bg-zinc-100 dark:bg-slate-800 text-zinc-500 dark:text-slate-300 border-zinc-200 dark:border-slate-700';
    }
  };

  const progressPercentage = project.tasks_total > 0 ? (project.tasks_completed / project.tasks_total) * 100 : 0;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-slate-950 text-zinc-900 dark:text-slate-200 p-8 font-sans selection:bg-cyan-500/30 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        
        <Link href="/" className="inline-flex items-center text-zinc-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 text-sm font-bold uppercase tracking-widest transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Zpět na přehled
        </Link>

        {/* Hlavička */}
        <header className="bg-white dark:bg-slate-900/40 backdrop-blur-md p-8 rounded-3xl border border-zinc-200 dark:border-slate-800 mb-8 flex flex-col md:flex-row md:justify-between md:items-start gap-6 shadow-sm dark:shadow-none transition-colors duration-500">
          <div>
            <div className="min-w-0">
            <div className="mb-3">
              <span className={`w-fit text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border tracking-wider flex items-center gap-1.5 ${getStatusStyle(project.status)}`}>
                {project.status === 'rozpracovano' && <Clock className="w-3 h-3"/>}
                {project.status === 'po_terminu' && <AlertTriangle className="w-3 h-3"/>}
                {project.status === 'hotovo' && <CheckCircle className="w-3 h-3"/>}
                {project.status.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-slate-100 mb-3 break-words">
              {project.project_name}
            </h1>
              
            </div>
            <div className="flex flex-wrap items-center text-zinc-500 dark:text-slate-400 gap-6 text-sm font-medium">
              <span className="flex items-center"><MonitorSmartphone className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" /> Klient: <span className="text-zinc-700 dark:text-slate-200 ml-1">{project.client_name}</span></span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-cyan-500 dark:text-cyan-400" /> 
                Spuštění: <span className="text-zinc-700 dark:text-slate-200 ml-1">{project.launch_date ? new Date(project.launch_date).toLocaleDateString('cs-CZ') : 'Neurčeno'}</span>
              </span>
            </div>
          </div>
          
          <div className="md:text-right flex gap-6">
            <div>
              <div className="text-xs text-zinc-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">Strávený čas</div>
              <div className="text-3xl font-black text-zinc-800 dark:text-slate-200 font-mono tracking-tighter">
                {formatTime(project.time_spent)} 
                <span className="text-sm text-zinc-400 dark:text-slate-500 font-medium ml-2 tracking-normal font-sans">/ {project.time_estimated || 0}h</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEVÝ SLOUPEC: Zadání a Úkoly */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white dark:bg-slate-900/40 p-8 rounded-3xl border border-zinc-200 dark:border-slate-800 focus-within:border-cyan-400 dark:focus-within:border-cyan-500/50 shadow-sm dark:shadow-none transition-colors duration-500">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-slate-100 flex items-center">
                  <MonitorSmartphone className="w-5 h-5 mr-3 text-cyan-500 dark:text-cyan-400" /> Zadání projektu a poznámky
                </h2>
                {savingDesc && <span className="text-xs text-zinc-400 dark:text-slate-500 flex items-center"><Save className="w-3 h-3 mr-1 animate-pulse" /> Ukládám...</span>}
              </div>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => saveField('description', description, setSavingDesc)}
                placeholder="Zde si sepiš požadavky klienta, strukturu webu, nápady..."
                className="w-full min-h-[150px] bg-transparent text-zinc-700 dark:text-slate-300 placeholder-zinc-400 dark:placeholder-slate-600 outline-none resize-y leading-relaxed"
              />
            </section>

            <section className="bg-white dark:bg-slate-900/40 p-8 rounded-3xl border border-zinc-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors duration-500">
              <div className="flex justify-between items-end mb-6">
                <div className="w-full">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-slate-100 flex items-center mb-2">
                    <ListTodo className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400" /> Úkoly a milníky
                  </h2>
                  <div className="flex items-center gap-3 text-sm font-bold text-zinc-500 dark:text-slate-400">
                    <span>{project.tasks_completed} / {project.tasks_total} hotovo</span>
                    <div className="flex-grow max-w-xs bg-zinc-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {tasks.length === 0 ? (
                  <div className="text-sm text-zinc-400 dark:text-slate-500 italic p-4 bg-zinc-50 dark:bg-slate-900/50 rounded-xl border border-zinc-100 dark:border-slate-800/50">Zatím žádné úkoly.</div>
                ) : (
                  tasks.map(task => (
                    <div key={task.id} className={`flex items-center justify-between p-4 rounded-xl border transition-colors group ${task.is_completed ? 'bg-zinc-50 dark:bg-slate-900/20 border-zinc-200 dark:border-slate-800/50 opacity-60' : 'bg-white dark:bg-slate-800/40 border-zinc-200 dark:border-slate-700 hover:border-zinc-300 dark:hover:border-slate-600'}`}>
                      <label className="flex items-center gap-4 cursor-pointer flex-grow">
                        <input 
                          type="checkbox" 
                          checked={task.is_completed}
                          onChange={() => toggleTask(task.id, task.is_completed)}
                          className="w-5 h-5 rounded border-zinc-300 dark:border-slate-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500/50 bg-white dark:bg-slate-900 cursor-pointer"
                        />
                        <span className={`font-medium ${task.is_completed ? 'line-through text-zinc-400 dark:text-slate-500' : 'text-zinc-700 dark:text-slate-200'}`}>
                          {task.title}
                        </span>
                      </label>
                      <button onClick={() => deleteTask(task.id)} className="text-zinc-400 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={addTask} className="relative">
                <input 
                  type="text" 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Přidat nový úkol (např. Nasadit Google Analytics)..."
                  className="w-full bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm text-zinc-900 dark:text-slate-200 placeholder-zinc-400 dark:placeholder-slate-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-colors"
                />
                <button type="submit" disabled={!newTaskTitle.trim()} className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:bg-zinc-200 dark:disabled:bg-slate-800 disabled:text-zinc-400 dark:disabled:text-slate-600 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            </section>
          </div>

          {/* PRAVÝ SLOUPEC: Odkazy a Přístupy */}
          <div className="space-y-6">
            
            {/* Administrativa a Správa */}
            <div className="bg-white dark:bg-slate-900/40 p-6 rounded-3xl border border-zinc-200 dark:border-slate-800 focus-within:border-cyan-400 dark:focus-within:border-cyan-500/50 shadow-sm dark:shadow-none transition-colors duration-500">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-slate-500 flex items-center">
                  <CalendarDays className="w-4 h-4 mr-2" /> Administrativa
                </h3>
                {savingAdmin && <span className="text-xs text-zinc-400 dark:text-slate-500 animate-pulse"><Save className="w-3 h-3" /></span>}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-zinc-400 dark:text-slate-400 flex items-center gap-1.5 uppercase tracking-wider mb-1.5 block">
                    <Mail className="w-3 h-3" /> E-mail klienta
                  </label>
                  <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} onBlur={() => saveField('client_email', clientEmail, setSavingAdmin)} placeholder="klient@email.cz" className="w-full bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-slate-300 outline-none focus:border-cyan-500/50 transition-colors" />
                </div>
                
                <div>
                  <label className="text-[10px] font-black text-zinc-400 dark:text-slate-400 flex items-center gap-1.5 uppercase tracking-wider mb-1.5 block">
                    <Calendar className="w-3 h-3" /> Datum spuštění webu
                  </label>
                  <input type="date" value={launchDate} onChange={(e) => setLaunchDate(e.target.value)} onBlur={() => saveField('launch_date', launchDate, setSavingAdmin)} className="w-full bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-slate-300 outline-none focus:border-cyan-500/50 transition-colors [color-scheme:light] dark:[color-scheme:dark]" />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-100 dark:border-slate-800">
                  <div>
                    <label className="text-[10px] font-black text-cyan-600 dark:text-cyan-500/70 uppercase tracking-wider mb-1.5 block">Správa OD</label>
                    <input type="date" value={managementFrom} onChange={(e) => setManagementFrom(e.target.value)} onBlur={() => saveField('management_from', managementFrom, setSavingAdmin)} className="w-full bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-slate-300 outline-none focus:border-cyan-500/50 transition-colors [color-scheme:light] dark:[color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-cyan-600 dark:text-cyan-500/70 uppercase tracking-wider mb-1.5 block">Správa DO</label>
                    <input type="date" value={managementTo} onChange={(e) => setManagementTo(e.target.value)} onBlur={() => saveField('management_to', managementTo, setSavingAdmin)} className="w-full bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-slate-300 outline-none focus:border-cyan-500/50 transition-colors [color-scheme:light] dark:[color-scheme:dark]" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-zinc-400 dark:text-slate-400 flex items-center gap-1.5 uppercase tracking-wider mb-1.5 block">
                    <DollarSign className="w-3 h-3" /> Cena za správu (CZK)
                  </label>
                  <input type="number" value={managementPrice} onChange={(e) => setManagementPrice(e.target.value)} onBlur={() => saveField('management_price', Number(managementPrice), setSavingAdmin)} placeholder="0" className="w-full bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-slate-300 outline-none focus:border-cyan-500/50 transition-colors" />
                </div>
              </div>
            </div>

            {/* Odkazy */}
            <div className="bg-white dark:bg-slate-900/40 p-6 rounded-3xl border border-zinc-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors duration-500">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-slate-500 flex items-center">
                  <Globe className="w-4 h-4 mr-2" /> Odkazy
                </h3>
                {savingUrls && <span className="text-xs text-zinc-400 dark:text-slate-500 animate-pulse">Ukládám...</span>}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-cyan-600 dark:text-cyan-500/70 uppercase tracking-wider mb-1.5 block">Staging (Pro klienta)</label>
                  <input type="url" value={stagingUrl} onChange={(e) => setStagingUrl(e.target.value)} onBlur={() => saveField('staging_url', stagingUrl, setSavingUrls)} placeholder="https://dev.tvujweb.cz/..." className="w-full bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-slate-300 outline-none focus:border-cyan-500/50 transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-emerald-600 dark:text-emerald-500/70 uppercase tracking-wider mb-1.5 block">Ostrá doména</label>
                  <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} onBlur={() => saveField('url', url, setSavingUrls)} placeholder="https://klientsky-web.cz" className="w-full bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-slate-300 outline-none focus:border-cyan-500/50 transition-colors" />
                </div>
              </div>
            </div>

            {/* Přístupy a hesla */}
            <div className="bg-white dark:bg-slate-900/40 p-6 rounded-3xl border border-zinc-200 dark:border-slate-800 focus-within:border-purple-400 dark:focus-within:border-purple-500/50 shadow-sm dark:shadow-none transition-colors duration-500">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-slate-500 flex items-center">
                  <Key className="w-4 h-4 mr-2" /> Přístupy (Trezor)
                </h3>
                {savingCreds && <span className="text-xs text-zinc-400 dark:text-slate-500 animate-pulse"><Save className="w-3 h-3" /></span>}
              </div>
              <textarea 
                value={credentials}
                onChange={(e) => setCredentials(e.target.value)}
                onBlur={() => saveField('access_credentials', credentials, setSavingCreds)}
                placeholder="WP Admin: admin / heslo123&#10;FTP: user / heslo456..."
                className="w-full min-h-[120px] bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-slate-700 rounded-xl p-4 text-sm text-zinc-900 dark:text-slate-300 placeholder-zinc-400 dark:placeholder-slate-600 outline-none resize-y font-mono transition-colors"
              />
            </div>

            {/* Změna statusu projektu */}
            <div className="bg-white dark:bg-slate-900/40 p-6 rounded-3xl border border-zinc-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors duration-500">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-slate-500 mb-4 flex items-center">
                <Clock className="w-4 h-4 mr-2" /> Stav projektu
              </h3>
              <div className="space-y-2">
                {[
                  { id: 'rozpracovano', label: 'Rozpracováno' },
                  { id: 'hotovo', label: 'Dokončeno' },
                  { id: 'po_terminu', label: 'Po termínu' }
                ].map((status) => (
                  <button
                    key={status.id}
                    onClick={() => updateStatus(status.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-between ${
                      project.status === status.id 
                        ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30' 
                        : 'bg-zinc-50 dark:bg-slate-900/50 text-zinc-600 dark:text-slate-400 hover:bg-zinc-100 dark:hover:bg-slate-800 border border-transparent'
                    }`}
                  >
                    {status.label}
                    {project.status === status.id && <CheckCircle className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            <Link href={`/upravit-web/${project.id}`} className="flex items-center justify-center gap-2 w-full px-4 py-4 bg-zinc-100 dark:bg-slate-800 text-zinc-700 dark:text-slate-300 hover:text-zinc-900 dark:hover:text-white rounded-xl font-bold hover:bg-zinc-200 dark:hover:bg-slate-700 transition-colors border border-zinc-200 dark:border-slate-700 mt-6 shadow-sm dark:shadow-none">
              <Edit3 className="w-4 h-4" /> Upravit parametry projektu
            </Link>

          </div>
        </div>
      </div>
    </main>
  );
}