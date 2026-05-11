"use client";

import { PlayCircle } from "lucide-react";
import Image from "next/image";

export default function VideoGrid({ data }: { data?: any }) {
  const content = {
    heading: data?.heading || "Příběhy našich zákazníků",
    videos: data?.videos || [
      { title: "Zákazník A", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800" },
      { title: "Zákazník B", image: "https://images.unsplash.com/photo-1504917595217-d4bf23821013?q=80&w=800" },
      { title: "Zákazník C", image: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?q=80&w=800" }
    ]
  };

  return (
    <section className="py-24 relative overflow-hidden bg-[var(--color-dt-bg)] text-[var(--color-dt-text)]">
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 tracking-tight">
          {content.heading}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.videos.map((video: any, i: number) => (
            <div key={i} className="relative aspect-[4/3] group cursor-pointer overflow-hidden border border-[var(--color-dt-text)]/10">
              <Image src={video.image} alt={video.title} fill className="object-cover grayscale" />
              
              {/* Dynamický překryv podle accent barvy */}
              <div 
                className="absolute inset-0 mix-blend-multiply opacity-60 group-hover:opacity-40 transition-opacity duration-500" 
                style={{ backgroundColor: 'var(--color-dt-accent)' }}
              />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <PlayCircle className="w-16 h-16 text-white mb-4 group-hover:scale-110 transition-transform duration-300 stroke-1" />
                <h3 className="text-xl font-bold text-white">{video.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}