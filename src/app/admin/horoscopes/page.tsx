'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/data/supabase/client';
import { Horoscope, HoroscopePeriod } from '@/domain/entities/Horoscope';
import { toHoroscope } from '@/data/mappers';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import styles from '../admin.module.css';

type FormData = {
  sign: string;
  period: HoroscopePeriod;
  content: string;
  date: string;
  love_rating: string;
  career_rating: string;
  health_rating: string;
  lucky_number: string;
  lucky_color: string;
};

const EMPTY_FORM: FormData = {
  sign: 'aries', period: 'daily', content: '',
  date: new Date().toISOString().slice(0, 10),
  love_rating: '', career_rating: '', health_rating: '',
  lucky_number: '', lucky_color: '',
};

export default function AdminHoroscopesPage() {
  const [horoscopes, setHoroscopes] = useState<Horoscope[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const supabase = useMemo(() => createClient(), []);

  const loadHoroscopes = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('horoscopes').select('*').order('date', { ascending: false }).limit(100);
    setHoroscopes((data ?? []).map(toHoroscope));
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadHoroscopes();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadHoroscopes]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError('');
    setShowModal(true);
  }

  function openEdit(h: Horoscope) {
    setForm({
      sign: h.sign,
      period: h.period,
      content: h.content,
      date: h.date,
      love_rating: h.loveRating?.toString() ?? '',
      career_rating: h.careerRating?.toString() ?? '',
      health_rating: h.healthRating?.toString() ?? '',
      lucky_number: h.luckyNumber?.toString() ?? '',
      lucky_color: h.luckyColor ?? '',
    });
    setEditingId(h.id);
    setError('');
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.content || !form.date) { setError('İçerik ve tarih zorunludur.'); return; }
    setSaving(true);
    setError('');
    try {
      const payload = {
        sign: form.sign,
        period: form.period,
        content: form.content,
        date: form.date,
        love_rating: form.love_rating ? parseInt(form.love_rating) : null,
        career_rating: form.career_rating ? parseInt(form.career_rating) : null,
        health_rating: form.health_rating ? parseInt(form.health_rating) : null,
        lucky_number: form.lucky_number ? parseInt(form.lucky_number) : null,
        lucky_color: form.lucky_color || null,
      };
      if (editingId) {
        const { error: e } = await supabase.from('horoscopes').update(payload).eq('id', editingId);
        if (e) throw e;
      } else {
        const { error: e } = await supabase.from('horoscopes').insert(payload);
        if (e) throw e;
      }
      setShowModal(false);
      await loadHoroscopes();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Kayıt başarısız.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu burç yorumunu silmek istediğinize emin misiniz?')) return;
    await supabase.from('horoscopes').delete().eq('id', id);
    await loadHoroscopes();
  }

  const signName = (slug: string) => ZODIAC_SIGNS.find((s) => s.slug === slug)?.name ?? slug;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Burç Yorumları</h1>
        <button onClick={openCreate} className={styles.addBtn}>+ Yeni Yorum</button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-text-secondary)' }}>Yükleniyor…</p>
      ) : horoscopes.length === 0 ? (
        <div className={styles.empty}><p>Henüz burç yorumu yok.</p></div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Burç</th>
              <th>Dönem</th>
              <th>Tarih</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {horoscopes.map((h) => (
              <tr key={h.id}>
                <td>{signName(h.sign)}</td>
                <td style={{ textTransform: 'capitalize' }}>{h.period}</td>
                <td>{formatDate(h.date)}</td>
                <td>
                  <div className={styles.actionBtns}>
                    <button className={styles.editBtn} onClick={() => openEdit(h)}>Düzenle</button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(h.id)}>Sil</button>
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
            <h2 className={styles.modalTitle}>{editingId ? 'Yorumu Düzenle' : 'Yeni Yorum'}</h2>
            <div className={styles.formGrid}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Burç</label>
                  <select className={styles.formSelect} value={form.sign} onChange={(e) => setForm((f) => ({ ...f, sign: e.target.value }))}>
                    {ZODIAC_SIGNS.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
                  </select>
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Dönem</label>
                  <select className={styles.formSelect} value={form.period} onChange={(e) => setForm((f) => ({ ...f, period: e.target.value as HoroscopePeriod }))}>
                    <option value="daily">Günlük</option>
                    <option value="weekly">Haftalık</option>
                    <option value="monthly">Aylık</option>
                  </select>
                </div>
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Tarih *</label>
                <input className={styles.formInput} type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>İçerik *</label>
                <textarea className={styles.formTextarea} style={{ minHeight: 180 }} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
                {(['love_rating', 'career_rating', 'health_rating'] as const).map((key) => (
                  <div key={key} className={styles.formField}>
                    <label className={styles.formLabel}>{key === 'love_rating' ? 'Aşk' : key === 'career_rating' ? 'Kariyer' : 'Sağlık'} (1-5)</label>
                    <input className={styles.formInput} type="number" min="1" max="5" value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Şanslı Sayı</label>
                  <input className={styles.formInput} type="number" value={form.lucky_number} onChange={(e) => setForm((f) => ({ ...f, lucky_number: e.target.value }))} />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Şanslı Renk</label>
                  <input className={styles.formInput} value={form.lucky_color} onChange={(e) => setForm((f) => ({ ...f, lucky_color: e.target.value }))} placeholder="Mor, Altın…" />
                </div>
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
