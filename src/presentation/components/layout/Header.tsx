'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import styles from './Header.module.css';

interface NavDict {
  horoscopes: string;
  tarot: string;
  blog: string;
  spiritual: string;
  shop: string;
}

interface CommonDict {
  search: string;
  sign_in: string;
}

interface Props {
  dict: { nav: NavDict; common: CommonDict };
  lang: Locale;
}

export function Header({ dict, lang }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastY;

        if (currentY < 80) {
          setHidden(false);
        } else if (delta > 6) {
          setHidden(true);
        } else if (delta < -6) {
          setHidden(false);
        }

        lastY = currentY;
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: `/${lang}/horoscopes`, label: dict.nav.horoscopes },
    { href: `/${lang}/tarot`, label: dict.nav.tarot },
    { href: `/${lang}/blog`, label: dict.nav.blog },
    { href: `/${lang}/spiritual`, label: dict.nav.spiritual },
    { href: `/${lang}/shop`, label: dict.nav.shop },
  ];

  return (
    <header className={`${styles.header} ${hidden ? styles.headerHidden : ''}`}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.topRow}>
          <Link href={`/${lang}`} className={styles.logo}>
            <Image src="/images/logo-light.svg" alt="PsychicMien" width={160} height={40} loading="eager" />
          </Link>

          <div className={styles.searchRow}>
            <button
              type="button"
              className={styles.hamburger}
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>

            <form className={styles.searchForm} role="search" action={`/${lang}/search`}>
              <input
                type="search"
                name="q"
                placeholder={dict.common.search}
                aria-label={dict.common.search}
                className={styles.searchInput}
              />
            </form>
          </div>

          <Link href={`/${lang}/sign-in`} className={styles.signInBtn}>
            {dict.common.sign_in}
          </Link>
        </div>

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

        {menuOpen && (
          <nav className={styles.mobileNav} aria-label="Mobil navigasyon">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={styles.mobileNavLink}
                aria-current={pathname === link.href ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
