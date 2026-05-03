'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, localeNames } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import styles from './Header.module.css';

interface NavDict {
  horoscopes: string;
  tarot: string;
  blog: string;
  spiritual: string;
  shop: string;
}

interface Props {
  dict: { nav: NavDict };
  lang: Locale;
}

export function Header({ dict, lang }: Props) {
  const pathname = usePathname();

  // Replace current locale prefix with another for switcher links
  function localePath(targetLang: string) {
    const withoutLocale = pathname.replace(/^\/(tr|en|es)/, '') || '/';
    return `/${targetLang}${withoutLocale}`;
  }

  const navLinks = [
    { href: `/${lang}/horoscopes`, label: dict.nav.horoscopes },
    { href: `/${lang}/tarot`, label: dict.nav.tarot },
    { href: `/${lang}/blog`, label: dict.nav.blog },
    { href: `/${lang}/spiritual`, label: dict.nav.spiritual },
    { href: `/${lang}/shop`, label: dict.nav.shop },
  ];

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href={`/${lang}`} className={styles.logo}>
          <img src="/images/logo-light.svg" alt="PsychicMien" width={160} height={40} />
        </Link>

        <nav className={styles.nav} aria-label="Ana navigasyon">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.navLink}
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

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
      </div>
    </header>
  );
}
