'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Lock, UserPlus } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Přepínač pro demo
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isRegistering) {
      // REGISTRACE NOVÉHO UŽIVATELE (DEMO)
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError('Chyba registrace: ' + error.message);
      } else {
        // Pokud máš v Supabase vypnuté "Confirm Email", tohle ho rovnou přihlásí
        window.location.href = '/';
      }
    } else {
      // BĚŽNÉ PŘIHLÁŠENÍ
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError('Špatný e-mail nebo heslo.');
      } else {
        window.location.href = '/';
      }
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 font-sans selection:bg-amber-500/30">
      <div className="w-full max-w-md bg-slate-900/50 p-8 rounded-3xl border border-slate-800 shadow-2xl">
        
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
            {isRegistering ? <UserPlus className="w-8 h-8 text-emerald-500" /> : <Lock className="w-8 h-8 text-amber-500" />}
          </div>
        </div>
        
        <h1 className="text-3xl font-black text-center text-slate-100 mb-2 tracking-tight">PROJECT<span className={isRegistering ? "text-emerald-500 italic" : "text-amber-500 italic"}>OS</span></h1>
        <p className="text-center text-slate-400 text-sm font-medium mb-8">
          {isRegistering ? 'Vytvořte si účet pro přístup k demu' : 'Přihlaste se pro přístup k datům'}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm rounded-xl text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 ml-1 block mb-1.5">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-amber-500 outline-none text-slate-200 transition-colors"
              placeholder="demo@email.cz"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 ml-1 block mb-1.5">Heslo (min. 6 znaků)</label>
            <input 
              type="password" 
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-amber-500 outline-none text-slate-200 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full text-white p-4 rounded-xl font-black uppercase tracking-widest transition-colors disabled:opacity-50 mt-4 shadow-lg ${
              isRegistering 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20' 
                : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-500/20'
            }`}
          >
            {loading ? 'Zpracovávám...' : (isRegistering ? 'Vytvořit Demo Účet' : 'Vstoupit do systému')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
            className="text-xs font-bold text-slate-500 hover:text-white transition-colors underline underline-offset-4"
          >
            {isRegistering ? 'Už máte účet? Přihlaste se zde.' : 'Chcete si vyzkoušet demo? Zaregistrujte se.'}
          </button>
        </div>
      </div>
    </main>
  );
}