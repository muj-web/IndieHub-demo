// 1. PŘIDÁME TYP 'select'
export type FieldType = 'string' | 'textarea' | 'repeater' | 'select';

export interface ComponentField {
  name: string;
  label: string;
  type: FieldType;
  tab?: 'design' | 'content'; // <--- PŘIDÁNO: Určuje, do jaké záložky pole spadne
  subFields?: ComponentField[];
  
  // 2. PŘIDÁME MOŽNOST DEFINOVAT OPTIONS PRO SELECT
  options?: { label: string; value: string }[]; 
}

export const COMPONENT_SCHEMAS: Record<string, ComponentField[]> = {
  
  'hero-cinematic': [
    { name: 'badge', label: 'Badge / Štítek', type: 'string' },
    { name: 'headingMain', label: 'Hlavní nadpis (H1)', type: 'string' },
    { name: 'headingAccent', label: 'Akcentní nadpis (Barevný)', type: 'string' },
    { name: 'description', label: 'Popis', type: 'textarea' },
    { name: 'btnPrimary', label: 'Primární tlačítko (Text)', type: 'string' },
    { name: 'btnSecondary', label: 'Sekundární tlačítko (Text)', type: 'string' }
  ],
  'hero-circle': [
    { name: 'badge', label: 'Badge / Štítek', type: 'string' },
    { name: 'headingMain', label: 'Hlavní nadpis', type: 'string' },
    { name: 'headingAccent', label: 'Akcentní nadpis', type: 'string' },
    { name: 'description', label: 'Popis pod nadpisem', type: 'textarea' },
    { name: 'btnPrimary', label: 'Primární tlačítko', type: 'string' },
    { name: 'btnSecondary', label: 'Sekundární tlačítko', type: 'string' },
    { 
      name: 'orbitItems', 
      label: 'Body v orbitu (Kolečka)', 
      type: 'repeater',
      subFields: [
        { name: 'label', label: 'Název (u kolečka)', type: 'string' },
        { name: 'icon', label: 'Ikona (Zap, Shield, Star...)', type: 'string' },
        { name: 'detailTitle', label: 'Název v detailu (uprostřed)', type: 'string' },
        { name: 'detailDesc', label: 'Popis v detailu (uprostřed)', type: 'textarea' }
      ]
    }
  ],
  'hero-neon': [
    { name: 'badge', label: 'Badge / Štítek', type: 'string' },
    { name: 'headingMain', label: 'Hlavní nadpis', type: 'string' },
    { name: 'headingAccent', label: 'Akcentní nadpis (Neonový)', type: 'string' },
    { name: 'description', label: 'Popis pod nadpisem', type: 'textarea' },
    { name: 'btnPrimary', label: 'Primární tlačítko', type: 'string' },
    { name: 'btnSecondary', label: 'Sekundární tlačítko', type: 'string' }
  ],
  'hero-industrial': [
    { name: 'headingSmall', label: 'Malý nadpis', type: 'string' },
    { name: 'headingLarge', label: 'Obří nadpis', type: 'string' },
    { name: 'subtitle', label: 'Podtitulek pod linkou', type: 'string' },
    { name: 'placeholder', label: 'Text vyhledávacího pole', type: 'string' },
    { name: 'btn1', label: 'Tlačítko 1 (Neutrální)', type: 'string' },
    { name: 'btn2', label: 'Tlačítko 2 (Akcentní)', type: 'string' }
  ],

  'services-bento': [
    { name: 'badge', label: 'Badge / Štítek', type: 'string' },
    { name: 'headingNormal', label: 'Hlavní nadpis (H2)', type: 'string' },
    { name: 'headingAccent', label: 'Akcentní část nadpisu', type: 'string' },
    { name: 'description', label: 'Hlavní popis sekce', type: 'textarea' },
    { 
      name: 'services', 
      label: 'Karty služeb', 
      type: 'repeater',
      subFields: [
        { name: 'title', label: 'Název služby', type: 'string' },
        { name: 'desc', label: 'Popis služby', type: 'textarea' },
        { name: 'icon', label: 'Název ikony (např. Zap, Sparkles)', type: 'string' },
        { 
          name: 'cardSize', 
          label: 'Šířka karty', 
          type: 'select',
          options: [
            { label: 'Čtvrtina (1/4)', value: '3' },
            { label: 'Třetina (1/3)', value: '4' },
            { label: 'Polovina (1/2)', value: '6' },
            { label: 'Dvě třetiny (2/3)', value: '8' },
            { label: 'Celá šířka (100%)', value: '12' }
          ]
        }
      ]
    }
  ],
  'services-utilitarian': [
    { name: 'badge', label: 'Badge / Štítek', type: 'string' },
    { name: 'headingNormal', label: 'Hlavní nadpis (H2)', type: 'string' },
    { name: 'headingAccent', label: 'Akcentní část nadpisu', type: 'string' },
    { name: 'description', label: 'Hlavní popis sekce', type: 'textarea' },
    { 
      name: 'services', 
      label: 'Karty služeb', 
      type: 'repeater',
      subFields: [
        { name: 'title', label: 'Název služby', type: 'string' },
        { name: 'desc', label: 'Popis služby', type: 'textarea' },
        { name: 'icon', label: 'Název ikony (např. Zap, Settings, Wrench)', type: 'string' },
        { 
          name: 'cardSize', 
          label: 'Šířka karty', 
          type: 'select',
          options: [
            { label: 'Čtvrtina (1/4)', value: '3' },
            { label: 'Třetina (1/3)', value: '4' },
            { label: 'Polovina (1/2)', value: '6' },
            { label: 'Dvě třetiny (2/3)', value: '8' },
            { label: 'Celá šířka (100%)', value: '12' }
          ]
        }
      ]
    }
  ],
  'services-grid': [
    { name: 'badge', label: 'Badge / Štítek', type: 'string' },
    { name: 'headingNormal', label: 'Hlavní nadpis (H2)', type: 'string' },
    { name: 'headingAccent', label: 'Akcentní část nadpisu', type: 'string' },
    { name: 'description', label: 'Hlavní popis sekce', type: 'textarea' },
    { 
      name: 'services', 
      label: 'Karty služeb', 
      type: 'repeater',
      subFields: [
        { name: 'title', label: 'Název služby', type: 'string' },
        { name: 'desc', label: 'Popis služby', type: 'textarea' },
        { name: 'icon', label: 'Název ikony (např. Code, Layout, Smartphone)', type: 'string' },
        { 
          name: 'cardSize', 
          label: 'Šířka karty', 
          type: 'select',
          options: [
            { label: 'Čtvrtina (1/4)', value: '3' },
            { label: 'Třetina (1/3)', value: '4' },
            { label: 'Polovina (1/2)', value: '6' },
            { label: 'Dvě třetiny (2/3)', value: '8' },
            { label: 'Celá šířka (100%)', value: '12' }
          ]
        }
      ]
    }
  ],
  'hero-subpage': [
    { name: 'badge', label: 'Badge / Štítek (např. Ceník)', type: 'string' },
    { name: 'headingMain', label: 'Hlavní nadpis (H1)', type: 'string' },
    { name: 'headingAccent', label: 'Akcentní nadpis (Barevný)', type: 'string' },
    { name: 'description', label: 'Krátký popis pod nadpisem', type: 'textarea' },
    { 
      name: 'align', 
      label: 'Zarovnání textu', 
      type: 'select',
      tab: 'design', // <--- PŘESUNUTO DO VZHLEDU
      options: [
        { label: 'Na střed', value: 'center' },
        { label: 'Doleva', value: 'left' },
        { label: 'Doprava', value: 'right' }
      ]
    },
    { 
      name: 'padding', 
      label: 'Velikost odsazení (Výška)', 
      type: 'select',
      tab: 'design', // <--- PŘESUNUTO DO VZHLEDU
      options: [
        { label: 'Kompaktní', value: 'S' },
        { label: 'Standard', value: 'M' },
        { label: 'Vzdušné', value: 'L' }
      ]
    }
  ],
  'hero-luxury': [
    { name: 'badge', label: 'Nadnadpis (Malý text)', type: 'string' },
    { name: 'headingMain', label: 'Hlavní nadpis (H1)', type: 'string' },
    { name: 'headingAccent', label: 'Akcentní nadpis', type: 'string' },
    { name: 'description', label: 'Popis', type: 'textarea' },
    { name: 'btnPrimary', label: 'Tlačítko rezervace', type: 'string' },
    { name: 'btnUrl', label: 'Odkaz rezervace', type: 'string' },
    { name: 'bg_src', label: 'URL Obrázku pozadí', type: 'string' }
  ],

  'services-interactive': [
    { name: 'badge', label: 'Štítek sekce', type: 'string' },
    { name: 'heading', label: 'Nadpis sekce', type: 'string' },
    { 
      name: 'services', 
      label: 'Služby (Karty)', 
      type: 'repeater',
      subFields: [
        { name: 'title', label: 'Název služby (např. Střihy vlasů)', type: 'string' },
        { name: 'image', label: 'URL Fotografie', type: 'string' },
        { name: 'url', label: 'Odkaz', type: 'string' }
      ]
    }
  ],

  'testimonials-premium': [
    { name: 'bg_src', label: 'Obrázek pozadí (Tmavý)', type: 'string' },
    { 
      name: 'reviews', 
      label: 'Recenze', 
      type: 'repeater',
      subFields: [
        { name: 'name', label: 'Jméno zákaznice', type: 'string' },
        { name: 'text', label: 'Text recenze', type: 'textarea' },
        { name: 'stars', label: 'Počet hvězdiček (1-5)', type: 'string' }
      ]
    }
  ],
  'header-luxury': [
    { name: 'logoName', label: 'Název / Logo text', type: 'string' },
    { name: 'btnText', label: 'Tlačítko (např. Rezervace)', type: 'string' },
    { 
      name: 'links', 
      label: 'Odkazy v menu (přepíše automatické)', 
      type: 'repeater',
      subFields: [
        { name: 'name', label: 'Název odkazu', type: 'string' },
        { name: 'url', label: 'URL odkazu', type: 'string' }
      ]
    }
  ],

  'footer-luxury': [
    { name: 'logoName', label: 'Název / Logo text', type: 'string' },
    { name: 'description', label: 'Krátký popis / Slogan', type: 'textarea' },
    { name: 'address', label: 'Adresa', type: 'textarea' },
    { name: 'phone', label: 'Telefon', type: 'string' },
    { name: 'email', label: 'E-mail', type: 'string' },
    { name: 'hours', label: 'Otevírací doba', type: 'textarea' },
    { 
      name: 'links', 
      label: 'Rychlé odkazy', 
      type: 'repeater',
      subFields: [
        { name: 'name', label: 'Název odkazu', type: 'string' },
        { name: 'url', label: 'URL odkazu', type: 'string' }
      ]
    }
  ],
  
  'hero-split': [
    { 
      name: 'layout', 
      label: 'Rozložení', 
      type: 'select', 
      tab: 'design', // <--- PŘESUNUTO DO VZHLEDU
      options: [
        { label: 'Text vlevo, Fotka vpravo', value: 'normal' },
        { label: 'Fotka vlevo, Text vpravo', value: 'reversed' }
      ] 
    },
    { 
      name: 'imageRatio', 
      label: 'Poměr stran obrázku', 
      type: 'select', 
      tab: 'design', // <--- PŘESUNUTO DO VZHLEDU
      options: [
        { label: 'Čtverec (1:1)', value: 'aspect-square' },
        { label: 'Krajina (4:3)', value: 'aspect-[4/3]' },
        { label: 'Video (16:9)', value: 'aspect-video' },
        { label: 'Portrét (3:4)', value: 'aspect-[3/4]' }
      ] 
    },
    { name: 'badge', label: 'Štítek nad nadpisem', type: 'string' },
    { name: 'heading', label: 'Hlavní nadpis (H1)', type: 'string' },
    { name: 'headingAccent', label: 'Akcentní nadpis', type: 'string' },
    { name: 'description', label: 'Popis', type: 'textarea' },
    { name: 'btnPrimary', label: 'Primární tlačítko', type: 'string' },
    { name: 'btnSecondary', label: 'Sekundární tlačítko', type: 'string' },
    { name: 'image', label: 'URL Obrázku', type: 'string' }
  ],
  'header-standard': [
    { name: 'logoText', label: 'Text loga', type: 'string' },
    { name: 'btnText', label: 'Text tlačítka', type: 'string' },
    { name: 'btnUrl', label: 'Odkaz tlačítka (např. /kontakt)', type: 'string' }
  ],
  'content-standard': [
    { name: 'layout', label: 'Rozložení', type: 'select', tab: 'design', options: [{ label: 'Text vlevo', value: 'normal' }, { label: 'Text vpravo', value: 'reversed' }] },
    { name: 'imageRatio', label: 'Poměr stran', type: 'select', tab: 'design', options: [{ label: 'Video (16:9)', value: 'aspect-video' }, { label: 'Čtverec (1:1)', value: 'aspect-square' }] },
    { name: 'heading', label: 'Nadpis sekce', type: 'string' },
    { name: 'description', label: 'Textový obsah', type: 'textarea' },
    { name: 'image', label: 'URL Obrázku', type: 'string' }
  ],
  'services-standard': [
    { 
      name: 'services', label: 'Seznam služeb', type: 'repeater',
      subFields: [
        { name: 'title', label: 'Služba', type: 'string' },
        { name: 'desc', label: 'Popis', type: 'textarea' }
      ]
    }
  ],
  'testimonials-standard': [
    { 
      name: 'reviews', label: 'Recenze', type: 'repeater',
      subFields: [
        { name: 'name', label: 'Jméno', type: 'string' },
        { name: 'text', label: 'Citace', type: 'textarea' }
      ]
    }
  ],
  'footer-standard': [
    { name: 'copy', label: 'Copyright text', type: 'string' }
  ],
};