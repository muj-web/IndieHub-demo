// Pomocná funkce pro tvé komponenty
export function getCardRadius(globalRadius: string) {
  // Pokud je nastaveno "Kulaté / Full" (9999px), karty omezíme na rozumné maximum (např. 2rem/32px)
  if (globalRadius === '9999px') {
    return '2rem'; 
  }
  // V ostatních případech (0px, 0.75rem) vrátíme to, co uživatel vybral
  return globalRadius || '0.75rem';
}