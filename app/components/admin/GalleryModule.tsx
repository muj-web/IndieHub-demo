'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FolderPlus, Upload, HardDrive } from 'lucide-react';

export default function GalleryModule() {
  const [rootSection, setRootSection] = useState('blog');
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [filesInFolder, setFilesInFolder] = useState<any[]>([]);

  const fetchFolders = async (section: string) => {
    const { data, error } = await supabase.storage.from('galleries').list(section, {
      limit: 100,
    });
    if (data) {
      const folderNames = data.map(item => item.name).filter(name => !name.includes('.'));
      setFolders(folderNames);
      setSelectedFolder(null);
      setFilesInFolder([]);
    }
  };

  useEffect(() => {
    fetchFolders(rootSection);
  }, [rootSection]);

  const fetchFiles = async (folder: string) => {
    const { data } = await supabase.storage.from('galleries').list(`${rootSection}/${folder}`);
    if (data) setFilesInFolder(data.filter(f => f.name !== '.emptyFolderPlaceholder'));
  };

  const createFolder = async () => {
    if (!newFolderName) return;
    const { error } = await supabase.storage
      .from('galleries')
      .upload(`${rootSection}/${newFolderName}/.emptyFolderPlaceholder`, new Blob(['']));

    if (!error) {
      setNewFolderName('');
      fetchFolders(rootSection);
    } else {
      alert(error.message);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !selectedFolder) return;
    setUploading(true);

    const files = Array.from(e.target.files);
    for (const file of files) {
      const fileName = `${Date.now()}-${file.name}`;
      await supabase.storage
        .from('galleries')
        .upload(`${rootSection}/${selectedFolder}/${fileName}`, file);
    }

    setUploading(false);
    fetchFiles(selectedFolder);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-extrabold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">
            Správce galerií
          </h1>
          <p className="text-zinc-500 dark:text-slate-400 text-sm font-medium">Nahrávání fotek k blogu a portfoliu.</p>
        </div>

        <div className="flex bg-white dark:bg-slate-900/40 p-1.5 rounded-2xl shadow-sm border border-zinc-200 dark:border-slate-800 w-full md:w-auto overflow-x-auto">
          {[
            { id: 'blog', label: 'Deník' },
            { id: 'svatebni-pribehy', label: 'Svatby' },
            { id: 'fotogalerie', label: 'Portfolio' }
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setRootSection(sec.id)}
              className={`px-6 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all whitespace-nowrap ${
                rootSection === sec.id ? 'bg-zinc-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-zinc-500 dark:text-slate-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEVÝ PANEL - Složky */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900/40 p-6 rounded-3xl shadow-sm border border-zinc-200 dark:border-slate-800">
            <h2 className="text-lg font-bold mb-4 capitalize text-zinc-900 dark:text-white">{rootSection.replace('-', ' ')}</h2>
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Nová složka..."
                className="flex-grow bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-teal-500 text-zinc-900 dark:text-white transition-colors"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
              <button onClick={createFolder} className="p-2 bg-teal-600 text-white rounded-xl hover:bg-teal-500 transition-colors">
                <FolderPlus size={20} />
              </button>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {folders.length > 0 ? folders.map(folder => (
                <button
                  key={folder}
                  onClick={() => { setSelectedFolder(folder); fetchFiles(folder); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    selectedFolder === folder
                      ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/30'
                      : 'text-zinc-600 dark:text-slate-400 hover:bg-zinc-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {folder}
                </button>
              )) : (
                <p className="text-xs text-zinc-400 dark:text-slate-500 text-center py-8 italic">Žádné složky v této sekci</p>
              )}
            </div>
          </div>
        </div>

        {/* PRAVÝ PANEL - Fotky */}
        <div className="lg:col-span-8">
          {selectedFolder ? (
            <div className="bg-white dark:bg-slate-900/40 p-8 rounded-[2.5rem] shadow-sm border border-zinc-200 dark:border-slate-800 min-h-[500px]">
              <div className="flex justify-between items-center mb-8 border-b border-zinc-100 dark:border-slate-800/50 pb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-teal-600 dark:text-teal-400 font-bold">{rootSection}</span>
                  <h2 className="text-2xl font-black text-zinc-900 dark:text-white">{selectedFolder}</h2>
                </div>
                <label className="cursor-pointer bg-teal-600 text-white px-6 py-3 rounded-xl text-[10px] uppercase font-bold tracking-widest hover:bg-teal-500 transition-all flex items-center gap-2 shadow-lg shadow-teal-500/20">
                  <Upload size={16} /> {uploading ? 'Nahrávám...' : 'Přidat fotky'}
                  <input type="file" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filesInFolder.map(file => (
                  <div key={file.name} className="relative aspect-square bg-zinc-100 dark:bg-slate-800 rounded-2xl overflow-hidden group">
                    <img
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/galleries/${rootSection}/${selectedFolder}/${file.name}`}
                      alt="Uploaded media"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
              {filesInFolder.length === 0 && !uploading && (
                 <div className="text-center py-20 text-zinc-400 dark:text-slate-500 italic text-sm">
                   Složka je prázdná.
                 </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-slate-600 border-2 border-dashed border-zinc-200 dark:border-slate-800 rounded-[2.5rem] bg-white/50 dark:bg-slate-900/20 py-32">
              <HardDrive size={48} strokeWidth={1} className="mb-4" />
              <p className="font-bold text-lg">Vyberte složku ze seznamu vlevo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}