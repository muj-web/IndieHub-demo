"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowDown, Trash2, Save, Palette, Type as TypeIcon, Image as ImageIcon, Plus, Layers } from "lucide-react";
import { COMPONENT_SCHEMAS, ComponentField } from "@/lib/component-schemas";

interface BuilderSectionCardProps {
  section: any;
  index: number;
  availableComponents: { id: string; name: string }[];
  accentColor: string;
  onUpdateVariant: (sectionId: string, newVariant: string) => void;
  onSave: (sectionId: string, content: any) => void;
  onDelete: () => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
}

export default function BuilderSectionCard({
  section,
  index,
  availableComponents,
  accentColor,
  onUpdateVariant,
  onSave,
  onDelete,
  onMove,
}: BuilderSectionCardProps) {
  const [activeTab, setActiveTab] = useState<'design' | 'content'>('design');
  const [localContent, setLocalContent] = useState<any>(section.content_data || {});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalContent(section.content_data || {});
    setHasChanges(false);
  }, [section.content_data]);

  // --- FUNKCE PRO ZÁKLADNÍ POLÍČKA ---
  const updateContent = (key: string, value: any) => {
    setLocalContent((prev: any) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  // --- FUNKCE PRO REPEATER (Pole karet / služeb) ---
  const addRepeaterItem = (arrayName: string, subFields: ComponentField[]) => {
    const currentArray = localContent[arrayName] || [];
    const newItem: any = {};
    
    subFields.forEach(f => {
      if (f.type === 'select' && f.options && f.options.length > 0) {
        newItem[f.name] = f.options[1].value;
      } else {
        newItem[f.name] = '';
      }
    }); 
    
    updateContent(arrayName, [...currentArray, newItem]);
  };

  const updateRepeaterItem = (arrayName: string, index: number, fieldName: string, value: any) => {
    const currentArray = [...(localContent[arrayName] || [])];
    currentArray[index] = { ...currentArray[index], [fieldName]: value };
    updateContent(arrayName, currentArray);
  };

  const removeRepeaterItem = (arrayName: string, index: number) => {
    const currentArray = localContent[arrayName] || [];
    const newArray = currentArray.filter((_: any, i: number) => i !== index);
    updateContent(arrayName, newArray);
  };

  const handleSave = () => {
    onSave(section.id, localContent);
  };

  const currentSchema = COMPONENT_SCHEMAS[section.component_type] || [];

  return (
    <motion.div layout className="w-full relative group">
      <div className="bg-white border border-zinc-200 rounded-[2rem] shadow-sm flex flex-col overflow-hidden">
        
        {/* --- HEADER KARTY --- */}
        <div className="p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-50 border-b border-zinc-200">
          <div className="flex items-center gap-4 w-full">
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center font-black text-zinc-400 border border-zinc-200 shrink-0">
              {index + 1}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: accentColor }}>
                {section.component_type.split('-')[0]}
              </p>
              <select 
                value={section.component_type} 
                onChange={(e) => onUpdateVariant(section.id, e.target.value)} 
                className="appearance-none bg-transparent text-lg font-bold uppercase cursor-pointer focus:outline-none text-zinc-900"
              >
                {availableComponents
                  .filter(c => c.id.startsWith(section.component_type.split('-')[0] + '-'))
                  .map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                }
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-1 border-r border-zinc-200 pr-2 mr-2">
              <button onClick={() => onMove(index, 'up')} className="p-2 text-zinc-400 hover:text-zinc-900 bg-white border border-zinc-200 rounded-xl transition-colors"><ArrowUp size={16} /></button>
              <button onClick={() => onMove(index, 'down')} className="p-2 text-zinc-400 hover:text-zinc-900 bg-white border border-zinc-200 rounded-xl transition-colors"><ArrowDown size={16} /></button>
            </div>
            <button onClick={onDelete} className="p-2.5 bg-red-50 border border-red-100 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={18} /></button>
            
            <AnimatePresence>
              {hasChanges && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleSave} 
                  className="p-2.5 bg-green-50 border border-green-100 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition-all shadow-sm"
                >
                  <Save size={18} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* --- TĚLO KARTY --- */}
        <div className="bg-white flex-1 p-6">
          <div className="flex gap-6 border-b border-zinc-200 mb-6">
            <button onClick={() => setActiveTab('design')} className={`pb-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'design' ? 'border-purple-600 text-purple-600' : 'border-transparent text-zinc-400 hover:text-zinc-700'}`}>Vzhled</button>
            <button onClick={() => setActiveTab('content')} className={`pb-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'content' ? 'border-purple-600 text-purple-600' : 'border-transparent text-zinc-400 hover:text-zinc-700'}`}>Obsah a Texty</button>
          </div>

          {activeTab === 'design' ? (
            /* ZÁLOŽKA VZHLED */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-bold uppercase text-zinc-500">Zarovnání</label>
                <select value={localContent.align || 'center'} onChange={(e) => updateContent('align', e.target.value)} className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-purple-600">
                  <option value="left">Doleva</option><option value="center">Na střed</option><option value="right">Doprava</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-bold uppercase text-zinc-500">Typ pozadí</label>
                <select value={localContent.bg_type || 'none'} onChange={(e) => updateContent('bg_type', e.target.value)} className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-purple-600">
                  <option value="none">Čisté</option><option value="gradient">Gradient</option><option value="image">Obrázek</option><option value="video">Video</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 md:col-span-2 mt-2 border-b border-zinc-100 pb-4 mb-2">
                <label className="text-[9px] font-bold uppercase text-zinc-500 flex items-center gap-1"><ImageIcon size={12}/> URL Pozadí (Obrázek/Video)</label>
                <input type="text" placeholder="https://..." value={localContent.bg_src || ''} onChange={(e) => updateContent('bg_src', e.target.value)} className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs outline-none w-full focus:border-purple-600 font-mono" />
              </div>

              {/* --- NOVÉ: DYNAMICKÁ POLE ZE SCHÉMATU PRO VZHLED --- */}
              {currentSchema.filter((f) => f.tab === 'design').map((field) => {
                if (field.type === 'select' && field.options) {
                  return (
                    <div key={field.name} className="flex flex-col gap-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">{field.label}</label>
                      <select
                        value={localContent[field.name] || field.options[0].value}
                        onChange={(e) => updateContent(field.name, e.target.value)}
                        className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-600 font-medium cursor-pointer"
                      >
                        <option value="" disabled>Vyberte...</option>
                        {field.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ) : (
            /* ZÁLOŽKA OBSAH */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentSchema.length === 0 ? (
                <div className="md:col-span-2 p-8 text-center border-2 border-dashed rounded-2xl text-zinc-400 text-sm font-mono">
                  Schema "{section.component_type}" zatím nebylo definováno v component-schemas.ts
                </div>
              ) : (
                /* TADY JE PŘIDANÝ TEN FILTER, ABY SE V TEXTECH NEUKAZOVAL VZHLED */
                currentSchema.filter((f) => f.tab !== 'design').map((field) => {
                  
                  if (field.type === 'string') {
                    return (
                      <div key={field.name} className="flex flex-col gap-2">
                        <label className="text-[9px] font-bold uppercase text-zinc-500">{field.label}</label>
                        <input 
                          type="text" 
                          value={localContent[field.name] || ''} 
                          onChange={(e) => updateContent(field.name, e.target.value)} 
                          className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-600 font-medium" 
                        />
                      </div>
                    );
                  }

                  if (field.type === 'textarea') {
                    return (
                      <div key={field.name} className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[9px] font-bold uppercase text-zinc-500">{field.label}</label>
                        <textarea 
                          rows={3} 
                          value={localContent[field.name] || ''} 
                          onChange={(e) => updateContent(field.name, e.target.value)} 
                          className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-600 resize-y" 
                        />
                      </div>
                    );
                  }

                  if (field.type === 'select' && field.options) {
                    return (
                      <div key={field.name} className="flex flex-col gap-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">{field.label}</label>
                        <select
                          value={localContent[field.name] || field.options[0].value}
                          onChange={(e) => updateContent(field.name, e.target.value)}
                          className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-600 font-medium cursor-pointer"
                        >
                          <option value="" disabled>Vyberte...</option>
                          {field.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    );
                  }

                  if (field.type === 'repeater' && field.subFields) {
                    const items = localContent[field.name] || [];
                    
                    return (
                      <div key={field.name} className="md:col-span-2 p-4 border border-zinc-200 rounded-2xl bg-zinc-50/50">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-900 block mb-4 flex items-center gap-2">
                          <Layers size={14} style={{ color: accentColor }}/> {field.label}
                        </label>
                        
                        <div className="space-y-4 mb-4">
                          {items.map((item: any, idx: number) => (
                            <div key={idx} className="bg-white border border-zinc-200 rounded-xl p-4 relative group">
                              <button 
                                onClick={() => removeRepeaterItem(field.name, idx)}
                                className="absolute -top-3 -right-3 w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center border border-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Smazat položku"
                              >
                                <Trash2 size={14} />
                              </button>
                              
                              <div className="grid gap-3">
                                {field.subFields!.map(sub => (
                                  <div key={sub.name} className="flex flex-col gap-1">
                                    <label className="text-[9px] font-bold uppercase text-zinc-400">{sub.label}</label>
                                    {sub.type === 'select' ? (
                                      <select
                                        value={item[sub.name] || '1'}
                                        onChange={(e) => updateRepeaterItem(field.name, idx, sub.name, e.target.value)}
                                        className="bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-600 cursor-pointer"
                                      >
                                        <option value="" disabled>Vyberte velikost...</option>
                                        {sub.options?.map(opt => (
                                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                      </select>
                                    ) : sub.type === 'textarea' ? (
                                      <textarea 
                                        rows={2}
                                        value={item[sub.name] || ''} 
                                        onChange={(e) => updateRepeaterItem(field.name, idx, sub.name, e.target.value)}
                                        className="bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-600"
                                      />
                                    ) : (
                                      <input 
                                        type="text" 
                                        value={item[sub.name] || ''} 
                                        onChange={(e) => updateRepeaterItem(field.name, idx, sub.name, e.target.value)}
                                        className="bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-600"
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <button 
                          onClick={() => addRepeaterItem(field.name, field.subFields!)}
                          className="w-full py-3 border-2 border-dashed border-zinc-300 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:border-purple-500 hover:text-purple-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus size={14} /> Přidat položku
                        </button>
                      </div>
                    );
                  }

                  return null;
                })
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}