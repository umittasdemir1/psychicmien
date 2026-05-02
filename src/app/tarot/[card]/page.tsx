import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/data/supabase/server';
import { TarotRepository } from '@/data/repositories/TarotRepository';
import { GetTarotCard } from '@/domain/usecases/GetTarotCards';
import { buildMetadata } from '@/lib/seo';
import styles from './card.module.css';

interface Props {
  params: Promise<{ card: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { card: slug } = await params;
  const supabase = await createServerSupabaseClient();
  const card = await new GetTarotCard(new TarotRepository(supabase)).execute(slug);
  if (!card) return {};
  return buildMetadata({
    title: `${card.name} Tarot Kartı`,
    description: card.uprightMeaning ?? `${card.name} tarot kartının anlamı ve yorumu.`,
    image: card.imageUrl ?? undefined,
  });
}

export default async function TarotCardPage({ params }: Props) {
  const { card: slug } = await params;
  const supabase = await createServerSupabaseClient();
  const card = await new GetTarotCard(new TarotRepository(supabase)).execute(slug);
  if (!card) notFound();

  const SUIT_LABELS: Record<string, string> = {
    cups: 'Kupalar', wands: 'Asalar', swords: 'Kılıçlar', pentacles: 'Pentaküller',
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/tarot">Tarot</Link>
          <span>/</span>
          <span>{card.name}</span>
        </nav>

        <div className={styles.layout}>
          <div className={styles.imageCol}>
            <div className={styles.cardImage}>
              {card.imageUrl ? (
                <img src={card.imageUrl} alt={card.name} />
              ) : (
                <div className={styles.imagePlaceholder}>🔮</div>
              )}
            </div>
            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span>Arcana</span>
                <strong>{card.arcana === 'major' ? 'Major Arcana' : 'Minor Arcana'}</strong>
              </div>
              {card.suit && (
                <div className={styles.metaItem}>
                  <span>Takım</span>
                  <strong>{SUIT_LABELS[card.suit] ?? card.suit}</strong>
                </div>
              )}
              {card.cardNumber !== null && (
                <div className={styles.metaItem}>
                  <span>Numara</span>
                  <strong>{card.cardNumber}</strong>
                </div>
              )}
            </div>
          </div>

          <div className={styles.content}>
            <h1>{card.name}</h1>

            {card.keywords.length > 0 && (
              <div className={styles.keywords}>
                {card.keywords.map((kw) => (
                  <span key={kw} className={styles.keyword}>{kw}</span>
                ))}
              </div>
            )}

            {card.description && (
              <section className={styles.section}>
                <h2>Genel Anlam</h2>
                <p>{card.description}</p>
              </section>
            )}

            {card.uprightMeaning && (
              <section className={styles.section}>
                <h2 className={styles.uprightTitle}>⬆ Düz Anlam</h2>
                <p>{card.uprightMeaning}</p>
              </section>
            )}

            {card.reversedMeaning && (
              <section className={styles.section}>
                <h2 className={styles.reversedTitle}>⬇ Ters Anlam</h2>
                <p>{card.reversedMeaning}</p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
