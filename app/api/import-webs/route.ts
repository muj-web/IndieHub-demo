import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Ujisti se, že importuješ svůj Supabase klient

export async function POST(request: Request) {
  try {
    const projects = await request.json();

    if (!Array.isArray(projects) || projects.length === 0) {
      return NextResponse.json({ success: false, error: 'Žádná data k importu.' }, { status: 400 });
    }

    // Projdeme projekty jeden po druhém a vložíme je do Supabase
    for (const project of projects) {
      const { error } = await supabase.from('web_projects').insert([project]);
      if (error) {
        console.error(`Chyba u projektu ${project.project_name}:`, error.message);
        // Můžeš se rozhodnout, jestli při chybě u jednoho projektu zastavit vše, 
        // nebo pokračovat (zde pokračujeme, ať se uloží aspoň zbytek).
      }
    }

    return NextResponse.json({ success: true, message: `Zpracováno ${projects.length} projektů.` });

  } catch (error: any) {
    console.error('Chyba při zpracování importu:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}