import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import styles from '../privacy/privacy.module.css';

export const metadata: Metadata = buildMetadata({
  title: 'Kullanım Koşulları',
  description: 'PsychicMien kullanım koşulları.',
  noIndex: true,
});

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.content}>
          <h1 className={styles.title}>Kullanım Koşulları</h1>
          <p className={styles.updated}>Son güncelleme: Mayıs 2026</p>

          <section className={styles.section}>
            <h2>1. Hizmetin Tanımı</h2>
            <p>
              PsychicMien, tarot, astroloji, burç yorumları ve spiritüel içerikler sunan bir bilgi ve eğlence
              platformudur. Sunulan içerikler tamamen eğlence ve kişisel yansıma amaçlıdır; profesyonel tıbbi,
              psikolojik, hukuki veya finansal tavsiye niteliği taşımaz.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Sorumluluk Reddi</h2>
            <p>
              Sitemizde sunulan tüm spiritüel içerikler (tarot yorumları, burç analizleri, numeroloji vb.)
              eğlence ve kişisel gelişim amaçlıdır. Bu içerikler bilimsel gerçekler olarak sunulmamaktadır.
            </p>
            <p>
              Bu içeriklere dayanarak alınan kararlarda PsychicMien hiçbir sorumluluk kabul etmez.
              Önemli kararlarınız için uzman profesyonellere danışmanızı tavsiye ederiz.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. Telif Hakkı</h2>
            <p>
              Sitemizdeki tüm içerikler (metinler, görseller, tasarım) PsychicMien&apos;e aittir ve izinsiz
              kopyalanamaz, dağıtılamaz veya ticari amaçlarla kullanılamaz.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Dış Bağlantılar</h2>
            <p>
              Sitemizde üçüncü taraf web sitelerine (Etsy, Amazon vb.) bağlantılar bulunmaktadır. Bu sitelerin
              içerik ve gizlilik politikalarından sorumlu değiliz.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Değişiklikler</h2>
            <p>
              Bu kullanım koşullarını önceden bildirimde bulunmaksızın değiştirme hakkımızı saklı tutarız.
              Siteyi kullanmaya devam etmeniz güncel koşulları kabul ettiğiniz anlamına gelir.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
