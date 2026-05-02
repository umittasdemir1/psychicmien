import Link from 'next/link';
import type { Metadata } from 'next';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { buildMetadata } from '@/lib/seo';
import styles from './horoscopes.module.css';

export const metadata: Metadata = buildMetadata({
  title: 'Burç Yorumları',
  description: 'Günlük, haftalık ve aylık burç yorumları. 12 burç için kapsamlı astroloji rehberi.',
});

const ELEMENT_MAP: Record<string, string> = {
  aries: 'fire', leo: 'fire', sagittarius: 'fire',
  taurus: 'earth', virgo: 'earth', capricorn: 'earth',
  gemini: 'air', libra: 'air', aquarius: 'air',
  cancer: 'water', scorpio: 'water', pisces: 'water',
};

const ELEMENT_LABELS: Record<string, string> = {
  fire: 'Ateş', earth: 'Toprak', air: 'Hava', water: 'Su',
};

export default function HoroscopesPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <h1>Burç Yorumları</h1>
          <p>Günlük, haftalık ve aylık yorumlar için burcunu seç</p>
        </header>

        <div className={styles.grid}>
          {ZODIAC_SIGNS.map((sign) => {
            const element = ELEMENT_MAP[sign.slug] ?? 'air';
            return (
              <Link key={sign.slug} href={`/horoscopes/${sign.slug}`} className={styles.card}>
                <div className={`${styles.cardTop} ${styles[element]}`}>
                  <img className={styles.icon} src={sign.icon} alt="" aria-hidden="true" />
                </div>
                <div className={styles.cardBody}>
                  <h2 className={styles.name}>{sign.name}</h2>
                  <p className={styles.dateRange}>{sign.dateRange}</p>
                  <span className={`${styles.elementBadge} ${styles[`badge_${element}`]}`}>
                    {ELEMENT_LABELS[element]}
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
