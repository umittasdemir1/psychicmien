import type { MetadataRoute } from 'next';
import { createServerSupabaseClient } from '@/data/supabase/server';
import { SITE_URL, ZODIAC_SIGNS } from '@/lib/constants';
import { locales } from '@/i18n/config';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerSupabaseClient();

  const [{ data: posts }, { data: cards }] = await Promise.all([
    supabase.from('blog_posts').select('slug, updated_at').eq('is_published', true),
    supabase.from('tarot_cards').select('slug'),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = locales.flatMap((lang) => [
    { url: `${SITE_URL}/${lang}`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${SITE_URL}/${lang}/horoscopes`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${SITE_URL}/${lang}/tarot`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${SITE_URL}/${lang}/blog`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${SITE_URL}/${lang}/spiritual`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${SITE_URL}/${lang}/shop`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${SITE_URL}/${lang}/about`, changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${SITE_URL}/${lang}/privacy`, changeFrequency: 'yearly' as const, priority: 0.2 },
    { url: `${SITE_URL}/${lang}/terms`, changeFrequency: 'yearly' as const, priority: 0.2 },
  ]);

  const zodiacRoutes: MetadataRoute.Sitemap = locales.flatMap((lang) =>
    ZODIAC_SIGNS.map((sign) => ({
      url: `${SITE_URL}/${lang}/horoscopes/${sign.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))
  );

  const blogRoutes: MetadataRoute.Sitemap = locales.flatMap((lang) =>
    (posts ?? []).map((post) => ({
      url: `${SITE_URL}/${lang}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  );

  const tarotRoutes: MetadataRoute.Sitemap = locales.flatMap((lang) =>
    (cards ?? []).map((card) => ({
      url: `${SITE_URL}/${lang}/tarot/${card.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  );

  return [...staticRoutes, ...zodiacRoutes, ...blogRoutes, ...tarotRoutes];
}
