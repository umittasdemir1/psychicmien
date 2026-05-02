import styles from './admin.module.css';
import AdminNav from './AdminNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <AdminNav />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
