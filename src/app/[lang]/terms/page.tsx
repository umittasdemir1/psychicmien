import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { locales } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import styles from '../privacy/privacy.module.css';

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
  return buildMetadata({ title: dict.terms.title, noIndex: true });
}

export default async function TermsPage({ params }: Props) {
  const { lang } = await params;
  if (!(locales as readonly string[]).includes(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.content}>
          <h1 className={styles.title}>{dict.terms.title}</h1>
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
            <h2>4. Değişiklikler</h2>
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
