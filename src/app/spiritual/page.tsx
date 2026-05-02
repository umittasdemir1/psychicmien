import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { ZODIAC_SIGNS } from '@/lib/constants';
import styles from './spiritual.module.css';

export const metadata: Metadata = buildMetadata({
  title: 'Spiritüel Rehber',
  description: 'Tarot, numeroloji, kristaller, meditasyon ve spiritüel gelişim için kapsamlı rehberiniz.',
});

const TOPICS = [
  {
    slug: 'tarot',
    icon: '🃏',
    title: 'Tarot',
    description: 'Major ve Minor Arcana kartlarının anlamları, yayılımlar ve okuma teknikleri.',
    href: '/tarot',
  },
  {
    slug: 'astroloji',
    icon: '⭐',
    title: 'Astroloji',
    description: 'Burç yorumları, gezegen transitleri, doğum haritası temelleri.',
    href: '/horoscopes',
  },
  {
    slug: 'kristaller',
    icon: '💎',
    title: 'Kristaller',
    description: 'Şifa kristalleri, enerji çalışması ve koleksiyon rehberi.',
    href: '#kristaller',
  },
  {
    slug: 'meditasyon',
    icon: '🧘',
    title: 'Meditasyon',
    description: 'Bilinçli farkındalık, görselleştirme ve spiritüel bağlantı teknikleri.',
    href: '#meditasyon',
  },
  {
    slug: 'numeroloji',
    icon: '🔢',
    title: 'Numeroloji',
    description: 'Yaşam yolu sayısı, kader sayısı ve sayıların spiritüel anlamları.',
    href: '#numeroloji',
  },
  {
    slug: 'dreamwork',
    icon: '🌙',
    title: 'Rüya Yorumu',
    description: 'Rüyaların sembolik dili ve bilinçaltı mesajlarını okuma.',
    href: '#ruyalar',
  },
];

const CRYSTALS = [
  { name: 'Ametist', color: '#9B59B6', meaning: 'Sezgi, sakinlik, spiritüel farkındalık' },
  { name: 'Kuvars', color: '#F5F5F5', meaning: 'Enerji amplifikatörü, berraklık, şifa' },
  { name: 'Labradorit', color: '#5DADE2', meaning: 'Dönüşüm, koruma, sihirsel güç' },
  { name: 'Gül Kuvarsı', color: '#F1948A', meaning: 'Koşulsuz sevgi, öz-şefkat, kalp şifası' },
  { name: 'Obsidyen', color: '#2C3E50', meaning: 'Koruma, olumsuz enerjiyi uzaklaştırma' },
  { name: 'Sitrin', color: '#F4D03F', meaning: 'Bereket, pozitif enerji, yaratıcılık' },
];

export default function SpirituelPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.hero}>
          <div className={styles.heroIcon}>🔮</div>
          <h1 className={styles.heroTitle}>Spiritüel Rehber</h1>
          <p className={styles.heroSubtitle}>
            Kendinizi ve evreni daha derin anlamak için spiritüel araçlar, bilgelik ve rehberlik.
          </p>
        </header>

        <section className={styles.topics}>
          <h2 className={styles.sectionTitle}>Konular</h2>
          <div className={styles.topicsGrid}>
            {TOPICS.map((topic) => (
              <Link key={topic.slug} href={topic.href} className={styles.topicCard}>
                <span className={styles.topicIcon}>{topic.icon}</span>
                <h3 className={styles.topicTitle}>{topic.title}</h3>
                <p className={styles.topicDesc}>{topic.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section id="kristaller" className={styles.section}>
          <h2 className={styles.sectionTitle}>Şifa Kristalleri</h2>
          <p className={styles.sectionLead}>
            Kristaller, enerji çalışması ve spiritüel pratiğin vazgeçilmez araçlarıdır.
            Her kristal benzersiz titreşimler taşır.
          </p>
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

        <section id="meditasyon" className={styles.section}>
          <h2 className={styles.sectionTitle}>Meditasyon Rehberi</h2>
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

        <section id="numeroloji" className={styles.section}>
          <h2 className={styles.sectionTitle}>Numeroloji: Yaşam Yolu Sayısı</h2>
          <p className={styles.sectionLead}>
            Doğum tarihinizin rakamlarını toplayarak yaşam yolu sayınızı bulun.
            Örneğin: 15/03/1990 → 1+5+0+3+1+9+9+0 = 28 → 2+8 = <strong>10 → 1+0 = 1</strong>
          </p>
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

        <section id="ruyalar" className={styles.section}>
          <h2 className={styles.sectionTitle}>Yaygın Rüya Sembolleri</h2>
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
          <h2 className={styles.sectionTitle}>Burç Rehberi</h2>
          <div className={styles.zodiacGrid}>
            {ZODIAC_SIGNS.map((sign) => (
              <Link key={sign.slug} href={`/horoscopes/${sign.slug}`} className={styles.zodiacItem}>
                <img className={styles.zodiacIcon} src={sign.icon} alt="" aria-hidden="true" />
                <span className={styles.zodiacName}>{sign.name}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
