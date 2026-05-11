'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { FolderPlus, Upload, Image as ImageIcon, ChevronLeft, Loader2, HardDrive } from 'lucide-react';
import Link from 'next/link';

export default function GalleryAdmin() {
  // Přidáme stav pro výběr hlavní sekce
  const [rootSection, setRootSection] = useState('blog'); 
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [filesInFolder, setFilesInFolder] = useState<any[]>([]);

  // Načítání složek podle vybrané sekce (blog / svatebni-pribehy / fotogalerie)
  const fetchFolders = async (section: string) => {
    const { data, error } = await supabase.storage.from('galleries').list(section, {
      limit: 100,
    });
    if (data) {
      const folderNames = data.map(item => item.name).filter(name => !name.includes('.'));
      setFolders(folderNames);
      setSelectedFolder(null); // Reset výběru při změně sekce
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
    <div className="min-h-screen bg-[#F7F4EF] p-8 md:p-16">
      <Link href="/admin" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold mb-12 hover:text-[#B09B84] transition-colors">
        <ChevronLeft size={16} /> Zpět do dashboardu
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <h1 className="font-serif text-4xl">Správce galerií</h1>
        
        {/* PŘEPÍNAČ SEKCI */}
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-black/5">
          {[
            { id: 'blog', label: 'Deník' },
            { id: 'svatebni-pribehy', label: 'Svatby' },
            { id: 'fotogalerie', label: 'Portfolio' }
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setRootSection(sec.id)}
              className={`px-6 py-2 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all ${
                rootSection === sec.id ? 'bg-[#1A1A1A] text-white shadow-md' : 'text-black/40 hover:text-black'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEVÝ PANEL */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5">
            <h2 className="font-serif text-xl mb-4 italic capitalize">{rootSection.replace('-', ' ')}</h2>
            <div className="flex gap-2 mb-6">
              <input 
                type="text" 
                placeholder="Nová složka..."
                className="flex-grow border-b border-black/10 text-sm py-2 outline-none focus:border-[#B09B84]"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
              <button onClick={createFolder} className="p-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#B09B84] transition-colors">
                <FolderPlus size={18} />
              </button>
            </div>
            
            <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
              {folders.length > 0 ? folders.map(folder => (
                <button 
                  key={folder}
                  onClick={() => { setSelectedFolder(folder); fetchFiles(folder); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${selectedFolder === folder ? 'bg-[#F7F4EF] font-bold border-l-4 border-[#B09B84]' : 'hover:bg-[#F7F4EF]/50'}`}
                >
                  {folder}
                </button>
              )) : (
                <p className="text-xs text-black/20 text-center py-8 italic">Žádné složky v této sekci</p>
              )}
            </div>
          </div>
        </div>

        {/* PRAVÝ PANEL */}
        <div className="lg:col-span-8">
          {selectedFolder ? (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-black/5 min-h-[500px]">
              <div className="flex justify-between items-center mb-8 border-b border-black/5 pb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#B09B84] font-bold">{rootSection}</span>
                  <h2 className="font-serif text-2xl">{selectedFolder}</h2>
                </div>
                <label className="cursor-pointer bg-[#1A1A1A] text-white px-6 py-3 rounded-xl text-[10px] uppercase font-bold tracking-widest hover:bg-[#B09B84] transition-all flex items-center gap-2">
                  <Upload size={14} /> {uploading ? 'Nahrávám...' : 'Přidat fotky'}
                  <input type="file" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filesInFolder.map(file => (
                  <div key={file.name} className="relative aspect-square bg-[#F7F4EF] rounded-xl overflow-hidden group">
                    <img 
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/galleries/${rootSection}/${selectedFolder}/${file.name}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-black/10 border-2 border-dashed border-black/5 rounded-[2.5rem] bg-white/50 py-32">
              <HardDrive size={48} strokeWidth={1} className="mb-4" />
              <p className="font-serif text-xl">Vyberte složku ze seznamu vlevo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}