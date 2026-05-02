import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import styles from './about.module.css';

export const metadata: Metadata = buildMetadata({
  title: 'Hakkımızda',
  description: 'PsychicMien hakkında — spiritüel rehberlik, tarot okumaları ve burç yorumları platformumuz.',
});

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.content}>
          <header className={styles.header}>
            <span className={styles.icon}>🔮</span>
            <h1 className={styles.title}>Hakkımızda</h1>
            <p className={styles.lead}>
              PsychicMien, spiritüel rehberlik arayışındakilere kapsamlı ve güvenilir içerik sunmak amacıyla kurulmuştur.
            </p>
          </header>

          <section className={styles.section}>
            <h2>Misyonumuz</h2>
            <p>
              Tarot, astroloji, kristaller ve spiritüel gelişim alanlarında kaliteli, anlaşılır içerik üretiyoruz.
              Amacımız bu kadim bilgelik sistemlerini modern hayatla buluşturmak ve herkesin kendi spiritüel yolculuğunu
              özgürce keşfetmesine destek olmaktır.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Ne Sunuyoruz?</h2>
            <div className={styles.offerGrid}>
              {[
                { icon: '🃏', title: 'Tarot Rehberi', desc: '78 kartın detaylı anlamları, yayılımlar ve günlük okumaları.' },
                { icon: '⭐', title: 'Burç Yorumları', desc: 'Günlük, haftalık ve aylık burç yorumları.' },
                { icon: '📖', title: 'Blog', desc: 'Spiritüel yaşam, kişisel gelişim ve mistik konularda derinlemesine yazılar.' },
                { icon: '🛍️', title: 'Spiritüel Mağaza', desc: 'Etsy üzerinden tarot desteleri, kristaller ve spiritüel araçlar.' },
              ].map((item) => (
                <div key={item.title} className={styles.offerCard}>
                  <span className={styles.offerIcon}>{item.icon}</span>
                  <h3 className={styles.offerTitle}>{item.title}</h3>
                  <p className={styles.offerDesc}>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2>Yaklaşımımız</h2>
            <p>
              Spiritüel içeriklerimizi bilimsel bir iddia olarak sunmuyoruz. Tarot okumalarını, burç yorumlarını
              ve diğer spiritüel araçları kişisel yansıma ve içgözlem için birer araç olarak değerlendiriyoruz.
              Her bireyin kendi deneyimini ve yorumunu en değerli rehber olarak görmesini destekliyoruz.
            </p>
          </section>

          <section className={styles.section}>
            <h2>İletişim</h2>
            <p>
              Sorularınız, önerileriniz veya iş birliği talepleriniz için bize ulaşabilirsiniz.
              İçerik önerileri ve geri bildirimlerinizi bekliyoruz.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
