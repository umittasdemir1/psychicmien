import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import styles from './privacy.module.css';

export const metadata: Metadata = buildMetadata({
  title: 'Gizlilik Politikası',
  description: 'PsychicMien gizlilik politikası — kişisel verilerinizin nasıl işlendiği hakkında bilgi.',
  noIndex: true,
});

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.content}>
          <h1 className={styles.title}>Gizlilik Politikası</h1>
          <p className={styles.updated}>Son güncelleme: Mayıs 2026</p>

          <section className={styles.section}>
            <h2>1. Topladığımız Bilgiler</h2>
            <p>
              Sitemizi ziyaret ettiğinizde, Google Analytics ve benzeri araçlar aracılığıyla anonim kullanım verileri
              toplanabilir (sayfa görüntülemeleri, oturum süresi, tarayıcı türü vb.). Bu veriler sizi kişisel olarak
              tanımlamaz.
            </p>
            <p>
              Bize doğrudan iletişim formu veya e-posta yoluyla ulaşırsanız, sağladığınız iletişim bilgilerini
              yalnızca yanıt vermek amacıyla saklarız.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Çerezler</h2>
            <p>
              Sitemiz; analitik, performans ve tercih saklamak amacıyla çerezler kullanabilir. Tarayıcı ayarlarınızdan
              çerezleri devre dışı bırakabilirsiniz; ancak bu bazı özelliklerin çalışmamasına yol açabilir.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. Üçüncü Taraf Hizmetler</h2>
            <p>
              Sitemiz aşağıdaki üçüncü taraf hizmetlerini kullanmaktadır:
            </p>
            <ul>
              <li><strong>Google AdSense:</strong> Kişiselleştirilmiş reklam gösterimi için çerez kullanır.</li>
              <li><strong>Etsy:</strong> Mağaza bağlantıları, Etsy&apos;nin gizlilik politikasına tabidir.</li>
              <li><strong>Amazon Affiliate:</strong> Ürün bağlantıları Amazon Associates programı çerçevesinde işlenir.</li>
            </ul>
            <p>
              Bu hizmetlerin gizlilik politikaları kendi siteleri üzerinden incelenebilir.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Affiliate Bağlantılar</h2>
            <p>
              Sitemizdeki bazı bağlantılar affiliate (ortak) bağlantılardır. Bu bağlantılar üzerinden yapılan
              alışverişlerden komisyon kazanabiliriz. Bu durum ürün veya hizmet hakkındaki görüşlerimizi etkilemez.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Verilerin Korunması</h2>
            <p>
              Topladığımız verileri korumak için makul güvenlik önlemleri alıyoruz. Ancak internet üzerinden
              hiçbir veri iletiminin %100 güvenli olmadığını belirtmeliyiz.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Değişiklikler</h2>
            <p>
              Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Değişiklikler bu sayfada yayınlandıktan
              sonra geçerli olur.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
