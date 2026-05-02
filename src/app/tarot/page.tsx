import Link from 'next/link';
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/data/supabase/server';
import { TarotRepository } from '@/data/repositories/TarotRepository';
import { GetTarotCards } from '@/domain/usecases/GetTarotCards';
import { buildMetadata } from '@/lib/seo';
import styles from './tarot.module.css';

export const metadata: Metadata = buildMetadata({
  title: 'Tarot Rehberi',
  description: '78 tarot kartının anlamları, anahtar kelimeleri ve yorumları. Major ve Minor Arcana rehberi.',
});

export const revalidate = 86400;

export default async function TarotPage() {
  const supabase = await createServerSupabaseClient();
  const cards = await new GetTarotCards(new TarotRepository(supabase)).execute().catch(() => []);

  const major = cards.filter((c) => c.arcana === 'major');
  const minor = cards.filter((c) => c.arcana === 'minor');
  const suits = Array.from(new Set(minor.map((c) => c.suit).filter(Boolean))) as string[];

  const SUIT_LABELS: Record<string, string> = {
    cups: 'Kupalar', wands: 'Asalar', swords: 'Kılıçlar', pentacles: 'Pentaküller',
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <h1>Tarot Rehberi</h1>
          <p>78 kartın anlamlarını, sembolizmini ve yorumlarını keşfet</p>
        </header>

        {cards.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: 'var(--space-16) 0' }}>
            Kartlar yakında eklenecek.
          </p>
        ) : (
          <>
            {major.length > 0 && (
              <section className={styles.arcana}>
                <h2>Major Arcana <span>({major.length} kart)</span></h2>
                <div className={styles.grid}>
                  {major.map((card) => <TarotCardItem key={card.id} card={card} />)}
                </div>
              </section>
            )}

            {suits.map((suit) => {
              const suitCards = minor.filter((c) => c.suit === suit);
              return (
                <section key={suit} className={styles.arcana}>
                  <h2>{SUIT_LABELS[suit] ?? suit} <span>({suitCards.length} kart)</span></h2>
                  <div className={styles.grid}>
                    {suitCards.map((card) => <TarotCardItem key={card.id} card={card} />)}
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

function TarotCardItem({ card }: { card: { slug: string; name: string; imageUrl: string | null; cardNumber: number | null; keywords: string[] } }) {
  return (
    <Link href={`/tarot/${card.slug}`} className={styles.card}>
      <div className={styles.cardImage}>
        {card.imageUrl ? (
          <img src={card.imageUrl} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
