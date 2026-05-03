import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';
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

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href={`/${lang}`} className={styles.logo}>
              Psychic<span>Mien</span>
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
            <p className={styles.colTitle}>{footer.pages}</p>
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
          <nav className={styles.legalLinks} aria-label="Legal links">
            <Link href={`/${lang}/privacy`}>{footer.privacy}</Link>
            <Link href={`/${lang}/terms`}>{footer.terms}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
