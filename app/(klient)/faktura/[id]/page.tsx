'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, Printer } from 'lucide-react';

export default function FakturaDetail() {
  const params = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      // Načtení faktury + připojeného klienta
      const { data: invData } = await supabase
        .from('invoices')
        .select('*, billing_clients(*)')
        .eq('id', params.id)
        .single();

      // Načtení položek
      const { data: itemsData } = await supabase
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', params.id);

      if (invData) setInvoice(invData);
      if (itemsData) setItems(itemsData);
      setLoading(false);
    };

    fetchInvoiceData();
  }, [params.id]);

  if (loading) return <div className="p-10 text-center font-sans">Načítání dokladu...</div>;
  if (!invoice) return <div className="p-10 text-center text-red-500 font-sans">Faktura nenalezena.</div>;

  // Sestavení českého platebního QR kódu (SPAYD standard)
  const formatAmount = (amount: number) => amount.toFixed(2);
  const spaydString = `SPD*1.0*ACC:${invoice.iban}*AM:${formatAmount(invoice.total_amount)}*CC:CZK*X-VS:${invoice.variable_symbol}`;

  const isProforma = invoice.type === 'proforma';

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 pb-20 print:bg-white print:pb-0">
      
      {/* Nástrojová lišta (nebude vidět při tisku) */}
      <div className="max-w-[800px] mx-auto pt-8 pb-4 flex justify-between items-center print:hidden">
        <Link href="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Zpět
        </Link>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-amber-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm hover:bg-amber-700 transition"
        >
          <Printer className="w-4 h-4" /> Vytisknout / Uložit PDF
        </button>
      </div>

      {/* Papír A4 */}
      <div className="max-w-[800px] mx-auto bg-white p-12 md:p-16 shadow-lg print:shadow-none print:p-0">
        
        {/* Hlavička */}
        <header className="flex justify-between items-start mb-16">
          <div>
            <h1 className="text-4xl font-black mb-2 text-gray-900 tracking-tight">
              {isProforma ? 'Zálohová faktura' : 'Faktura'}
            </h1>
            <div className="text-gray-500 text-lg font-medium mb-1">
              {isProforma ? 'Výzva k platbě č.' : 'Daňový doklad č.'} {invoice.invoice_number}
            </div>
            
{/* Tvé údaje (DODAVATEL) */}
<div className="mt-8">
  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Dodavatel</h3>
  <div className="font-bold text-gray-900">{process.env.NEXT_PUBLIC_SUPPLIER_NAME}</div>
  <div className="text-sm text-gray-600 mt-1">
    {/* Přidáno ( ... || '') kolem proměnné */}
    {(process.env.NEXT_PUBLIC_SUPPLIER_ADDRESS || '').split(', ').map((line, i) => (
      <span key={i}>{line}<br /></span>
    ))}
    IČ: {process.env.NEXT_PUBLIC_SUPPLIER_IC}
  </div>
</div>
          </div>

          {/* Odběratel */}
          <div className="text-right">
             <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-left min-w-[280px]">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Odběratel</h3>
                <div className="font-bold text-gray-900 text-lg">{invoice.billing_clients.name}</div>
                <div className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {invoice.billing_clients.street}<br />
                  {invoice.billing_clients.zip} {invoice.billing_clients.city}<br />
                </div>
                <div className="mt-3 text-sm">
                  {invoice.billing_clients.ic && <div><span className="text-gray-400">IČ:</span> {invoice.billing_clients.ic}</div>}
                  {invoice.billing_clients.dic && <div><span className="text-gray-400">DIČ:</span> {invoice.billing_clients.dic}</div>}
                </div>
             </div>
          </div>
        </header>

        {/* Tabulka s datumy */}
        <div className="grid grid-cols-3 gap-6 mb-12 border-y border-gray-100 py-6">
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Datum vystavení</div>
            <div className="font-bold text-gray-900">{new Date(invoice.issue_date).toLocaleDateString('cs-CZ')}</div>
          </div>
          {/* Pro neplátce DPH je datum zdanitelného plnění stejné jako vystavení, případně se na zálohovce neuvádí */}
          {!isProforma && (
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Datum usk. zdan. plnění</div>
              <div className="font-bold text-gray-900">{new Date(invoice.issue_date).toLocaleDateString('cs-CZ')}</div>
            </div>
          )}
          <div>
            <div className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Datum splatnosti</div>
            <div className="font-black text-gray-900 text-lg">{new Date(invoice.due_date).toLocaleDateString('cs-CZ')}</div>
          </div>
        </div>

        {/* Položky faktury */}
        <table className="w-full mb-12">
          <thead>
            <tr className="border-b-2 border-gray-900">
              <th className="text-left py-3 text-sm font-bold text-gray-900">Popis položky</th>
              <th className="text-right py-3 text-sm font-bold text-gray-900 w-24">Množství</th>
              <th className="text-right py-3 text-sm font-bold text-gray-900 w-32">Cena za ks</th>
              <th className="text-right py-3 text-sm font-bold text-gray-900 w-32">Celkem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map(item => (
              <tr key={item.id}>
                <td className="py-4 text-gray-900 font-medium">{item.description}</td>
                <td className="py-4 text-right text-gray-600">{Number(item.quantity)}</td>
                <td className="py-4 text-right text-gray-600">{Number(item.unit_price).toLocaleString()} Kč</td>
                <td className="py-4 text-right font-bold text-gray-900">{(Number(item.quantity) * Number(item.unit_price)).toLocaleString()} Kč</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Patička s platebními údaji a QR kódem */}
        <div className="flex justify-between items-end border-t-2 border-gray-900 pt-8 mt-16">
          <div className="flex gap-8 items-center">
            
            {/* QR Kód */}
            <div className="p-3 border-2 border-gray-200 rounded-xl">
               <QRCodeSVG value={spaydString} size={120} />
            </div>
            
            {/* Platební údaje */}
            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Číslo účtu</span>
                <span className="font-black text-xl text-gray-900 tracking-tight">{invoice.bank_account}</span>
              </div>
              <div className="flex gap-8">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Variabilní symbol</span>
                  <span className="font-bold text-gray-900">{invoice.variable_symbol}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Částka</span>
                  <span className="font-bold text-gray-900">{Number(invoice.total_amount).toLocaleString()} CZK</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Celková suma velkým */}
          <div className="text-right">
            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Celkem k úhradě</div>
            <div className="text-4xl font-black text-gray-900 tracking-tighter">
              {Number(invoice.total_amount).toLocaleString()} Kč
            </div>
            <div className="text-xs text-gray-400 mt-2">Nejsem plátce DPH.</div>
          </div>
        </div>

      </div>
    </div>
  );
}