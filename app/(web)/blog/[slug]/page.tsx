import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ImageGallery from '@/app/components/web/ImageGallery';
import type { Metadata } from 'next';

// 1. DYNAMICKÉ SEO (Z tvého původního kódu - funguje skvěle!)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { data: post } = await supabase
    .from('blog_posts') // Upraveno na novou tabulku
    .select('title, excerpt, cover_image')
    .eq('slug', resolvedParams.slug)
    .single();

  if (!post) return {};

  return {
    title: `${post.title} | Radek Čech`,
    description: post.excerpt || `Přečtěte si příspěvek ${post.title} v mém deníku.`,
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

// 2. SAMOTNÁ STRÁNKA ČLÁNKU
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Načtení článku z databáze
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!post) notFound();

  // Pokus o načtení automatické galerie z podsložky "blog"
  const { data: files } = await supabase.storage
    .from('galleries') 
    .list(`blog/${slug}`);

  // Přetvoříme seznam souborů pro naši komponentu galerie
  const photos = files
    ?.filter(file => file.name !== '.emptyFolderPlaceholder')
    .map((file) => ({
      src: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/galleries/blog/${slug}/${file.name}`,
    })) || [];

  return (
    <article className="bg-[#FAFAFA] min-h-screen pb-32">
      
      {/* 1. HERO HLAVIČKA ČLÁNKU (V novém světlém designu) */}
      <header className="relative h-[60vh] md:h-[70vh] flex flex-col items-center justify-center overflow-hidden">
        {post.cover_image && (
          <Image 
            src={post.cover_image} 
            alt={post.title} 
            fill 
            className="object-cover" 
            priority 
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-16">
          {post.category && (
            <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold mb-6 inline-block shadow-sm">
              {post.category}
            </span>
          )}
          <h1 className="font-serif text-white text-4xl md:text-6xl lg:text-7xl font-light mb-6 leading-tight drop-shadow-lg">
            {post.title}
          </h1>
          <span className="text-white/70 text-xs font-light tracking-wide drop-shadow-md">
            {new Date(post.created_at).toLocaleDateString('cs-CZ', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}
          </span>
        </div>
      </header>

      {/* 2. HLAVNÍ TEXT ČLÁNKU */}
      {post.content_html && (
        <section className="max-w-[760px] mx-auto px-6 py-24">
          <div 
            className="prose prose-lg md:prose-xl prose-stone font-light leading-relaxed text-[#1A1A1A]/80 prose-img:rounded-2xl prose-img:shadow-lg prose-headings:font-serif prose-headings:font-light prose-a:text-[#B09B84] hover:prose-a:text-[#1A1A1A] transition-colors max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content_html }} 
          />
        </section>
      )}

      {/* 3. AUTOMATICKÁ FOTOGALERIE */}
      {photos.length > 0 && (
        <section className="w-[90%] md:w-[80%] mx-auto pb-12 pt-8 border-t border-black/5">
          <div className="text-center mb-12">
            <span className="text-[#B09B84] uppercase tracking-widest text-[10px] font-bold">Galerie</span>
            <h2 className="font-serif text-3xl font-light text-[#1A1A1A] mt-2">Fotografie k článku</h2>
          </div>
          <ImageGallery photos={photos} />
        </section>
      )}

      {/* 4. PATIČKA - ODKAZ ZPĚT */}
      <footer className="max-w-[760px] mx-auto px-6 pt-16 border-t border-black/5 flex justify-center">
        <Link href="/blog" className="group inline-flex items-center gap-4 text-xs uppercase tracking-widest font-bold text-[#1A1A1A] hover:text-[#B09B84] transition-colors">
          <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center group-hover:border-[#B09B84] transition-colors">
            <ArrowLeft size={16} />
          </div>
          Zpět do deníku
        </Link>
      </footer>

    </article>
  );
}