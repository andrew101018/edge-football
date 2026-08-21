import { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://edgefootball.com';

  // جلب روابط المقالات النشطة
  const { data: articles } = await supabaseAdmin
    .from('articles')
    .select('slug, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  const articleEntries: MetadataRoute.Sitemap = (articles || []).map((art) => ({
    url: `${baseUrl}/news/${art.slug}`,
    lastModified: new Date(art.created_at),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/live`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/standings`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/top-scorers`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/transfers`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.8,
    },
    ...articleEntries,
  ];
}