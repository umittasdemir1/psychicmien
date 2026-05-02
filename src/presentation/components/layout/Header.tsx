'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import styles from './Header.module.css';

export function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          Psychic<span>Mien</span>
        </Link>

        <nav className={styles.nav} aria-label="Ana navigasyon">
          {NAV_LINKS.map((link) =>
            link.href === '/shop' ? (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${styles.shopLink}`}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={styles.navLink}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <button className={styles.menuBtn} aria-label="Menüyü aç">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}
