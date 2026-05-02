'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/data/supabase/client';
import styles from './admin.module.css';

type Stats = {
  blog: number | null;
  product: number | null;
  horoscope: number | null;
  tarot: number | null;
};

export default function AdminDashboard() {
  const supabase = useMemo(() => createClient(), []);
  const [counts, setCounts] = useState<Stats>({
    blog: null,
    product: null,
    horoscope: null,
    tarot: null,
  });

  useEffect(() => {
    let active = true;

    async function loadCounts() {
      const [
        { count: blogCount },
        { count: productCount },
        { count: horoscopeCount },
        { count: tarotCount },
      ] = await Promise.all([
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('horoscopes').select('*', { count: 'exact', head: true }),
        supabase.from('tarot_cards').select('*', { count: 'exact', head: true }),
      ]);

      if (!active) return;

      setCounts({
        blog: blogCount ?? 0,
        product: productCount ?? 0,
        horoscope: horoscopeCount ?? 0,
        tarot: tarotCount ?? 0,
      });
    }

    void loadCounts();

    return () => {
      active = false;
    };
  }, [supabase]);

  const stats = [
    { icon: '✍️', label: 'Blog Yazısı', value: counts.blog, href: '/admin/blog' },
    { icon: '🛍️', label: 'Ürün', value: counts.product, href: '/admin/products' },
    { icon: '⭐', label: 'Burç Yorumu', value: counts.horoscope, href: '/admin/horoscopes' },
    { icon: '🃏', label: 'Tarot Kartı', value: counts.tarot, href: '/admin/tarot' },
  ];

  return (
    <div>
      <h1 className={styles.dashboardTitle}>Dashboard</h1>

      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <Link key={stat.href} href={stat.href} style={{ textDecoration: 'none' }}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>{stat.icon}</div>
              <div className={styles.statValue}>{stat.value ?? '-'}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
          </Link>
        ))}
      </div>

      <div className={styles.quickLinks}>
        <h2 className={styles.quickLinksTitle}>Hızlı Erişim</h2>
        <div className={styles.quickLinksGrid}>
          <Link href="/admin/blog" className={styles.quickLink}>
            <span>✍️</span> Yeni Blog Yazısı Ekle
          </Link>
          <Link href="/admin/products" className={styles.quickLink}>
            <span>🛍️</span> Yeni Ürün Ekle
          </Link>
          <Link href="/admin/horoscopes" className={styles.quickLink}>
            <span>⭐</span> Burç Yorumu Ekle
          </Link>
          <Link href="/admin/tarot" className={styles.quickLink}>
            <span>🃏</span> Tarot Kartı Ekle
          </Link>
        </div>
      </div>
    </div>
  );
}
