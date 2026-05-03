import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { Header } from '@/presentation/components/layout/Header';
import { Footer } from '@/presentation/components/layout/Footer';

interface Props {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!(locales as readonly string[]).includes(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <>
      <Header dict={dict} lang={lang as Locale} />
      <main>{children}</main>
      <Footer dict={dict} lang={lang as Locale} />
    </>
  );
}
