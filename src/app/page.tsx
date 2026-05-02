import Link from 'next/link';
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/data/supabase/server';
import { ProductRepository } from '@/data/repositories/ProductRepository';
import { BlogRepository } from '@/data/repositories/BlogRepository';
import { GetProducts } from '@/domain/usecases/GetProducts';
import { GetBlogPosts } from '@/domain/usecases/GetBlogPosts';
import { LinkButton } from '@/presentation/components/shared/Button';
import { ZODIAC_SIGNS, SITE_DESCRIPTION } from '@/lib/constants';
import { formatDate, truncate } from '@/lib/utils';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'PsychicMien — Tarot, Burçlar & Spiritüel Rehberlik',
  description: SITE_DESCRIPTION,
};

export const revalidate = 3600;

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const products = await new GetProducts(new ProductRepository(supabase)).execute(true).catch(() => []);
  const posts = await new GetBlogPosts(new BlogRepository(supabase)).execute(true).catch(() => []);

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <span className={styles.heroEyebrow}>Spiritüel Rehberlik</span>
          <h1 className={styles.heroTitle}>
            Evrenin Sesini <span>Dinle</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Tarot okumları, burç yorumları ve spiritüel rehberlikle kendi yolunu keşfet.
          </p>
          <div className={styles.heroCta}>
            <LinkButton href="/horoscopes" variant="primary" size="lg">Burcunu Keşfet</LinkButton>
            <LinkButton href="/tarot" variant="secondary" size="lg">Tarot Rehberi</LinkButton>
          </div>
        </div>
      </section>

      {/* Zodiac Picker */}
      <section className={styles.zodiacSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Burç Yorumları</h2>
            <p>Günlük, haftalık ve aylık burç yorumlarına ulaş</p>
          </div>
          <div className={styles.zodiacGrid}>
            {ZODIAC_SIGNS.map((sign) => (
              <Link key={sign.slug} href={`/horoscopes/${sign.slug}`} className={styles.zodiacCard}>
                <span className={styles.zodiacSymbol} aria-hidden="true">{sign.symbol}</span>
                <span className={styles.zodiacName}>{sign.name}</span>
                <span className={styles.zodiacDate}>{sign.dateRange}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Shop */}
      {products.length > 0 && (
        <section className={styles.shopSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Spiritüel Mağaza</h2>
              <p>Tarot desteleri, kristaller ve spiritüel araçlar</p>
            </div>
            <div className={styles.productGrid}>
              {products.slice(0, 3).map((product) => (
                <article key={product.id} style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                }}>
                  {product.imageUrl && (
                    <div style={{ aspectRatio: '4/3', background: 'var(--color-border)' }}>
                      <img src={product.imageUrl} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ padding: 'var(--space-6)' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-2)' }}>{product.title}</h3>
                    {product.price && (
                      <p style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                        ${product.price}
                      </p>
                    )}
                    <a
                      href={product.etsyUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      style={{
                        display: 'inline-block',
                        marginTop: 'var(--space-4)',
                        padding: 'var(--space-2) var(--space-4)',
                        background: 'var(--color-primary)',
                        color: '#fff',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      Etsy&apos;de Gör
                    </a>
                  </div>
                </article>
              ))}
            </div>
            <div className={styles.sectionFooter}>
              <LinkButton href="/shop" variant="secondary">Tüm Ürünleri Gör</LinkButton>
            </div>
          </div>
        </section>
      )}

      {/* Blog Preview */}
      {posts.length > 0 && (
        <section className={styles.blogSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Son Yazılar</h2>
              <p>Spiritüel bilgelik, tarot rehberleri ve daha fazlası</p>
            </div>
            <div className={styles.blogGrid}>
              {posts.slice(0, 3).map((post) => (
                <article key={post.id} style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                }}>
                  {post.coverImage && (
                    <div style={{ aspectRatio: '16/9', background: 'var(--color-border)' }}>
                      <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ padding: 'var(--space-6)' }}>
                    {post.category && (
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--color-primary)',
                      }}>{post.category}</span>
                    )}
                    <h3 style={{ fontSize: '1.125rem', margin: 'var(--space-2) 0' }}>
                      <Link href={`/blog/${post.slug}`} style={{ color: 'inherit' }}>
                        {post.title}
                      </Link>
                    </h3>
                    {post.excerpt && (
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                        {truncate(post.excerpt, 120)}
                      </p>
                    )}
                    {post.publishedAt && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: 'var(--space-3)' }}>
                        {formatDate(post.publishedAt)}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
            <div className={styles.sectionFooter}>
              <LinkButton href="/blog" variant="secondary">Tüm Yazıları Gör</LinkButton>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
