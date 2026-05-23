import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/data/supabase/server';
import { ProductRepository } from '@/data/repositories/ProductRepository';
import { GetProducts } from '@/domain/usecases/GetProducts';
import { buildMetadata } from '@/lib/seo';
import { locales } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import styles from './shop.module.css';

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
    title: dict.shop.title,
    description: dict.shop.subtitle,
  });
}

export default async function ShopPage({ params }: Props) {
  const { lang } = await params;
  if (!(locales as readonly string[]).includes(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  const supabase = await createServerSupabaseClient();
  const products = await new GetProducts(new ProductRepository(supabase)).execute(false).catch(() => []);

  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean))) as string[];

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <h1>{dict.shop.title}</h1>
          <p>{dict.shop.subtitle}</p>
        </header>

        {categories.length > 1 && (
          <div className={styles.filters}>
            <a href={`/${lang}/shop`} className={styles.filterBtn}>All</a>
            {categories.map((cat) => (
              <a key={cat} href={`/${lang}/shop?category=${encodeURIComponent(cat)}`} className={styles.filterBtn}>{cat}</a>
            ))}
          </div>
        )}

        {products.length === 0 ? (
          <div className={styles.empty}>
            <p>{dict.shop.no_products}</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map((product) => (
              <article key={product.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className={styles.image} unoptimized />
                  ) : (
                    <div className={styles.imagePlaceholder}>✨</div>
                  )}
                  {product.isFeatured && <span className={styles.featuredBadge}>{dict.shop.featured}</span>}
                </div>
                <div className={styles.body}>
                  {product.category && <span className={styles.category}>{product.category}</span>}
                  <h2 className={styles.title}>{product.title}</h2>
                  {product.description && <p className={styles.desc}>{product.description}</p>}
                  <div className={styles.footer}>
                    {product.price && (
                      <span className={styles.price}>
                        {product.price} {product.currency}
                      </span>
                    )}
                    <a
                      href={product.etsyUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className={styles.buyBtn}
                    >
                      {dict.shop.buy_on_etsy}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
