import { NextResponse } from 'next/server';
import { getServiceSupabase } from '../../../../lib/supabase'; // Pokud by zlobil alias, použij: ../../../../../lib/supabase

export async function POST(request: Request) {
  try {
    // 1. BEZPEČNOSTNÍ KONTROLA: Zkontrolujeme, zda požadavek obsahuje náš tajný WEBHOOK_SECRET
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: 'Neoprávněný přístup - špatný token' }, { status: 401 });
    }

    // 2. PŘEČTENÍ DAT: Získáme JSON, který nám poslal IndieHub
    const body = await request.json();
    const { 
      indiehub_id, 
      title, 
      slug, 
      content_html, 
      cover_image, 
      tags, 
      is_published 
    } = body;

    // 3. ULOŽENÍ DO DATABÁZE: Zavoláme našeho Admin klienta (aby mohl zapisovat)
    const supabaseAdmin = getServiceSupabase();
    
    // Použijeme metodu "upsert" (Update or Insert). 
    // Pokud článek s tímto indiehub_id už existuje, přepíše se. Pokud ne, vytvoří se nový.
    const { data, error } = await supabaseAdmin
      .from('articles')
      .upsert({
        indiehub_id,
        title,
        slug,
        content_html,
        cover_image,
        tags,
        is_published,
        published_at: is_published ? new Date().toISOString() : null,
      }, { onConflict: 'indiehub_id' })
      .select()
      .single();

    if (error) {
      console.error('Chyba při ukládání do Supabase:', error);
      throw error;
    }

    // 4. ÚSPĚCH: Vrátíme odpověď zpět IndieHubu
    return NextResponse.json({ 
      success: true, 
      message: 'Článek byl úspěšně uložen na Osobním webu',
      article: data 
    });

  } catch (error: any) {
    console.error('Kritická chyba ve webhooku:', error);
    return NextResponse.json({ error: error.message || 'Interní chyba serveru' }, { status: 500 });
  }
}