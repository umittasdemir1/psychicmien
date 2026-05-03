import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { buildMetadata } from '@/lib/seo';
import { locales } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import styles from './horoscopes.module.css';

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
  return buildMetadata({
    title: dict.horoscopes.title,
    description: dict.horoscopes.subtitle,
  });
}

const ELEMENT_MAP: Record<string, string> = {
  aries: 'fire', leo: 'fire', sagittarius: 'fire',
  taurus: 'earth', virgo: 'earth', capricorn: 'earth',
  gemini: 'air', libra: 'air', aquarius: 'air',
  cancer: 'water', scorpio: 'water', pisces: 'water',
};

const ELEMENT_LABELS_TR: Record<string, string> = {
  fire: 'Ateş', earth: 'Toprak', air: 'Hava', water: 'Su',
};
const ELEMENT_LABELS_EN: Record<string, string> = {
  fire: 'Fire', earth: 'Earth', air: 'Air', water: 'Water',
};
const ELEMENT_LABELS_ES: Record<string, string> = {
  fire: 'Fuego', earth: 'Tierra', air: 'Aire', water: 'Agua',
};

const ELEMENT_LABELS_MAP: Record<string, Record<string, string>> = {
  tr: ELEMENT_LABELS_TR,
  en: ELEMENT_LABELS_EN,
  es: ELEMENT_LABELS_ES,
};

export default async function HoroscopesPage({ params }: Props) {
  const { lang } = await params;
  if (!(locales as readonly string[]).includes(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const elementLabels = ELEMENT_LABELS_MAP[lang] ?? ELEMENT_LABELS_EN;

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <h1>{dict.horoscopes.title}</h1>
          <p>{dict.horoscopes.subtitle}</p>
        </header>

        <div className={styles.grid}>
          {ZODIAC_SIGNS.map((sign) => {
            const element = ELEMENT_MAP[sign.slug] ?? 'air';
            return (
              <Link key={sign.slug} href={`/${lang}/horoscopes/${sign.slug}`} className={styles.card}>
                <div className={`${styles.cardTop} ${styles[element]}`}>
                  <img className={styles.icon} src={sign.icon} alt="" aria-hidden="true" />
                </div>
                <div className={styles.cardBody}>
                  <h2 className={styles.name}>{dict.zodiac[sign.slug as keyof typeof dict.zodiac]}</h2>
                  <p className={styles.dateRange}>{dict.zodiacDates[sign.slug as keyof typeof dict.zodiacDates]}</p>
                  <span className={`${styles.elementBadge} ${styles[`badge_${element}`]}`}>
                    {elementLabels[element]}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
