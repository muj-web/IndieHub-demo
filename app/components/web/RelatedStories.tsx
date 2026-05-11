import Link from 'next/link';
import Image from 'next/image';

interface Story {
  title: string;
  slug: string;
  cover_image: string;
}

interface RelatedStoriesProps {
  stories: Story[];
  sectionTitle?: string; // Vlastní nadpis (nepovinný)
  linkPrefix?: string;   // Vlastní URL předpona (nepovinná)
}

export default function RelatedStories({ 
  stories, 
  sectionTitle = "Další svatební příběhy", // Výchozí text, když nic nezadáme
  linkPrefix = "/svatebni-pribehy/"        // Výchozí URL, když nic nezadáme
}: RelatedStoriesProps) {
  
  if (!stories || stories.length === 0) return null;

  return (
    <section className="bg-[#FAFAFA] py-24 border-t border-black/5 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Nadpis sekce - NYNÍ DYNAMICKÝ */}
        <div className="text-center mb-16">
          <span className="text-[#B09B84] uppercase tracking-widest text-[10px] font-bold block mb-4">
            Inspirujte se
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-light text-[#1A1A1A]">
            {sectionTitle}
          </h2>
        </div>

        {/* Nativní CSS Slideshow */}
        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-12 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {stories.map((story, i) => (
            
            <Link 
              href={story.slug?.startsWith('/') ? story.slug : `${linkPrefix}${story.slug}`} 
              key={i}
              className="snap-center shrink-0 w-[85vw] md:w-[400px] lg:w-[450px] group flex flex-col items-center"
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden mb-6 bg-black/5 rounded-[2rem]">
                {story.cover_image ? (
                  <Image 
                    src={story.cover_image} 
                    alt={story.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-black/20 text-sm">
                    Bez náhledové fotky
                  </div>
                )}
              </div>
              
              <h3 className="font-serif text-xl md:text-2xl text-[#1A1A1A] font-light text-center transition-colors group-hover:text-[#B09B84]">
                {story.title}
              </h3>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}