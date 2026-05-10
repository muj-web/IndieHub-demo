'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle } from 'lucide-react';

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning';
};

type ConfirmContextType = (options: ConfirmOptions) => Promise<boolean>;

// Výchozí prázdná funkce
const ConfirmContext = createContext<ConfirmContextType>(() => Promise.resolve(false));

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  
  // Tohle je kouzlo, které "zastaví" kód, dokud uživatel neklikne
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const confirm = (opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    setIsOpen(true);
    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleConfirm = () => {
    if (resolver) resolver(true);
    setIsOpen(false);
  };

  const handleCancel = () => {
    if (resolver) resolver(false);
    setIsOpen(false);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AnimatePresence>
        {isOpen && options && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancel}
              className="absolute inset-0 bg-zinc-900/60 dark:bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-2xl text-center"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${options.type === 'warning' ? 'bg-amber-50 text-amber-500 dark:bg-amber-500/10' : 'bg-red-50 text-red-500 dark:bg-red-500/10'}`}>
                {options.type === 'warning' ? <AlertTriangle size={32} /> : <Trash2 size={32} />}
              </div>
              
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2 text-zinc-900 dark:text-white">
                {options.title || 'Odstranit záznam?'}
              </h3>
              
              <p className="text-zinc-500 dark:text-slate-400 text-sm mb-8 leading-relaxed whitespace-pre-line">
                {options.message}
              </p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleConfirm}
                  className={`w-full py-4 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] ${
                    options.type === 'warning' 
                      ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' 
                      : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                  }`}
                >
                  {options.confirmText || 'Ano, smazat'}
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full py-4 bg-zinc-50 dark:bg-slate-800 text-zinc-500 dark:text-slate-400 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:text-zinc-900 dark:hover:text-white transition-all"
                >
                  {options.cancelText || 'Zrušit'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}

// Hook, který budeme volat ve všech našich modulech
export const useConfirm = () => useContext(ConfirmContext);