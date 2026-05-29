import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/data/supabase/server';
import styles from './admin.module.css';
import AdminNav from './AdminNav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Server-side auth guard — double check (middleware also protects)
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className={styles.layout}>
      <AdminNav />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
