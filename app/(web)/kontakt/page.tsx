'use client';

import { useState } from 'react';
import { sendContactInquiry } from '@/app/actions/send-email';
// Odstraněny chybějící značky, nechali jsme jen Mail a MapPin
import { Mail, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(formData: FormData) {
    setStatus('loading');
    const result = await sendContactInquiry(formData);
    if (result.success) setStatus('success');
    else setStatus('error');
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-32 pb-24 text-[#1A1A1A]">
      <div className="max-w-[1200px] mx-auto px-6">
        
        <header className="text-center mb-24">
          <span className="text-[#B09B84] uppercase tracking-[0.3em] text-[10px] font-bold block mb-6">Spojme se</span>
          <h1 className="font-serif text-5xl md:text-7xl font-light mb-8 text-[#1A1A1A]">Kontakt</h1>
          <p className="text-[#1A1A1A]/60 font-light max-w-2xl mx-auto leading-relaxed">
            Ať už plánujete svatbu, firemní focení nebo potřebujete nový web, 
            napište mi. Rád s vámi vše proberu.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* KONTAKTNÍ ÚDAJE */}
          <div className="lg:col-span-5 space-y-16">
            <div>
              <h3 className="font-serif text-2xl mb-8">Spojení</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center text-[#B09B84] shrink-0 shadow-sm">
                    <Mail size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-30 block mb-1">Email</span>
                    <a href="mailto:jsem@radekcech.cz" className="text-lg font-light hover:text-[#B09B84] transition-colors">jsem@radekcech.cz</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center text-[#B09B84] shrink-0 shadow-sm">
                    <MapPin size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-30 block mb-1">Působnost</span>
                    <p className="text-lg font-light">Brno, Vysočina & celá ČR</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-2xl mb-8">Sociální sítě</h3>
              {/* Zde jsou místo zrušených ikon elegantní textové odkazy */}
              <div className="flex flex-wrap gap-6">
                {[
                  { name: 'Instagram', url: 'https://www.instagram.com/radek_cech/' },
                  { name: 'Facebook', url: 'https://www.facebook.com/radekcechcz/' },
                  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/radekcechcz/' },
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-serif text-xl font-light text-[#1A1A1A]/50 hover:text-[#1A1A1A] hover:-translate-y-1 transition-all duration-300"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* FORMULÁŘ */}
          <div id="form" className="lg:col-span-7 bg-white rounded-[3rem] p-8 md:p-16 border border-black/5 shadow-xl">
            <form action={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest opacity-30">Vaše jméno</label>
                  <input name="name" type="text" required className="w-full border-b border-black/10 py-3 outline-none focus:border-[#B09B84] font-light transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest opacity-30">E-mail</label>
                  <input name="email" type="email" required className="w-full border-b border-black/10 py-3 outline-none focus:border-[#B09B84] font-light transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest opacity-30">O co se zajímáte?</label>
                  <select name="service" required className="w-full border-b border-black/10 py-3 outline-none focus:border-[#B09B84] font-light bg-transparent transition-colors">
                    <option value="">Vyberte službu...</option>
                    <option value="Svatební focení">Svatební focení</option>
                    <option value="Firemní portrét / Reportáž">Firemní portrét / Reportáž</option>
                    <option value="Tvorba webu / Marketing">Tvorba webu / Marketing</option>
                    <option value="Jiné">Jiné</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest opacity-30">Termín (nepovinné)</label>
                  <input name="date" type="text" placeholder="např. 15. 8. 2025" className="w-full border-b border-black/10 py-3 outline-none focus:border-[#B09B84] font-light transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest opacity-30">Vaše zpráva</label>
                <textarea name="message" rows={4} className="w-full border-b border-black/10 py-3 outline-none focus:border-[#B09B84] font-light transition-colors resize-none" />
              </div>

              <div className="pt-4 text-center md:text-left">
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full md:w-auto bg-[#1A1A1A] text-white px-16 py-5 rounded-2xl uppercase tracking-widest text-[10px] font-bold hover:bg-[#B09B84] transition-all disabled:opacity-50 shadow-lg"
                >
                  {status === 'loading' ? 'Odesílám...' : 'Odeslat zprávu'}
                </button>

                {status === 'success' && (
                  <p className="mt-6 text-green-600 font-serif italic">Děkuji! Zpráva byla odeslána, brzy se vám ozvu.</p>
                )}
                {status === 'error' && (
                  <p className="mt-6 text-red-500 font-serif italic">Něco se pokazilo. Zkuste to prosím znovu.</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}