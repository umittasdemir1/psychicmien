import Link from 'next/link';
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/data/supabase/server';
import { BlogRepository } from '@/data/repositories/BlogRepository';
import { GetBlogPosts } from '@/domain/usecases/GetBlogPosts';
import { buildMetadata } from '@/lib/seo';
import { formatDate, truncate } from '@/lib/utils';
import styles from './blog.module.css';

export const metadata: Metadata = buildMetadata({
  title: 'Blog',
  description: 'Tarot rehberleri, burç yorumları, spiritüel bilgelik ve mistik konularda yazılar.',
});

export const revalidate = 3600;

export default async function BlogPage() {
  const supabase = await createServerSupabaseClient();
  const posts = await new GetBlogPosts(new BlogRepository(supabase)).execute(true).catch(() => []);

  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean))) as string[];
  const [featured, ...rest] = posts;

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <h1>Blog</h1>
          <p>Spiritüel bilgelik, tarot rehberleri ve daha fazlası</p>
        </header>

        {categories.length > 0 && (
          <div className={styles.filters}>
            {categories.map((cat) => (
              <span key={cat} className={styles.filterTag}>{cat}</span>
            ))}
          </div>
        )}

        {posts.length === 0 ? (
          <p className={styles.empty}>Yazılar yakında eklenecek.</p>
        ) : (
          <>
            {featured && (
              <Link href={`/blog/${featured.slug}`} className={styles.featured}>
                {featured.coverImage && (
                  <div className={styles.featuredImage}>
                    <img src={featured.coverImage} alt={featured.title} />
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
                <Link key={post.id} href={`/blog/${post.slug}`} className={styles.card}>
                  {post.coverImage && (
                    <div className={styles.cardImage}>
                      <img src={post.coverImage} alt={post.title} />
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
