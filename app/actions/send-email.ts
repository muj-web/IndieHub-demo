'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// -------------------------------------------------------------
// 1. ODESÍLÁNÍ PRO SVATEBNÍ FORMULÁŘ (např. z Brna)
// -------------------------------------------------------------
export async function sendWeddingInquiry(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const date = formData.get('date') as string;
  const location = formData.get('location') as string;
  const message = formData.get('message') as string;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Radek Čech <info@send.radekcech.cz>', 
      to: ['jsem@radekcech.cz'],
      subject: `Nová poptávka svatby: ${name} - ${date}`,
      replyTo: email,
      html: `
        <h2>Nová poptávka svatby z webu</h2>
        <p><strong>Jméno:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone || 'Neuvedeno'}</p>
        <p><strong>Datum:</strong> ${date}</p>
        <p><strong>Místo:</strong> ${location}</p>
        <p><strong>Zpráva:</strong><br />${message || 'Bez zprávy'}</p>
      `,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Něco se pokazilo' };
  }
}

// -------------------------------------------------------------
// 2. ODESÍLÁNÍ PRO OBECNÝ KONTAKTNÍ FORMULÁŘ (/kontakt)
// -------------------------------------------------------------
export async function sendContactInquiry(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const service = formData.get('service') as string;
  const date = formData.get('date') as string;
  const message = formData.get('message') as string;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Radek Čech <info@send.radekcech.cz>',
      to: ['jsem@radekcech.cz'],
      subject: `Nová poptávka (${service}): ${name}`,
      replyTo: email,
      html: `
        <h2>Nová zpráva z hlavního kontaktu</h2>
        <p><strong>Služba:</strong> ${service}</p>
        <p><strong>Jméno:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Termín:</strong> ${date || 'Neuvedeno'}</p>
        <p><strong>Zpráva:</strong><br />${message || 'Bez zprávy'}</p>
      `,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Chyba serveru' };
  }
}