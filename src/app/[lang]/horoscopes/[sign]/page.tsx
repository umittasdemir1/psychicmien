import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/data/supabase/server';
import { HoroscopeRepository } from '@/data/repositories/HoroscopeRepository';
import { GetHoroscope } from '@/domain/usecases/GetHoroscope';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { buildMetadata } from '@/lib/seo';
import { locales } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import styles from './sign.module.css';

interface Props {
  params: Promise<{ lang: string; sign: string }>;
}

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    ZODIAC_SIGNS.map((sign) => ({ lang, sign: sign.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, sign } = await params;
  if (!(locales as readonly string[]).includes(lang)) return {};
  const signData = ZODIAC_SIGNS.find((s) => s.slug === sign);
  if (!signData) return {};
  const dict = await getDictionary(lang as Locale);
  const signName = dict.zodiac[sign as keyof typeof dict.zodiac] ?? signData.name;
  return buildMetadata({
    title: `${signName} ${dict.horoscopes.title}`,
    description: `${signName} ${dict.horoscopes.subtitle}`,
  });
}

export default async function SignPage({ params }: Props) {
  const { lang, sign } = await params;
  if (!(locales as readonly string[]).includes(lang)) notFound();
  const signData = ZODIAC_SIGNS.find((s) => s.slug === sign);
  if (!signData) notFound();

  const dict = await getDictionary(lang as Locale);
  const signName = dict.zodiac[sign as keyof typeof dict.zodiac] ?? signData.name;

  const PERIOD_LABELS = {
    daily: dict.horoscopes.daily,
    weekly: dict.horoscopes.weekly,
    monthly: dict.horoscopes.monthly,
  } as const;

  const supabase = await createServerSupabaseClient();
  const repo = new HoroscopeRepository(supabase);
  const usecase = new GetHoroscope(repo);

  const today = new Date().toISOString().split('T')[0];
  const [daily, weekly, monthly] = await Promise.all([
    usecase.execute(sign, 'daily', today).catch(() => null),
    usecase.execute(sign, 'weekly').catch(() => null),
    usecase.execute(sign, 'monthly').catch(() => null),
  ]);

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <div className={styles.symbolWrap}>
            <Image className={styles.icon} src={signData.icon} alt="" width={96} height={96} aria-hidden="true" />
          </div>
          <h1>{signName}</h1>
          <p className={styles.dateRange}>{dict.zodiacDates[sign as keyof typeof dict.zodiacDates] ?? signData.dateRange}</p>
        </header>

        <div className={styles.periods}>
          {([['daily', daily], ['weekly', weekly], ['monthly', monthly]] as const).map(([period, data]) => (
            <section key={period} className={styles.periodCard}>
              <h2>{PERIOD_LABELS[period]}</h2>
              {data ? (
                <>
                  <p className={styles.content}>{data.content}</p>
                  {(data.loveRating || data.careerRating || data.healthRating) && (
                    <div className={styles.ratings}>
                      {data.loveRating && <RatingBar label={dict.horoscopes.love} value={data.loveRating} />}
                      {data.careerRating && <RatingBar label={dict.horoscopes.career} value={data.careerRating} />}
                      {data.healthRating && <RatingBar label={dict.horoscopes.health} value={data.healthRating} />}
                    </div>
                  )}
                  {(data.luckyNumber || data.luckyColor) && (
                    <div className={styles.lucky}>
                      {data.luckyNumber && <span>{dict.horoscopes.lucky_number}: <strong>{data.luckyNumber}</strong></span>}
                      {data.luckyColor && <span>{dict.horoscopes.lucky_color}: <strong>{data.luckyColor}</strong></span>}
                    </div>
                  )}
                </>
              ) : (
                <p className={styles.empty}>{dict.horoscopes.no_content}</p>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.ratingRow}>
      <span className={styles.ratingLabel}>{label}</span>
      <div className={styles.ratingBar}>
        <div className={styles.ratingFill} style={{ width: `${(value / 10) * 100}%` }} />
      </div>
      <span className={styles.ratingValue}>{value}/10</span>
    </div>
  );
}
