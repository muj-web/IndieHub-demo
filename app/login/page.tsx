'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Chyba při přihlášení: ' + error.message);
    } else {
      router.push('/admin');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-slate-950 p-6 transition-colors duration-500">
      <div className="w-full max-w-md">
        <form 
          onSubmit={handleLogin} 
          className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl dark:shadow-none border border-zinc-100 dark:border-slate-800 transition-colors duration-500"
        >
          <div className="flex flex-col items-center mb-10">
             <div className="w-16 h-16 bg-purple-50 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-100 dark:border-purple-500/20">
                <Lock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
             </div>
             <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white text-center">Admin Přihlášení</h1>
             <p className="text-zinc-500 dark:text-slate-400 text-sm mt-2">Vítejte zpět v Chameleon OS</p>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-slate-500 ml-1 mb-2 block tracking-widest">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  type="email" 
                  placeholder="vas@email.cz" 
                  className="w-full bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-purple-500 dark:focus:border-purple-500 text-zinc-900 dark:text-white transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-slate-500 ml-1 mb-2 block tracking-widest">Heslo</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-purple-500 dark:focus:border-purple-500 text-zinc-900 dark:text-white transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-zinc-900 dark:bg-purple-600 text-white py-4 rounded-2xl uppercase tracking-widest text-[10px] font-black hover:bg-purple-600 dark:hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/10 flex items-center justify-center gap-3 mt-4"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Ověřuji...</>
              ) : (
                'Vstoupit do administrace'
              )}
            </button>
          </div>
        </form>
        
        <p className="text-center mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-slate-600">
          Chameleon Engine Flow v1.0
        </p>
      </div>
    </div>
  );
}