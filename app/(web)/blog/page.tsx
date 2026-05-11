// Používáme absolutní cestu přes zavináč, takže tohle už nikdy nezečervená
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Deník | Radek Čech',
  description: 'Zákulisí mé práce, osobní střípky, vzpomínky a inspirace ze světa svatební a reportážní fotografie.',
};

// Next.js 15 vyžaduje, aby searchParams byly Promise
export default async function DiaryPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ kategorie?: string }> 
}) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.kategorie || 'Vše';

  // 1. Získáme články z databáze a seřadíme od nejnovějšího
  let query = supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (currentCategory !== 'Vše') {
    query = query.eq('category', currentCategory);
  }

  const { data: posts, error } = await query;

  if (error) {
    console.error("Chyba při načítání deníku:", error);
  }

  const categories = [
    'Vše', 
    'Osobní', 
    'Vzpomínky', 
    'Fotogalerie', 
    'Svatební focení', 
    'Svatební inspirace', 
    'Svatební místa'
  ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-[#1A1A1A] pt-32 pb-24">
      
      {/* HLAVIČKA DENÍKU */}
      <header className="max-w-[1400px] mx-auto px-6 mb-16 text-center">
        <span className="text-[#B09B84] uppercase tracking-widest text-[11px] font-bold block mb-6">
          Zákulisí & Myšlenky
        </span>
        <h1 className="font-serif text-5xl md:text-7xl font-light mb-8">
          Můj deník
        </h1>
        <p className="font-light text-[#1A1A1A]/60 max-w-2xl mx-auto leading-relaxed">
          Místo, kde odkládám fotoaparát a beru do ruky slova. Najdete tu osobní střípky, 
          ohlednutí za krásnými svatbami, inspiraci pro nevěsty a momenty, které se nevešly do běžného portfolia.
        </p>
      </header>

      {/* FILTRAČNÍ MENU */}
      <section className="max-w-[1400px] mx-auto px-6 mb-20">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((cat) => {
            const isActive = currentCategory === cat;
            const href = cat === 'Vše' ? '/blog' : `/blog?kategorie=${encodeURIComponent(cat)}`;

            return (
              <Link 
                key={cat} 
                href={href}
                className={`px-5 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all duration-300 border ${
                  isActive 
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md' 
                    : 'bg-transparent text-[#1A1A1A]/70 border-black/10 hover:border-[#B09B84] hover:text-[#B09B84]'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </section>

      {/* VÝPIS ČLÁNKŮ */}
      <section className="max-w-[1400px] mx-auto px-6">
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* TADY JE OPRAVA: Přidáno (post: any), aby TypeScript přestal panikařit */}
            {posts.map((post: any) => (
              <Link 
                href={post.slug?.startsWith('/') ? post.slug : `/blog/${post.slug}`} 
                key={post.slug} 
                className="group flex flex-col h-full"
              >
                
                {/* Fotka */}
                <div className="relative aspect-[4/3] md:aspect-[4/5] overflow-hidden rounded-[2rem] mb-6 bg-black/5">
                  {post.cover_image ? (
                    <Image 
                      src={post.cover_image} 
                      alt={post.title || 'Náhledový obrázek článku'} 
                      fill 
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-black/20 text-xs">
                      Bez náhledové fotky
                    </div>
                  )}
                  {post.category && (
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-bold text-[#1A1A1A]">
                      {post.category}
                    </div>
                  )}
                </div>

                {/* Textový obsah karty */}
                <div className="flex-grow flex flex-col">
                  {/* Datum */}
                  <span className="text-[#1A1A1A]/40 text-xs font-light mb-3 block">
                    {new Date(post.created_at).toLocaleDateString('cs-CZ', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </span>
                  
                  {/* Nadpis */}
                  <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-4 group-hover:text-[#B09B84] transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  
                  {/* Úryvek textu */}
                  <p className="font-light text-[#1A1A1A]/60 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                    {post.excerpt}
                  </p>
                  
                  {/* Tlačítko číst dál */}
                  <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] group-hover:text-[#B09B84] transition-colors mt-auto">
                    Číst příspěvek <span className="text-lg leading-none transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 border border-black/5 rounded-[2rem] bg-white/50">
            <h3 className="font-serif text-2xl font-light text-[#1A1A1A] mb-4">V této kategorii zatím nic není</h3>
            <p className="text-[#1A1A1A]/50 font-light">
              Připravuji sem pro vás nový obsah. Zkuste se podívat do jiné rubriky.
            </p>
          </div>
        )}
      </section>

    </div>
  );
}