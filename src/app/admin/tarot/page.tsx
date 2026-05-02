'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/data/supabase/client';
import { TarotCard, Arcana, Suit } from '@/domain/entities/TarotCard';
import { toTarotCard } from '@/data/mappers';
import { slugify } from '@/lib/utils';
import styles from '../admin.module.css';

type FormData = {
  name: string;
  slug: string;
  arcana: Arcana;
  suit: string;
  card_number: string;
  image_url: string;
  upright_meaning: string;
  reversed_meaning: string;
  description: string;
  keywords: string;
};

const EMPTY_FORM: FormData = {
  name: '', slug: '', arcana: 'major', suit: '',
  card_number: '', image_url: '', upright_meaning: '',
  reversed_meaning: '', description: '', keywords: '',
};

const SUITS: { value: Suit | ''; label: string }[] = [
  { value: '', label: '— Major Arcana —' },
  { value: 'cups', label: 'Kupalar' },
  { value: 'wands', label: 'Değnekler' },
  { value: 'swords', label: 'Kılıçlar' },
  { value: 'pentacles', label: 'Pentakeller' },
];

export default function AdminTarotPage() {
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const supabase = useMemo(() => createClient(), []);

  const loadCards = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('tarot_cards').select('*').order('card_number', { ascending: true });
    setCards((data ?? []).map(toTarotCard));
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadCards();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadCards]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError('');
    setShowModal(true);
  }

  function openEdit(card: TarotCard) {
    setForm({
      name: card.name,
      slug: card.slug,
      arcana: card.arcana,
      suit: card.suit ?? '',
      card_number: card.cardNumber?.toString() ?? '',
      image_url: card.imageUrl ?? '',
      upright_meaning: card.uprightMeaning ?? '',
      reversed_meaning: card.reversedMeaning ?? '',
      description: card.description ?? '',
      keywords: card.keywords.join(', '),
    });
    setEditingId(card.id);
    setError('');
    setShowModal(true);
  }

  function handleNameChange(name: string) {
    setForm((f) => ({ ...f, name, ...(!editingId && { slug: slugify(name) }) }));
  }

  async function handleSave() {
    if (!form.name || !form.slug) { setError('İsim ve slug zorunludur.'); return; }
    setSaving(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        arcana: form.arcana,
        suit: form.suit || null,
        card_number: form.card_number ? parseInt(form.card_number) : null,
        image_url: form.image_url || null,
        upright_meaning: form.upright_meaning || null,
        reversed_meaning: form.reversed_meaning || null,
        description: form.description || null,
        keywords: form.keywords ? form.keywords.split(',').map((k) => k.trim()).filter(Boolean) : [],
      };
      if (editingId) {
        const { error: e } = await supabase.from('tarot_cards').update(payload).eq('id', editingId);
        if (e) throw e;
      } else {
        const { error: e } = await supabase.from('tarot_cards').insert(payload);
        if (e) throw e;
      }
      setShowModal(false);
      await loadCards();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Kayıt başarısız.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu kartı silmek istediğinize emin misiniz?')) return;
    await supabase.from('tarot_cards').delete().eq('id', id);
    await loadCards();
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Tarot Kartları</h1>
        <button onClick={openCreate} className={styles.addBtn}>+ Yeni Kart</button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-text-secondary)' }}>Yükleniyor…</p>
      ) : cards.length === 0 ? (
        <div className={styles.empty}><p>Henüz tarot kartı yok.</p></div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Kart Adı</th>
              <th>Arcana</th>
              <th>Takım</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card) => (
              <tr key={card.id}>
                <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{card.cardNumber ?? '—'}</td>
                <td>{card.name}</td>
                <td style={{ textTransform: 'capitalize' }}>{card.arcana}</td>
                <td style={{ textTransform: 'capitalize' }}>{card.suit ?? '—'}</td>
                <td>
                  <div className={styles.actionBtns}>
                    <button className={styles.editBtn} onClick={() => openEdit(card)}>Düzenle</button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(card.id)}>Sil</button>
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
            <h2 className={styles.modalTitle}>{editingId ? 'Kartı Düzenle' : 'Yeni Kart'}</h2>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Kart Adı *</label>
                <input className={styles.formInput} value={form.name} onChange={(e) => handleNameChange(e.target.value)} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Slug *</label>
                <input className={styles.formInput} value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Arcana</label>
                  <select className={styles.formSelect} value={form.arcana} onChange={(e) => setForm((f) => ({ ...f, arcana: e.target.value as Arcana }))}>
                    <option value="major">Major</option>
                    <option value="minor">Minor</option>
                  </select>
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Takım</label>
                  <select className={styles.formSelect} value={form.suit} onChange={(e) => setForm((f) => ({ ...f, suit: e.target.value }))}>
                    {SUITS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Kart No</label>
                  <input className={styles.formInput} type="number" value={form.card_number} onChange={(e) => setForm((f) => ({ ...f, card_number: e.target.value }))} />
                </div>
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Görsel URL</label>
                <input className={styles.formInput} value={form.image_url} onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Düz Anlam</label>
                <textarea className={styles.formTextarea} value={form.upright_meaning} onChange={(e) => setForm((f) => ({ ...f, upright_meaning: e.target.value }))} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Ters Anlam</label>
                <textarea className={styles.formTextarea} value={form.reversed_meaning} onChange={(e) => setForm((f) => ({ ...f, reversed_meaning: e.target.value }))} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Açıklama</label>
                <textarea className={styles.formTextarea} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Anahtar Kelimeler (virgülle ayır)</label>
                <input className={styles.formInput} value={form.keywords} onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))} placeholder="sevgi, güç, cesaret" />
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
