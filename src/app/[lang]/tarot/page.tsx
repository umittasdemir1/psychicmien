import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/data/supabase/server';
import { TarotRepository } from '@/data/repositories/TarotRepository';
import { GetTarotCards } from '@/domain/usecases/GetTarotCards';
import { buildMetadata } from '@/lib/seo';
import { locales } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import styles from './tarot.module.css';

interface Props {
  params: Promise<{ lang: string }>;
}

export const revalidate = 86400;

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!(locales as readonly string[]).includes(lang)) return {};
  const dict = await getDictionary(lang as Locale);
  return buildMetadata({
    title: dict.tarot.title,
    description: dict.tarot.subtitle,
  });
}

export default async function TarotPage({ params }: Props) {
  const { lang } = await params;
  if (!(locales as readonly string[]).includes(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  const supabase = await createServerSupabaseClient();
  const cards = await new GetTarotCards(new TarotRepository(supabase)).execute().catch(() => []);

  const major = cards.filter((c) => c.arcana === 'major');
  const minor = cards.filter((c) => c.arcana === 'minor');
  const suits = Array.from(new Set(minor.map((c) => c.suit).filter(Boolean))) as string[];

  const SUIT_LABELS: Record<string, string> = {
    cups: dict.tarot.cups,
    wands: dict.tarot.wands,
    swords: dict.tarot.swords,
    pentacles: dict.tarot.pentacles,
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <h1>{dict.tarot.title}</h1>
          <p>{dict.tarot.subtitle}</p>
        </header>

        {cards.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: 'var(--space-16) 0' }}>
            {dict.tarot.no_cards}
          </p>
        ) : (
          <>
            {major.length > 0 && (
              <section className={styles.arcana}>
                <h2>{dict.tarot.major_arcana} <span>({major.length})</span></h2>
                <div className={styles.grid}>
                  {major.map((card) => <TarotCardItem key={card.id} card={card} lang={lang} />)}
                </div>
              </section>
            )}

            {suits.map((suit) => {
              const suitCards = minor.filter((c) => c.suit === suit);
              return (
                <section key={suit} className={styles.arcana}>
                  <h2>{SUIT_LABELS[suit] ?? suit} <span>({suitCards.length})</span></h2>
                  <div className={styles.grid}>
                    {suitCards.map((card) => <TarotCardItem key={card.id} card={card} lang={lang} />)}
                  </div>
                </section>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

function TarotCardItem({ card, lang }: { card: { slug: string; name: string; imageUrl: string | null; cardNumber: number | null; keywords: string[] }; lang: string }) {
  return (
    <Link href={`/${lang}/tarot/${card.slug}`} className={styles.card}>
      <div className={styles.cardImage}>
        {card.imageUrl ? (
          <Image src={card.imageUrl} alt={card.name} fill sizes="(max-width: 640px) 33vw, (max-width: 900px) 25vw, (max-width: 1200px) 20vw, 16vw" style={{ objectFit: 'cover' }} unoptimized />
        ) : (
          <span className={styles.cardPlaceholder}>🔮</span>
        )}
        {card.cardNumber !== null && <span className={styles.cardNum}>{card.cardNumber}</span>}
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardName}>{card.name}</h3>
        {card.keywords.length > 0 && (
          <p className={styles.keywords}>{card.keywords.slice(0, 3).join(' · ')}</p>
        )}
      </div>
    </Link>
  );
}
