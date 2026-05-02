import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';
import styles from './Footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              Psychic<span>Mien</span>
            </Link>
            <p>Tarot okumları, burç yorumları ve spiritüel rehberlik.</p>
            <p className={styles.affiliate}>
              Bu site Amazon ve diğer affiliate ağlarına katılımcıdır. Bağlı
              linklerden alışveriş yaparsanız komisyon kazanabiliriz.
            </p>
          </div>

          <div>
            <p className={styles.colTitle}>Keşfet</p>
            <ul className={styles.links}>
              <li><Link href="/horoscopes">Burçlar</Link></li>
              <li><Link href="/tarot">Tarot</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/spiritual">Spiritüel</Link></li>
            </ul>
          </div>

          <div>
            <p className={styles.colTitle}>Mağaza</p>
            <ul className={styles.links}>
              <li><Link href="/shop">Tüm Ürünler</Link></li>
              <li><Link href="/shop?category=tarot">Tarot Destesi</Link></li>
              <li><Link href="/shop?category=crystals">Kristaller</Link></li>
              <li><Link href="/shop?category=books">Kitaplar</Link></li>
            </ul>
          </div>

          <div>
            <p className={styles.colTitle}>Hakkında</p>
            <ul className={styles.links}>
              <li><Link href="/about">Hakkımızda</Link></li>
              <li><Link href="/privacy">Gizlilik</Link></li>
              <li><Link href="/terms">Kullanım Şartları</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {year} {SITE_NAME}. Tüm hakları saklıdır.</p>
          <nav className={styles.legalLinks} aria-label="Hukuki bağlantılar">
            <Link href="/privacy">Gizlilik Politikası</Link>
            <Link href="/terms">Şartlar</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
