import type { MetadataRoute } from 'next';
import { createServerSupabaseClient } from '@/data/supabase/server';
import { SITE_URL, ZODIAC_SIGNS } from '@/lib/constants';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerSupabaseClient();

  const [{ data: posts }, { data: cards }] = await Promise.all([
    supabase.from('blog_posts').select('slug, updated_at').eq('is_published', true),
    supabase.from('tarot_cards').select('slug'),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/horoscopes`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/tarot`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/spiritual`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/shop`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const zodiacRoutes: MetadataRoute.Sitemap = ZODIAC_SIGNS.map((sign) => ({
    url: `${SITE_URL}/horoscopes/${sign.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const tarotRoutes: MetadataRoute.Sitemap = (cards ?? []).map((card) => ({
    url: `${SITE_URL}/tarot/${card.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...zodiacRoutes, ...blogRoutes, ...tarotRoutes];
}
