import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/data/supabase/server';
import { BlogRepository } from '@/data/repositories/BlogRepository';
import { GetBlogPosts } from '@/domain/usecases/GetBlogPosts';
import { buildMetadata } from '@/lib/seo';
import { formatDate, truncate } from '@/lib/utils';
import { locales } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import styles from './blog.module.css';

interface Props {
  params: Promise<{ lang: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!(locales as readonly string[]).includes(lang)) return {};
  const dict = await getDictionary(lang as Locale);
  return buildMetadata({
    title: dict.blog.title,
    description: dict.blog.subtitle,
  });
}

export default async function BlogPage({ params }: Props) {
  const { lang } = await params;
  if (!(locales as readonly string[]).includes(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  const supabase = await createServerSupabaseClient();
  const posts = await new GetBlogPosts(new BlogRepository(supabase)).execute(true).catch(() => []);

  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean))) as string[];
  const [featured, ...rest] = posts;

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <h1>{dict.blog.title}</h1>
          <p>{dict.blog.subtitle}</p>
        </header>

        {categories.length > 0 && (
          <div className={styles.filters}>
            {categories.map((cat) => (
              <span key={cat} className={styles.filterTag}>{cat}</span>
            ))}
          </div>
        )}

        {posts.length === 0 ? (
          <p className={styles.empty}>{dict.blog.no_posts}</p>
        ) : (
          <>
            {featured && (
              <Link href={`/${lang}/blog/${featured.slug}`} className={styles.featured}>
                {featured.coverImage && (
                  <div className={styles.featuredImage}>
                    <Image src={featured.coverImage} alt={featured.title} fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: 'cover' }} unoptimized />
                  </div>
                )}
                <div className={styles.featuredBody}>
                  {featured.category && <span className={styles.category}>{featured.category}</span>}
                  <h2 className={styles.featuredTitle}>{featured.title}</h2>
                  {featured.excerpt && <p className={styles.excerpt}>{truncate(featured.excerpt, 200)}</p>}
                  {featured.publishedAt && (
                    <p className={styles.date}>{formatDate(featured.publishedAt)}</p>
                  )}
                </div>
              </Link>
            )}

            <div className={styles.grid}>
              {rest.map((post) => (
                <Link key={post.id} href={`/${lang}/blog/${post.slug}`} className={styles.card}>
                  {post.coverImage && (
                    <div className={styles.cardImage}>
                      <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" style={{ objectFit: 'cover' }} unoptimized />
                    </div>
                  )}
                  <div className={styles.cardBody}>
                    {post.category && <span className={styles.category}>{post.category}</span>}
                    <h3 className={styles.cardTitle}>{post.title}</h3>
                    {post.excerpt && <p className={styles.excerpt}>{truncate(post.excerpt, 120)}</p>}
                    {post.publishedAt && <p className={styles.date}>{formatDate(post.publishedAt)}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
