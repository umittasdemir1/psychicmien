'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/data/supabase/client';
import { Product } from '@/domain/entities/Product';
import { toProduct } from '@/data/mappers';
import styles from '../admin.module.css';

type FormData = {
  title: string;
  description: string;
  price: string;
  currency: string;
  image_url: string;
  etsy_url: string;
  category: string;
  is_featured: boolean;
  is_published: boolean;
  sort_order: string;
};

const EMPTY_FORM: FormData = {
  title: '', description: '', price: '', currency: 'USD',
  image_url: '', etsy_url: '', category: '',
  is_featured: false, is_published: true, sort_order: '0',
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const supabase = useMemo(() => createClient(), []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('sort_order', { ascending: true });
    setProducts((data ?? []).map(toProduct));
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadProducts();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadProducts]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError('');
    setShowModal(true);
  }

  function openEdit(product: Product) {
    setForm({
      title: product.title,
      description: product.description ?? '',
      price: product.price?.toString() ?? '',
      currency: product.currency,
      image_url: product.imageUrl ?? '',
      etsy_url: product.etsyUrl,
      category: product.category ?? '',
      is_featured: product.isFeatured,
      is_published: product.isPublished,
      sort_order: product.sortOrder.toString(),
    });
    setEditingId(product.id);
    setError('');
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.title || !form.etsy_url) { setError('Başlık ve Etsy URL zorunludur.'); return; }
    setSaving(true);
    setError('');
    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        price: form.price ? parseFloat(form.price) : null,
        currency: form.currency || 'USD',
        image_url: form.image_url || null,
        etsy_url: form.etsy_url,
        category: form.category || null,
        is_featured: form.is_featured,
        is_published: form.is_published,
        sort_order: parseInt(form.sort_order) || 0,
      };
      if (editingId) {
        const { error: e } = await supabase.from('products').update(payload).eq('id', editingId);
        if (e) throw e;
      } else {
        const { error: e } = await supabase.from('products').insert(payload);
        if (e) throw e;
      }
      setShowModal(false);
      await loadProducts();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Kayıt başarısız.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    await supabase.from('products').delete().eq('id', id);
    await loadProducts();
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Ürünler</h1>
        <button onClick={openCreate} className={styles.addBtn}>+ Yeni Ürün</button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-text-secondary)' }}>Yükleniyor…</p>
      ) : products.length === 0 ? (
        <div className={styles.empty}><p>Henüz ürün yok.</p></div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ürün</th>
              <th>Fiyat</th>
              <th>Kategori</th>
              <th>Durum</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span>{product.title}</span>
                    {product.isFeatured && <span className={styles.badge} style={{ background: '#EDE8F7', color: 'var(--color-primary)', width: 'fit-content' }}>Öne Çıkan</span>}
                  </div>
                </td>
                <td>{product.price ? `${product.price} ${product.currency}` : '—'}</td>
                <td>{product.category ?? '—'}</td>
                <td>
                  <span className={`${styles.badge} ${product.isPublished ? styles.badgePublished : styles.badgeDraft}`}>
                    {product.isPublished ? 'Yayında' : 'Gizli'}
                  </span>
                </td>
                <td>
                  <div className={styles.actionBtns}>
                    <button className={styles.editBtn} onClick={() => openEdit(product)}>Düzenle</button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(product.id)}>Sil</button>
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
            <h2 className={styles.modalTitle}>{editingId ? 'Ürünü Düzenle' : 'Yeni Ürün'}</h2>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Başlık *</label>
                <input className={styles.formInput} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Açıklama</label>
                <textarea className={styles.formTextarea} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Fiyat</label>
                  <input className={styles.formInput} type="number" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Para Birimi</label>
                  <select className={styles.formSelect} value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="TRY">TRY</option>
                  </select>
                </div>
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Etsy URL *</label>
                <input className={styles.formInput} value={form.etsy_url} onChange={(e) => setForm((f) => ({ ...f, etsy_url: e.target.value }))} placeholder="https://etsy.com/listing/..." />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Görsel URL</label>
                <input className={styles.formInput} value={form.image_url} onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Kategori</label>
                <input className={styles.formInput} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Sıralama</label>
                <input className={styles.formInput} type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
                <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))} />
                  <span className={styles.formLabel} style={{ margin: 0 }}>Öne Çıkan</span>
                </label>
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
