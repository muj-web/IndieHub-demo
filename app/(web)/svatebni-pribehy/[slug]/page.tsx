import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ImageGallery from '@/app/components/web/ImageGallery';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import RelatedStories from '@/app/components/web/RelatedStories';

export default async function WeddingStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 1. Načteme texty z databáze
  const { data: story } = await supabase
    .from('wedding_stories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!story) notFound();

  // 2. Načteme seznam všech souborů ze složky ve Storage
  const { data: files, error } = await supabase.storage
    .from('galleries')
    .list(`svatebni-pribehy/${slug}`); // <-- TADY PŘIDÁME MEZISLOŽKU

  if (error || !files) {
    console.error("Chyba při načítání fotek:", error);
  }

  // 3. Přetvoříme seznam souborů na formát pro naši galerii
  const photos = files
    ?.filter(file => file.name !== '.emptyFolderPlaceholder')
    .map((file) => ({
      // TADY TAKÉ PŘIDÁME MEZISLOŽKU DO Cesty K FOTCE
      src: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/galleries/svatebni-pribehy/${slug}/${file.name}`,
    })) || [];

  // 4. Načteme související příběhy pro Slideshow (vyřadíme aktuální svatbu)
  const { data: relatedStories } = await supabase
    .from('wedding_stories')
    .select('title, slug, cover_image')
    .neq('slug', slug)
    .limit(4);

  return (
    <article className="bg-[#FAFAFA] min-h-screen">
      
      {/* HERO HLAVIČKA */}
      <header className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        {story.cover_image && (
          <Image src={story.cover_image} alt={story.title} fill className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center px-4">
           <h1 className="font-serif text-white text-4xl md:text-6xl font-light">{story.title}</h1>
        </div>
      </header>

      {/* ÚVODNÍ TEXT */}
      {story.intro_html && (
        <section className="max-w-[850px] mx-auto py-20 px-6">
          <div 
            className="prose prose-lg font-light leading-relaxed text-[#1A1A1A]/70"
            dangerouslySetInnerHTML={{ __html: story.intro_html }} 
          />
        </section>
      )}

      {/* AUTOMATICKÁ GALERIE */}
      <section className="w-[90%] md:w-[80%] mx-auto pb-20">
        <ImageGallery photos={photos} />
      </section>

      {/* TEXT O MÍSTĚ / VENUE */}
      {story.venue_html && (
        <section className="bg-white border-y border-black/5 py-24">
          <div className="max-w-[850px] mx-auto px-6">
            <span className="text-[#B09B84] uppercase tracking-widest text-[10px] font-bold block mb-4">O místě</span>
            <div 
              className="prose prose-lg font-light leading-relaxed text-[#1A1A1A]/70"
              dangerouslySetInnerHTML={{ __html: story.venue_html }} 
            />
          </div>
        </section>
      )}

      {/* SOUVISEJÍCÍ PŘÍBĚHY */}
      <RelatedStories stories={relatedStories || []} />

      {/* PATIČKA S ODKAZEM ZPĚT */}
      <footer className="py-20 text-center">
        <Link href="/svatebni-pribehy" className="group inline-flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-all">
            <ArrowRight className="rotate-180" size={18} />
          </div>
          <span className="uppercase tracking-widest text-[10px] font-bold">Zpět na všechny příběhy</span>
        </Link>
      </footer>

    </article>
  );
}