'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE_NAME } from '@/lib/constants';
import { locales, localeNames } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import styles from './Footer.module.css';

interface FooterDict {
  tagline: string;
  pages: string;
  legal: string;
  privacy: string;
  terms: string;
  about: string;
  copyright: string;
}

interface NavDict {
  horoscopes: string;
  tarot: string;
  blog: string;
  spiritual: string;
  shop: string;
}

interface Props {
  dict: { footer: FooterDict; nav: NavDict };
  lang: Locale;
}

export function Footer({ dict, lang }: Props) {
  const year = new Date().getFullYear();
  const { footer, nav } = dict;
  const pathname = usePathname();

  function localePath(targetLang: string) {
    const withoutLocale = pathname.replace(/^\/(tr|en|es)/, '') || '/';
    return `/${targetLang}${withoutLocale}`;
  }

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href={`/${lang}`} className={styles.logo}>
              <Image src="/images/logo-dark.svg" alt="PsychicMien" width={160} height={40} />
            </Link>
            <p>{footer.tagline}</p>
          </div>

          <div>
            <p className={styles.colTitle}>{footer.pages}</p>
            <ul className={styles.links}>
              <li><Link href={`/${lang}/horoscopes`}>{nav.horoscopes}</Link></li>
              <li><Link href={`/${lang}/tarot`}>{nav.tarot}</Link></li>
              <li><Link href={`/${lang}/blog`}>{nav.blog}</Link></li>
              <li><Link href={`/${lang}/spiritual`}>{nav.spiritual}</Link></li>
            </ul>
          </div>

          <div>
            <p className={styles.colTitle}>{nav.shop}</p>
            <ul className={styles.links}>
              <li><Link href={`/${lang}/shop`}>{nav.shop}</Link></li>
            </ul>
          </div>

          <div>
            <p className={styles.colTitle}>{footer.legal}</p>
            <ul className={styles.links}>
              <li><Link href={`/${lang}/about`}>{footer.about}</Link></li>
              <li><Link href={`/${lang}/privacy`}>{footer.privacy}</Link></li>
              <li><Link href={`/${lang}/terms`}>{footer.terms}</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {year} {SITE_NAME}. {footer.copyright}</p>
          <div className={styles.langSwitcher}>
            {locales.map((loc) => (
              <Link
                key={loc}
                href={localePath(loc)}
                className={`${styles.langBtn} ${loc === lang ? styles.langBtnActive : ''}`}
                title={localeNames[loc]}
              >
                {loc.toUpperCase()}
              </Link>
            ))}
          </div>
          <nav className={styles.legalLinks} aria-label="Legal links">
            <Link href={`/${lang}/privacy`}>{footer.privacy}</Link>
            <Link href={`/${lang}/terms`}>{footer.terms}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
