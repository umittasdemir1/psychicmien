import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { locales } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import styles from './about.module.css';

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!(locales as readonly string[]).includes(lang)) return {};
  const dict = await getDictionary(lang as Locale);
  return buildMetadata({ title: dict.about.title });
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  if (!(locales as readonly string[]).includes(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.content}>
          <header className={styles.header}>
            <span className={styles.icon}>🔮</span>
            <h1 className={styles.title}>{dict.about.title}</h1>
            <p className={styles.lead}>
              PsychicMien, spiritüel rehberlik arayışındakilere kapsamlı ve güvenilir içerik sunmak amacıyla kurulmuştur.
            </p>
          </header>

          <section className={styles.section}>
            <h2>Misyonumuz</h2>
            <p>
              Tarot, astroloji, kristaller ve spiritüel gelişim alanlarında kaliteli, anlaşılır içerik üretiyoruz.
              Amacımız bu kadim bilgelik sistemlerini modern hayatla buluşturmak ve herkesin kendi spiritüel yolculuğunu
              özgürce keşfetmesine destek olmaktır.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Ne Sunuyoruz?</h2>
            <div className={styles.offerGrid}>
              {[
                { icon: '🃏', title: dict.nav.tarot, desc: dict.tarot.subtitle },
                { icon: '⭐', title: dict.nav.horoscopes, desc: dict.horoscopes.subtitle },
                { icon: '📖', title: dict.nav.blog, desc: dict.blog.subtitle },
                { icon: '🛍️', title: dict.nav.shop, desc: dict.shop.subtitle },
              ].map((item) => (
                <div key={item.title} className={styles.offerCard}>
                  <span className={styles.offerIcon}>{item.icon}</span>
                  <h3 className={styles.offerTitle}>{item.title}</h3>
                  <p className={styles.offerDesc}>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2>İletişim</h2>
            <p>
              Sorularınız, önerileriniz veya iş birliği talepleriniz için bize ulaşabilirsiniz.
              İçerik önerileri ve geri bildirimlerinizi bekliyoruz.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
