import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // body může být jedna svatba nebo pole svateb (pro bulk import)
    const weddings = Array.isArray(body) ? body : [body];

    const { data, error } = await supabase
      .from('weddings')
      .upsert(weddings, { onConflict: 'id' }); // id je CRM_ID z tabulky

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Chyba přijmu z tabulky:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}