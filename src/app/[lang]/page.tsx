import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/data/supabase/server';
import { ProductRepository } from '@/data/repositories/ProductRepository';
import { BlogRepository } from '@/data/repositories/BlogRepository';
import { GetProducts } from '@/domain/usecases/GetProducts';
import { GetBlogPosts } from '@/domain/usecases/GetBlogPosts';
import { LinkButton } from '@/presentation/components/shared/Button';
import { ProductCard, BlogCard } from '@/presentation/components/cards';
import { ZODIAC_SIGNS, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/constants';
import { locales } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import styles from '../page.module.css';

interface Props {
  params: Promise<{ lang: string }>;
}

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: `PsychicMien — Tarot, ${lang === 'tr' ? 'Burçlar & Spiritüel Rehberlik' : lang === 'es' ? 'Horóscopos & Guía Espiritual' : 'Horoscopes & Spiritual Guidance'}`,
    description: SITE_DESCRIPTION,
  };
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  if (!(locales as readonly string[]).includes(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: lang,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/${lang}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const supabase = await createServerSupabaseClient();
  const products = await new GetProducts(new ProductRepository(supabase)).execute(true).catch(() => []);
  const posts = await new GetBlogPosts(new BlogRepository(supabase)).execute(true).catch(() => []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      {/* Zodiac Picker */}
      <section className={styles.zodiacSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.welcomeHeading}>
              {dict.home.zodiac_section}
              <Image src="/images/logo-light.svg" alt="PsychicMien" width={160} height={40} className={styles.welcomeLogo} loading="eager" />
            </h2>
            <p>{dict.home.zodiac_subtitle}</p>
          </div>
          <div className={styles.zodiacGrid}>
            {ZODIAC_SIGNS.map((sign) => (
              <Link key={sign.slug} href={`/${lang}/horoscopes/${sign.slug}`} className={styles.zodiacCard}>
                <Image className={styles.zodiacIcon} src={sign.icon} alt="" width={100} height={100} aria-hidden="true" />
                <span className={styles.zodiacName}>{dict.zodiac[sign.slug as keyof typeof dict.zodiac]}</span>
                <span className={styles.zodiacDate}>{dict.zodiacDates[sign.slug as keyof typeof dict.zodiacDates]}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tarot Section */}
      <section className={styles.tarotSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.welcomeHeading}>{dict.home.tarot_section}</h2>
            <p>{dict.home.tarot_subtitle}</p>
          </div>
          <div className={styles.tarotWrapper}>
            {/* Featured card — left */}
            <div className={styles.tarotFeatured}>
              <h3 className={styles.tarotFeaturedTitle}>{dict.home.tarot_featured_title}</h3>
              <button className={styles.tarotFeaturedBtn}>{dict.home.tarot_featured_cta}</button>
            </div>

            {/* 2x2 grid — right */}
            <div className={styles.tarotGrid}>
              {[
                { key: 'career',   label: dict.home.tarot_career,   img: '/images/tarot/career.png' },
                { key: 'love',     label: dict.home.tarot_love,     img: '/images/tarot/love.png' },
                { key: 'blind',    label: dict.home.tarot_blind,    img: '/images/tarot/blind.png' },
                { key: 'soulmate', label: dict.home.tarot_soulmate, img: '/images/tarot/soulmate.png' },
              ].map((card) => (
                <div key={card.key} className={styles.tarotCard}>
                  <div className={styles.tarotCardImgWrap}>
                    <Image src={card.img} alt="" width={96} height={96} aria-hidden="true" className={styles.tarotCardImg} />
                  </div>
                  <div className={styles.tarotCardContent}>
                    <h3 className={styles.tarotCardTitle}>{card.label}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Shop */}
      {products.length > 0 && (
        <section className={styles.shopSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>{dict.home.shop_section}</h2>
              <p>{dict.home.shop_subtitle}</p>
            </div>
            <div className={styles.productGrid}>
              {products.slice(0, 3).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  buyLabel={dict.shop.buy_on_etsy}
                />
              ))}
            </div>
            <div className={styles.sectionFooter}>
              <LinkButton href={`/${lang}/shop`} variant="secondary">{dict.home.shop_cta}</LinkButton>
            </div>
          </div>
        </section>
      )}

      {/* Blog Preview */}
      {posts.length > 0 && (
        <section className={styles.blogSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>{dict.home.blog_section}</h2>
              <p>{dict.home.blog_subtitle}</p>
            </div>
            <div className={styles.blogGrid}>
              {posts.slice(0, 3).map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  lang={lang}
                />
              ))}
            </div>
            <div className={styles.sectionFooter}>
              <LinkButton href={`/${lang}/blog`} variant="secondary">{dict.home.blog_cta}</LinkButton>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
