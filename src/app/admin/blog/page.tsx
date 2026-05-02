'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/data/supabase/client';
import { BlogPost } from '@/domain/entities/BlogPost';
import { toBlogPost } from '@/data/mappers';
import { slugify, formatDate } from '@/lib/utils';
import styles from '../admin.module.css';

type FormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  tags: string;
  is_published: boolean;
  published_at: string;
};

const EMPTY_FORM: FormData = {
  title: '', slug: '', excerpt: '', content: '',
  cover_image: '', category: '', tags: '',
  is_published: false, published_at: '',
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const supabase = useMemo(() => createClient(), []);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    setPosts((data ?? []).map(toBlogPost));
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadPosts();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadPosts]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError('');
    setShowModal(true);
  }

  function openEdit(post: BlogPost) {
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? '',
      content: post.content ?? '',
      cover_image: post.coverImage ?? '',
      category: post.category ?? '',
      tags: post.tags.join(', '),
      is_published: post.isPublished,
      published_at: post.publishedAt ?? '',
    });
    setEditingId(post.id);
    setError('');
    setShowModal(true);
  }

  function handleTitleChange(title: string) {
    setForm((f) => ({ ...f, title, ...(!editingId && { slug: slugify(title) }) }));
  }

  async function handleSave() {
    if (!form.title || !form.slug) { setError('Başlık ve slug zorunludur.'); return; }
    setSaving(true);
    setError('');
    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || null,
        content: form.content || null,
        cover_image: form.cover_image || null,
        category: form.category || null,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        is_published: form.is_published,
        published_at: form.is_published && !form.published_at ? new Date().toISOString() : (form.published_at || null),
      };
      if (editingId) {
        const { error: e } = await supabase.from('blog_posts').update(payload).eq('id', editingId);
        if (e) throw e;
      } else {
        const { error: e } = await supabase.from('blog_posts').insert(payload);
        if (e) throw e;
      }
      setShowModal(false);
      await loadPosts();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Kayıt başarısız.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu yazıyı silmek istediğinize emin misiniz?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    await loadPosts();
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Blog Yazıları</h1>
        <button onClick={openCreate} className={styles.addBtn}>+ Yeni Yazı</button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-text-secondary)' }}>Yükleniyor…</p>
      ) : posts.length === 0 ? (
        <div className={styles.empty}><p>Henüz blog yazısı yok.</p></div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Başlık</th>
              <th>Kategori</th>
              <th>Durum</th>
              <th>Tarih</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.category ?? '—'}</td>
                <td>
                  <span className={`${styles.badge} ${post.isPublished ? styles.badgePublished : styles.badgeDraft}`}>
                    {post.isPublished ? 'Yayında' : 'Taslak'}
                  </span>
                </td>
                <td>{post.publishedAt ? formatDate(post.publishedAt) : '—'}</td>
                <td>
                  <div className={styles.actionBtns}>
                    <button className={styles.editBtn} onClick={() => openEdit(post)}>Düzenle</button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(post.id)}>Sil</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>{editingId ? 'Yazıyı Düzenle' : 'Yeni Yazı'}</h2>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Başlık *</label>
                <input className={styles.formInput} value={form.title} onChange={(e) => handleTitleChange(e.target.value)} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Slug *</label>
                <input className={styles.formInput} value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Özet</label>
                <textarea className={styles.formTextarea} value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>İçerik (HTML)</label>
                <textarea className={styles.formTextarea} style={{ minHeight: 200 }} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Kapak Görseli URL</label>
                <input className={styles.formInput} value={form.cover_image} onChange={(e) => setForm((f) => ({ ...f, cover_image: e.target.value }))} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Kategori</label>
                <input className={styles.formInput} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Etiketler (virgülle ayır)</label>
                <input className={styles.formInput} value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="tarot, astroloji, spiritüel" />
              </div>
              <div className={styles.formField}>
                <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))} />
                  <span className={styles.formLabel} style={{ margin: 0 }}>Yayınla</span>
                </label>
              </div>
              {error && <p className={styles.formError}>{error}</p>}
              <div className={styles.formActions}>
                <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>İptal</button>
                <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                  {saving ? 'Kaydediliyor…' : 'Kaydet'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
