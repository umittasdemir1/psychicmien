'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/data/supabase/client';
import styles from './admin.module.css';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/blog', label: 'Blog', icon: '✍️' },
  { href: '/admin/products', label: 'Ürünler', icon: '🛍️' },
  { href: '/admin/horoscopes', label: 'Burçlar', icon: '⭐' },
  { href: '/admin/tarot', label: 'Tarot', icon: '🃏' },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    NAV.forEach((item) => {
      router.prefetch(item.href);
    });

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!active) return;

      if (!user) {
        router.replace('/auth/login');
        return;
      }

      setUserEmail(user.email ?? '');
    });

    return () => {
      active = false;
    };
  }, [router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>
        <span>🔮</span>
        <span>Admin</span>
      </div>
      <nav className={styles.sidebarNav}>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className={styles.sidebarFooter}>
        <span className={styles.userEmail}>{userEmail}</span>
        <button onClick={handleLogout} className={styles.logoutBtn}>Çıkış</button>
      </div>
    </aside>
  );
}
