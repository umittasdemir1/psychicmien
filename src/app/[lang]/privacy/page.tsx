import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { locales } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import styles from './privacy.module.css';

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
  return buildMetadata({ title: dict.privacy.title, noIndex: true });
}

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params;
  if (!(locales as readonly string[]).includes(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.content}>
          <h1 className={styles.title}>{dict.privacy.title}</h1>
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
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Affiliate Bağlantılar</h2>
            <p>
              Sitemizdeki bazı bağlantılar affiliate (ortak) bağlantılardır. Bu bağlantılar üzerinden yapılan
              alışverişlerden komisyon kazanabiliriz.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Değişiklikler</h2>
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
