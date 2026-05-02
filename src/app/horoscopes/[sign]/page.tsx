import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/data/supabase/server';
import { HoroscopeRepository } from '@/data/repositories/HoroscopeRepository';
import { GetHoroscope } from '@/domain/usecases/GetHoroscope';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { buildMetadata } from '@/lib/seo';
import styles from './sign.module.css';

interface Props {
  params: Promise<{ sign: string }>;
}

export async function generateStaticParams() {
  return ZODIAC_SIGNS.map((s) => ({ sign: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sign } = await params;
  const signData = ZODIAC_SIGNS.find((s) => s.slug === sign);
  if (!signData) return {};
  return buildMetadata({
    title: `${signData.name} Burcu Yorumu`,
    description: `${signData.name} burcu için günlük, haftalık ve aylık astroloji yorumları.`,
  });
}

const PERIOD_LABELS = { daily: 'Günlük', weekly: 'Haftalık', monthly: 'Aylık' } as const;

export default async function SignPage({ params }: Props) {
  const { sign } = await params;
  const signData = ZODIAC_SIGNS.find((s) => s.slug === sign);
  if (!signData) notFound();

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
            <img className={styles.icon} src={signData.icon} alt="" aria-hidden="true" />
          </div>
          <h1>{signData.name} Burcu</h1>
          <p className={styles.dateRange}>{signData.dateRange}</p>
        </header>

        <div className={styles.periods}>
          {([['daily', daily], ['weekly', weekly], ['monthly', monthly]] as const).map(([period, data]) => (
            <section key={period} className={styles.periodCard}>
              <h2>{PERIOD_LABELS[period]} Yorum</h2>
              {data ? (
                <>
                  <p className={styles.content}>{data.content}</p>
                  {(data.loveRating || data.careerRating || data.healthRating) && (
                    <div className={styles.ratings}>
                      {data.loveRating && <RatingBar label="Aşk" value={data.loveRating} />}
                      {data.careerRating && <RatingBar label="Kariyer" value={data.careerRating} />}
                      {data.healthRating && <RatingBar label="Sağlık" value={data.healthRating} />}
                    </div>
                  )}
                  {(data.luckyNumber || data.luckyColor) && (
                    <div className={styles.lucky}>
                      {data.luckyNumber && <span>Şanslı Sayı: <strong>{data.luckyNumber}</strong></span>}
                      {data.luckyColor && <span>Şanslı Renk: <strong>{data.luckyColor}</strong></span>}
                    </div>
                  )}
                </>
              ) : (
                <p className={styles.empty}>Yorum yakında eklenecek.</p>
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
