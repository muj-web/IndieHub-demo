import B2BServiceTemplate from '@/app/components/web/B2BServiceTemplate';
import Link from 'next/link';

export const metadata = {
  title: 'Tvorba webových stránek a aplikací | Radek Čech',
  description: 'Moderní, rychlé a konverzní weby postavené na technologiích Next.js i WordPress.',
};

export default function TvorbaWebuPage() {
  return (
    <B2BServiceTemplate 
      title="Weby a aplikace, které pro vás reálně pracují."
      subtitle="Design & Vývoj"
      image="https://www.radekcech.cz/wp-content/uploads/2023/04/svatba-hotel-myslivna-brno-radek-cech-fotograf-00065-1.jpg" // Později nahradíš fotkou notebooku/kódu
      description={[
        "Webová stránka by neměla být jen digitální vizitkou. Musí to být váš nejlepší obchodník, který nikdy nespí. Tvořím weby s důrazem na rychlost, čistý kód a především na potřeby vašich zákazníků.",
        "Ať už potřebujete jednoduchou firemní prezentaci, nebo robustní webovou aplikaci, vybereme to správné řešení. K vývoji využívám jak špičkový Next.js pro náročné a extrémně rychlé projekty, tak oblíbený WordPress pro klienty, kteří preferují snadnou správu obsahu.",
        // TADY JE TEN TVŮJ PROKLIK
        <span key="odkaz">Zajímá vás, jaký je proces a co to obnáší? Přečtěte si mého průvodce <Link href="/jak-vytvorit-webove-stranky" className="text-[#B09B84] hover:text-white underline underline-offset-4 transition-colors">jak vytvořit webové stránky krok za krokem</Link>.</span>
      ]}
      benefits={[
        "Moderní technologie (Next.js) i klasika (WordPress)",
        "Vývoj komplexních webových aplikací",
        "Důraz na mobilní zařízení (Mobile-first)",
        "Rychlost načítání a čistý kód",
        "Základní SEO optimalizace v ceně"
      ]}
    />
  );
}