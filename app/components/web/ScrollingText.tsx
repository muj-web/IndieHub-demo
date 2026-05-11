'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function ScrollingText({ text, color = "text-white" }: { text: string, color?: string }) {
  const ref = useRef(null);
  
  // Sledujeme scroll progress konkrétní sekce
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Mapování scrollu na efekty (0 = začátek, 0.5 = střed, 1 = konec)
  const opacity = useTransform(scrollYProgress, [0.1, 0.4, 0.6, 0.9], [0, 1, 1, 0]);
  const blur = useTransform(scrollYProgress, [0.1, 0.4, 0.6, 0.9], ["10px", "0px", "0px", "10px"]);
  const y = useTransform(scrollYProgress, [0.1, 0.4, 0.6, 0.9], [50, 0, 0, -50]);

  return (
    <div ref={ref} className="h-screen flex items-center justify-center px-6">
      <motion.p 
        style={{ opacity, filter: `blur(${blur})`, y }}
        className={`max-w-[850px] text-center font-sans text-2xl md:text-4xl leading-relaxed font-light ${color}`}
      >
        {text}
      </motion.p>
    </div>
  );
}