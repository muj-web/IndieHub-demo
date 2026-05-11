'use server';

// Tuto akci zavoláš po kliknutí na tlačítko "Odeslat na web"
export async function publishToPersonalWeb(article: {
  id: string; 
  title: string;
  slug: string;
  content_html: string;
  cover_image?: string;
  tags?: string[];
  is_published: boolean;
}) {
  const webhookUrl = `${process.env.PERSONAL_WEB_URL}/api/webhook/publish`;
  const secret = process.env.WEBHOOK_SECRET;

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secret}`, 
      },
      body: JSON.stringify({
        indiehub_id: article.id,
        title: article.title,
        slug: article.slug,
        content_html: article.content_html,
        cover_image: article.cover_image || null,
        tags: article.tags || [],
        is_published: article.is_published,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Chyba při odesílání na osobní web');
    }

    const data = await response.json();
    return { success: true, message: data.message };

  } catch (error: any) {
    console.error('Chyba odesílání webhooku z IndieHubu:', error);
    return { success: false, error: error.message };
  }
}