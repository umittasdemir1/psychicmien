import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import DOMPurify from 'isomorphic-dompurify';
import { createServerSupabaseClient } from '@/data/supabase/server';
import { BlogRepository } from '@/data/repositories/BlogRepository';
import { GetBlogPost } from '@/domain/usecases/GetBlogPosts';
import { buildMetadata } from '@/lib/seo';
import { formatDate } from '@/lib/utils';
import styles from './post.module.css';

interface Props {
  params: Promise<{ slug: string }>;
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
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const post = await new GetBlogPost(new BlogRepository(supabase)).execute(slug);
  if (!post || !post.isPublished) notFound();

  return (
    <article className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/blog">Blog</Link>
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
            <img src={post.coverImage} alt={post.title} />
          </div>
        )}

        <div
          className={styles.body}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content ?? '') }}
        />
      </div>
    </article>
  );
}
