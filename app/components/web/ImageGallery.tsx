'use client';

import { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface MeasuredPhoto {
  src: string;
  width: number;
  height: number;
  alt?: string;
}

export default function ImageGallery({ photos }: { photos: { src: string, alt?: string }[] }) {
  const [index, setIndex] = useState(-1);
  const [measuredPhotos, setMeasuredPhotos] = useState<MeasuredPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadDimensions = async () => {
      setIsLoading(true);
      
      const measured = await Promise.all(
        photos.map((photo) => {
          return new Promise<MeasuredPhoto>((resolve) => {
            const img = new Image();
            img.src = photo.src;
            img.onload = () => resolve({ src: photo.src, width: img.naturalWidth, height: img.naturalHeight, alt: photo.alt });
            img.onerror = () => resolve({ src: photo.src, width: 3, height: 2, alt: photo.alt }); 
          });
        })
      );

      if (isMounted) {
        setMeasuredPhotos(measured);
        setIsLoading(false);
      }
    };

    if (photos && photos.length > 0) {
      loadDimensions();
    } else {
      setIsLoading(false);
    }

    return () => { isMounted = false; };
  }, [photos]);

  if (isLoading) {
    return (
      <div className="w-full mt-20 flex justify-center items-center h-40 text-[#1A1A1A]/40 font-light">
        <span className="uppercase tracking-widest text-xs animate-pulse">Sestavuji galerii...</span>
      </div>
    );
  }

  return (
    <div className="w-full mt-20">
      <div className="flex flex-wrap gap-1 md:gap-1 after:content-[''] after:flex-grow-[9999999]">
        {measuredPhotos.map((photo, i) => {
          // Přirozený poměr fotky (např. 3:2 = 1.5)
          const naturalRatio = photo.width / photo.height;
          
          // KOUZLO: Pokud je fotka na šířku (šířka > výška), vnutíme jí poměr 4:3 (1.333).
          // Pokud je na výšku, necháme ji tak, jak je.
          const displayRatio = naturalRatio > 1.1 ? (4 / 3) : naturalRatio;

          return (
            <div
              key={i}
              onClick={() => setIndex(i)}
              className="relative cursor-pointer group overflow-hidden bg-black/5 h-[200px] md:h-[350px]"
              style={{
                flexGrow: displayRatio,
                flexBasis: `${displayRatio * 350}px`,
              }}
            >
              <img
                src={photo.src}
                alt={photo.alt || "Svatební fotografie"}
                loading="lazy"
                // object-cover zajistí, že se fotka krásně a plynule ořízne do 4:3 boxu
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
          );
        })}
      </div>

      <Lightbox
        index={index}
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={measuredPhotos.map((p) => ({ src: p.src }))}
      />
    </div>
  );
}