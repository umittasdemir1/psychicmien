import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import DOMPurify from 'isomorphic-dompurify';
import { createServerSupabaseClient } from '@/data/supabase/server';
import { BlogRepository } from '@/data/repositories/BlogRepository';
import { GetBlogPost } from '@/domain/usecases/GetBlogPosts';
import { buildMetadata } from '@/lib/seo';
import { formatDate } from '@/lib/utils';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { locales } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import styles from './post.module.css';

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const post = await new GetBlogPost(new BlogRepository(supabase)).execute(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt ?? undefined,
    image: post.coverImage ?? undefined,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!(locales as readonly string[]).includes(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  const supabase = await createServerSupabaseClient();
  const post = await new GetBlogPost(new BlogRepository(supabase)).execute(slug);
  if (!post || !post.isPublished) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.coverImage ?? undefined,
    datePublished: post.publishedAt ?? undefined,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    url: `${SITE_URL}/${lang}/blog/${post.slug}`,
    inLanguage: lang,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className={styles.page}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href={`/${lang}/blog`}>{dict.blog.title}</Link>
            <span>/</span>
            <span>{post.title}</span>
          </nav>

          <header className={styles.header}>
            {post.category && <span className={styles.category}>{post.category}</span>}
            <h1 className={styles.title}>{post.title}</h1>
            {post.publishedAt && (
              <time className={styles.date} dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
            )}
            {post.tags.length > 0 && (
              <div className={styles.tags}>
                {post.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            )}
          </header>

          {post.coverImage && (
            <div className={styles.cover}>
              <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 900px) 100vw, 900px" style={{ objectFit: 'cover' }} unoptimized />
            </div>
          )}

          <div
            className={styles.body}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content ?? '') }}
          />

          <div style={{ marginTop: 'var(--space-8)' }}>
            <Link href={`/${lang}/blog`} style={{ color: 'var(--color-primary)' }}>
              ← {dict.blog.back}
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
