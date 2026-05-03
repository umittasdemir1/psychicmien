import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { locales } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import styles from './spiritual.module.css';

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
    title: dict.spiritual.title,
    description: dict.spiritual.subtitle,
  });
}

const CRYSTALS = [
  { name: 'Ametist', color: '#9B59B6', meaning: 'Sezgi, sakinlik, spiritüel farkındalık' },
  { name: 'Kuvars', color: '#F5F5F5', meaning: 'Enerji amplifikatörü, berraklık, şifa' },
  { name: 'Labradorit', color: '#5DADE2', meaning: 'Dönüşüm, koruma, sihirsel güç' },
  { name: 'Gül Kuvarsı', color: '#F1948A', meaning: 'Koşulsuz sevgi, öz-şefkat, kalp şifası' },
  { name: 'Obsidyen', color: '#2C3E50', meaning: 'Koruma, olumsuz enerjiyi uzaklaştırma' },
  { name: 'Sitrin', color: '#F4D03F', meaning: 'Bereket, pozitif enerji, yaratıcılık' },
];

export default async function SpiritualPage({ params }: Props) {
  const { lang } = await params;
  if (!(locales as readonly string[]).includes(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  const TOPICS = [
    {
      slug: 'tarot',
      icon: '🃏',
      title: dict.nav.tarot,
      description: dict.tarot.subtitle,
      href: `/${lang}/tarot`,
    },
    {
      slug: 'astrology',
      icon: '⭐',
      title: dict.nav.horoscopes,
      description: dict.horoscopes.subtitle,
      href: `/${lang}/horoscopes`,
    },
    {
      slug: 'crystals',
      icon: '💎',
      title: dict.spiritual.crystals,
      description: dict.spiritual.crystals_lead,
      href: '#crystals',
    },
    {
      slug: 'meditation',
      icon: '🧘',
      title: dict.spiritual.meditation,
      description: '',
      href: '#meditation',
    },
    {
      slug: 'numerology',
      icon: '🔢',
      title: dict.spiritual.numerology,
      description: dict.spiritual.numerology_lead,
      href: '#numerology',
    },
    {
      slug: 'dreams',
      icon: '🌙',
      title: dict.spiritual.dreams,
      description: '',
      href: '#dreams',
    },
  ];

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.hero}>
          <div className={styles.heroIcon}>🔮</div>
          <h1 className={styles.heroTitle}>{dict.spiritual.title}</h1>
          <p className={styles.heroSubtitle}>{dict.spiritual.subtitle}</p>
        </header>

        <section className={styles.topics}>
          <h2 className={styles.sectionTitle}>{dict.spiritual.topics}</h2>
          <div className={styles.topicsGrid}>
            {TOPICS.map((topic) => (
              <Link key={topic.slug} href={topic.href} className={styles.topicCard}>
                <span className={styles.topicIcon}>{topic.icon}</span>
                <h3 className={styles.topicTitle}>{topic.title}</h3>
                {topic.description && <p className={styles.topicDesc}>{topic.description}</p>}
              </Link>
            ))}
          </div>
        </section>

        <section id="crystals" className={styles.section}>
          <h2 className={styles.sectionTitle}>{dict.spiritual.crystals}</h2>
          <p className={styles.sectionLead}>{dict.spiritual.crystals_lead}</p>
          <div className={styles.crystalGrid}>
            {CRYSTALS.map((crystal) => (
              <div key={crystal.name} className={styles.crystalCard}>
                <div
                  className={styles.crystalDot}
                  style={{ background: crystal.color }}
                />
                <h3 className={styles.crystalName}>{crystal.name}</h3>
                <p className={styles.crystalMeaning}>{crystal.meaning}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="meditation" className={styles.section}>
          <h2 className={styles.sectionTitle}>{dict.spiritual.meditation}</h2>
          <div className={styles.meditationSteps}>
            {[
              { step: '01', title: 'Hazırlık', desc: 'Sakin bir ortam seçin, rahat bir pozisyon alın. Telefon bildirimlerini kapatın.' },
              { step: '02', title: 'Nefes', desc: 'Derin nefes alın: 4 sayarak içeri, 7 tutun, 8 sayarak dışarı. Zihninizi sakinleştirin.' },
              { step: '03', title: 'Odaklanma', desc: 'Bir nesneye, mantraya veya görselleştirmeye odaklanın. Düşünceler gelirse nazikçe geri dönün.' },
              { step: '04', title: 'Kapanış', desc: 'Yavaşça farkındalığınızı odaya getirin. Deneyiminizi bir deftere not alın.' },
            ].map((item) => (
              <div key={item.step} className={styles.meditationStep}>
                <span className={styles.stepNumber}>{item.step}</span>
                <div>
                  <h3 className={styles.stepTitle}>{item.title}</h3>
                  <p className={styles.stepDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="numerology" className={styles.section}>
          <h2 className={styles.sectionTitle}>{dict.spiritual.numerology}</h2>
          <p className={styles.sectionLead}>{dict.spiritual.numerology_lead}</p>
          <div className={styles.numberGrid}>
            {[
              { n: '1', title: 'Lider', desc: 'Bağımsızlık, yaratıcılık, öncülük.' },
              { n: '2', title: 'Arabulucu', desc: 'İşbirliği, denge, sezgi.' },
              { n: '3', title: 'İfadeci', desc: 'Yaratıcılık, iletişim, neşe.' },
              { n: '4', title: 'İnşaatçı', desc: 'Disiplin, güvenilirlik, çalışkanlık.' },
              { n: '5', title: 'Özgür Ruh', desc: 'Özgürlük, macera, değişim.' },
              { n: '6', title: 'Bakıcı', desc: 'Sorumluluk, sevgi, hizmet.' },
              { n: '7', title: 'Arayışçı', desc: 'Analiz, bilgelik, içe dönüklük.' },
              { n: '8', title: 'Güç', desc: 'Bolluk, liderlik, maddi başarı.' },
              { n: '9', title: 'İnsancıl', desc: 'Şefkat, evrensel sevgi, tamamlanma.' },
            ].map((item) => (
              <div key={item.n} className={styles.numberCard}>
                <span className={styles.numberBig}>{item.n}</span>
                <h3 className={styles.numberTitle}>{item.title}</h3>
                <p className={styles.numberDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="dreams" className={styles.section}>
          <h2 className={styles.sectionTitle}>{dict.spiritual.dreams}</h2>
          <div className={styles.dreamGrid}>
            {[
              { symbol: '🌊', name: 'Su', meaning: 'Duygular, bilinçaltı, dönüşüm' },
              { symbol: '🔥', name: 'Ateş', meaning: 'Tutku, arınma, dönüşüm' },
              { symbol: '🦋', name: 'Kelebek', meaning: 'Dönüşüm, özgürlük, ruhsal uyanış' },
              { symbol: '🌙', name: 'Ay', meaning: 'Sezgi, döngüler, dişil enerji' },
              { symbol: '🌳', name: 'Ağaç', meaning: 'Kökler, büyüme, yaşam enerjisi' },
              { symbol: '🏠', name: 'Ev', meaning: 'Benlik, ruh, güvenlik ihtiyacı' },
              { symbol: '✈️', name: 'Uçmak', meaning: 'Özgürlük, sınırları aşma, yükselmek' },
              { symbol: '🐍', name: 'Yılan', meaning: 'Dönüşüm, bilgelik, şifa enerjisi' },
            ].map((item) => (
              <div key={item.name} className={styles.dreamCard}>
                <span className={styles.dreamSymbol}>{item.symbol}</span>
                <h3 className={styles.dreamName}>{item.name}</h3>
                <p className={styles.dreamMeaning}>{item.meaning}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.zodiacSection}>
          <h2 className={styles.sectionTitle}>{dict.spiritual.zodiac_guide}</h2>
          <div className={styles.zodiacGrid}>
            {ZODIAC_SIGNS.map((sign) => (
              <Link key={sign.slug} href={`/${lang}/horoscopes/${sign.slug}`} className={styles.zodiacItem}>
                <img className={styles.zodiacIcon} src={sign.icon} alt="" aria-hidden="true" />
                <span className={styles.zodiacName}>{dict.zodiac[sign.slug as keyof typeof dict.zodiac]}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
