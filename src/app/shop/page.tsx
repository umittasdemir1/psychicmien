import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/data/supabase/server';
import { ProductRepository } from '@/data/repositories/ProductRepository';
import { GetProducts } from '@/domain/usecases/GetProducts';
import { buildMetadata } from '@/lib/seo';
import styles from './shop.module.css';

export const metadata: Metadata = buildMetadata({
  title: 'Spiritüel Mağaza',
  description: 'Tarot desteleri, kristaller, spiritüel kitaplar ve daha fazlası. Etsy mağazamızda keşfet.',
});

export const revalidate = 3600;

export default async function ShopPage() {
  const supabase = await createServerSupabaseClient();
  const products = await new GetProducts(new ProductRepository(supabase)).execute(false).catch(() => []);

  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean))) as string[];

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <h1>Spiritüel Mağaza</h1>
          <p>Tarot desteleri, kristaller ve spiritüel araçlar — Etsy&apos;den güvenle satın al</p>
        </header>

        {categories.length > 1 && (
          <div className={styles.filters}>
            <a href="/shop" className={styles.filterBtn}>Tümü</a>
            {categories.map((cat) => (
              <a key={cat} href={`/shop?category=${encodeURIComponent(cat)}`} className={styles.filterBtn}>{cat}</a>
            ))}
          </div>
        )}

        {products.length === 0 ? (
          <div className={styles.empty}>
            <p>Ürünler yakında eklenecek.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map((product) => (
              <article key={product.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.title} className={styles.image} />
                  ) : (
                    <div className={styles.imagePlaceholder}>✨</div>
                  )}
                  {product.isFeatured && <span className={styles.featuredBadge}>Öne Çıkan</span>}
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
                      Etsy&apos;de Satın Al
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className={styles.disclosure}>
          <p>Bu sayfadaki Etsy bağlantıları üzerinden yapılan alışverişlerden komisyon kazanabiliriz.</p>
        </div>
      </div>
    </div>
  );
}
