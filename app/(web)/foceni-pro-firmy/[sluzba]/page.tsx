import B2BServiceTemplate from '@/app/components/web/B2BServiceTemplate';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// 1. DATA PRO JEDNOTLIVÉ B2B SLUŽBY
const servicesData: Record<string, any> = {
  'business-portret': {
    seoTitle: 'Business portrét Brno | Radek Čech',
    seoDescription: 'Profesionální business portréty, které budují vaši osobní značku a důvěru u klientů.',
    title: 'Business portrét, který mluví za vás.',
    subtitle: 'Osobní značka & Tým',
    image: 'https://www.radekcech.cz/wp-content/uploads/2023/04/svatba-hotel-myslivna-brno-radek-cech-fotograf-00065-1.jpg',
    description: [
      "V dnešním digitálním světě je vaše fotografie často prvním kontaktem s klientem. Profesionální business portrét není jen o tom, jak vypadáte, ale o tom, jakou energii a důvěru vyzařujete.",
      "Focení probíhá u vás v kanceláři, v exteriéru nebo v ateliéru, vždy s ohledem na obor, ve kterém působíte. Cílem je vytvořit přirozené snímky, které podpoří vaši profesionalitu."
    ],
    benefits: [
      "Individuální přístup ke každému členu týmu",
      "Retuš a postprodukce v ceně",
      "Konzultace oblečení a stylu předem",
      "Možnost focení přímo ve vašich prostorech",
      "Vysoké rozlišení pro web i tisk"
    ]
  },
  'reportazni-fotografie': {
    seoTitle: 'Firemní reportáž a eventy Brno | Radek Čech',
    seoDescription: 'Dokumentace firemních akcí, konferencí a večírků. Autentická reportážní fotografie.',
    title: 'Autentická dokumentace vaší firmy.',
    subtitle: 'Eventy & Firemní kultura',
    image: 'https://www.radekcech.cz/wp-content/uploads/2023/04/svatba-hotel-myslivna-brno-radek-cech-fotograf-00065-1.jpg',
    description: [
      "Zachyťte atmosféru vašich firemních akcí, konferencí, teambuildingů nebo běžného dne v kanceláři. Skutečné emoce a momentky vyprávějí příběh vaší firemní kultury mnohem lépe než strojené fotografie.",
      "Během akce se pohybuji nepozorovaně, abych zachytil lidi v jejich přirozenosti. Výsledkem je fotobanka plná živých snímků využitelných pro PR, sociální sítě i interní komunikaci."
    ],
    benefits: [
      "Nenápadný reportážní přístup",
      "Rychlé dodání náhledů pro PR účely",
      "Kompletní pokrytí akce od příprav po závěr",
      "Fotografie optimalizované pro různé formáty",
      "Zachycení detailů, networkingu i hlavního programu"
    ]
  },
  'produktovy-fotograf': {
    seoTitle: 'Produktová fotografie | Radek Čech',
    seoDescription: 'Kvalitní produktové fotografie, které prodávají. Focení pro e-shopy, katalogy a sociální sítě.',
    title: 'Fotografie, které prodávají na první pohled.',
    subtitle: 'Produkty & E-commerce',
    image: 'https://www.radekcech.cz/wp-content/uploads/2023/04/svatba-hotel-myslivna-brno-radek-cech-fotograf-00065-1.jpg',
    description: [
      "Lidé nakupují očima. Kvalitní prezentace produktu je často rozhodujícím faktorem mezi nákupem u vás a u konkurence. Zajišťuji jak čisté produktové fotografie na bílém pozadí pro e-shopy, tak kreativní lifestylové snímky.",
      "Společně vymyslíme koncept, který nejlépe odprezentuje vlastnosti a charakter vašeho produktu, aby dokonale zapadl do vizuální identity vaší značky."
    ],
    benefits: [
      "Precizní nasvícení a věrnost barev",
      "Čisté produktovky i lifestyle fotky",
      "Pokročilá retuš prachu a nedokonalostí",
      "Přizpůsobení formátů pro e-shop i sociální sítě",
      "Konzultace vizuálního konceptu"
    ]
  }
};

// 2. DYNAMICKÉ SEO
export async function generateMetadata({ params }: { params: Promise<{ sluzba: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const data = servicesData[resolvedParams.sluzba];
  
  if (!data) return {};

  return {
    title: data.seoTitle,
    description: data.seoDescription,
  };
}

// 3. STATICKÉ GENEROVÁNÍ (pro bleskovou rychlost a Google)
export function generateStaticParams() {
  return Object.keys(servicesData).map((sluzba) => ({
    sluzba: sluzba,
  }));
}

// 4. VYRENDERování STRÁNKY
export default async function B2BServicePage({ params }: { params: Promise<{ sluzba: string }> }) {
  const resolvedParams = await params;
  const data = servicesData[resolvedParams.sluzba];

  if (!data) notFound(); // Hodí 404, pokud zadáš nesmyslnou URL

  return (
    <B2BServiceTemplate 
      title={data.title}
      subtitle={data.subtitle}
      image={data.image}
      description={data.description}
      benefits={data.benefits}
    />
  );
}