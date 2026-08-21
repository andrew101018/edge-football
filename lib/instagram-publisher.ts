export async function publishToInstagram({
  imageUrl,
  caption,
}: {
  imageUrl: string;
  caption: string;
}) {
  const instagramAccountId = process.env.INSTAGRAM_ACCOUNT_ID;
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!instagramAccountId || !accessToken) {
    throw new Error('Instagram credentials missing');
  }

  // الخطوة 1: إنشاء حاوية وسائط (Media Container)
  const containerRes = await fetch(
    `https://graph.facebook.com/v19.0/${instagramAccountId}/media`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: `${caption}\n\n#EDGE_Football #Football #كرة_قدم`,
        access_token: accessToken,
      }),
    }
  );

  const containerData = await containerRes.json();
  if (!containerData.id) throw new Error(containerData.error?.message || 'Failed to create IG container');

  // الخطوة 2: نشر الحاوية (Publish Media)
  const publishRes = await fetch(
    `https://graph.facebook.com/v19.0/${instagramAccountId}/media_publish`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: containerData.id,
        access_token: accessToken,
      }),
    }
  );

  const publishData = await publishRes.json();
  return publishData;
}