'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function DemoPage() {
  const router = useRouter();

  useEffect(() => {
    const loginDemo = async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'demo@tvojeznacka.cz',
        password: 'demo123456',
      });

      if (!error) {
        // Po úspěšném přihlášení ho pošleme na hlavní dashboard
        router.push('/');
      } else {
        console.error('Chyba demo přihlášení:', error.message);
      }
    };

    loginDemo();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-xl font-bold text-white">Připravuji demo prostředí...</h1>
        <p className="text-slate-400 text-sm mt-2">Vteřinku, hned to bude.</p>
      </div>
    </div>
  );
}