import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { wedding } = await req.json();

    // URL, kterou jsi získal při nasazení Apps Scriptu
    const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

    if (!APPS_SCRIPT_URL) {
      throw new Error('Chybí konfigurace APPS_SCRIPT_URL');
    }

    // Pošleme data do Apps Scriptu
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wedding }),
    });

    const result = await response.json();

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      throw new Error(result.error || 'Apps Script vrátil chybu');
    }

  } catch (error: any) {
    console.error('Chyba při synchronizaci přes Apps Script:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Nepodařilo se odeslat data' }, 
      { status: 500 }
    );
  }
}