import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/data/supabase/server';
import { TarotRepository } from '@/data/repositories/TarotRepository';
import { GetTarotCard } from '@/domain/usecases/GetTarotCards';
import { buildMetadata } from '@/lib/seo';
import { locales } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import styles from './card.module.css';

interface Props {
  params: Promise<{ lang: string; card: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, card: slug } = await params;
  if (!(locales as readonly string[]).includes(lang)) return {};
  const supabase = await createServerSupabaseClient();
  const card = await new GetTarotCard(new TarotRepository(supabase)).execute(slug);
  if (!card) return {};
  return buildMetadata({
    title: `${card.name} — Tarot`,
    description: card.uprightMeaning ?? undefined,
    image: card.imageUrl ?? undefined,
  });
}

export default async function TarotCardPage({ params }: Props) {
  const { lang, card: slug } = await params;
  if (!(locales as readonly string[]).includes(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  const supabase = await createServerSupabaseClient();
  const card = await new GetTarotCard(new TarotRepository(supabase)).execute(slug);
  if (!card) notFound();

  const SUIT_LABELS: Record<string, string> = {
    cups: dict.tarot.cups,
    wands: dict.tarot.wands,
    swords: dict.tarot.swords,
    pentacles: dict.tarot.pentacles,
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href={`/${lang}/tarot`}>{dict.tarot.title}</Link>
          <span>/</span>
          <span>{card.name}</span>
        </nav>

        <div className={styles.layout}>
          <div className={styles.imageCol}>
            <div className={styles.cardImage}>
              {card.imageUrl ? (
                <Image src={card.imageUrl} alt={card.name} width={280} height={420} style={{ width: '100%', height: 'auto' }} unoptimized />
              ) : (
                <div className={styles.imagePlaceholder}>🔮</div>
              )}
            </div>
            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span>Arcana</span>
                <strong>{card.arcana === 'major' ? dict.tarot.major_arcana : dict.tarot.minor_arcana}</strong>
              </div>
              {card.suit && (
                <div className={styles.metaItem}>
                  <span>Suit</span>
                  <strong>{SUIT_LABELS[card.suit] ?? card.suit}</strong>
                </div>
              )}
              {card.cardNumber !== null && (
                <div className={styles.metaItem}>
                  <span>#</span>
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
                <h2>{dict.tarot.keywords}</h2>
                <p>{card.description}</p>
              </section>
            )}

            {card.uprightMeaning && (
              <section className={styles.section}>
                <h2 className={styles.uprightTitle}>⬆ {dict.tarot.upright}</h2>
                <p>{card.uprightMeaning}</p>
              </section>
            )}

            {card.reversedMeaning && (
              <section className={styles.section}>
                <h2 className={styles.reversedTitle}>⬇ {dict.tarot.reversed}</h2>
                <p>{card.reversedMeaning}</p>
              </section>
            )}
          </div>
        </div>

        <div style={{ marginTop: 'var(--space-8)' }}>
          <Link href={`/${lang}/tarot`} style={{ color: 'var(--color-primary)' }}>
            ← {dict.tarot.back}
          </Link>
        </div>
      </div>
    </div>
  );
}
