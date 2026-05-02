# 🔮 PsychicMien — Implementation Plan

> Spiritual web platform: Tarot & Psychic Readings Shop + Blog + Horoscopes + Spiritual Content  
> Revenue: Etsy Shop Links + Google AdSense + Affiliate (Amazon vb.)

---

## 1. Proje Özeti

| Alan | Değer |
|------|-------|
| **Proje Adı** | PsychicMien |
| **Tür** | Full-stack web application |
| **Tema** | Açık, temiz, minimal, editorial-inspired |
| **Dil** | Türkçe (birincil), i18n altyapısı hazır |
| **Deployment** | Netlify |
| **Gelir** | Etsy Shop → dış link (TEK ödeme kanalı), AdSense, Affiliate (Amazon vb.) |

---

## 2. Teknoloji Yığını (Sürüm Uyumlu)

### Core Stack

| Paket | Sürüm | Rol |
|-------|-------|-----|
| `next` | `^16.2.4` | Full-stack framework (App Router, SSR/SSG/ISR) |
| `react` | `^19.2.5` | UI library |
| `react-dom` | `^19.2.5` | React DOM renderer |
| `typescript` | `^6.0.3` | Type safety (strict mode) |

### Backend (Supabase)

| Paket | Sürüm | Rol |
|-------|-------|-----|
| `@supabase/supabase-js` | `^2.x` | Supabase client (DB, Auth, Storage) |
| `@supabase/ssr` | `latest` | SSR cookie-based auth for Next.js |

> **Supabase** = PostgreSQL DB + Auth + Storage + Edge Functions  
> Admin paneli ile ürünler, blog, burçlar, tarot kartları yönetilecek

### UI & Styling

| Paket | Sürüm | Rol |
|-------|-------|-----|
| Vanilla CSS + CSS Modules | — | Styling (no Tailwind) |
| `lucide-react` | `latest` | Icon library |
| `@fontsource/playfair-display` | `latest` | Heading font |
| `@fontsource/inter` | `latest` | Body font |

### Forms & Validation

| Paket | Sürüm | Rol |
|-------|-------|-----|
| `react-hook-form` | `^7.74.0` | Form management (admin panel) |
| `zod` | `^4.4.1` | Schema validation |

### SEO

| Paket | Sürüm | Rol |
|-------|-------|-----|
| `next/metadata` (built-in) | — | SEO meta tags, OG, sitemap.ts |
| `web-vitals` | `latest` | Core Web Vitals ölçüm |

### Deployment

| Araç | Rol |
|------|-----|
| Netlify | Hosting + Deploy |

---

## 3. Mimari Kararlar

| Karar | Seçim |
|-------|-------|
| **Mimari** | Clean Architecture (Domain/Data/Presentation) |
| **Render** | SSG + ISR hibrit (SEO için) |
| **Veri** | Supabase PostgreSQL (admin panelden yönetim) |
| **Ödeme** | YOK — Etsy tek ödeme kanalı |
| **Affiliate** | Etsy HARİCİ — Amazon, genel affiliate ağları |
| **SEO hedefleri** | LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 |

---

## 4. Proje Yapısı (Clean Architecture)

```
d:\PsychicMien/
├── public/
│   ├── ads.txt                    # AdSense doğrulama
│   ├── images/                    # Statik görseller
│   │   ├── zodiac/               # 12 burç ikonu
│   │   ├── tarot/                # Tarot kartı görselleri
│   │   └── shop/                 # Ürün görselleri
│   └── robots.txt
│
├── src/
│   ├── app/                       # Next.js App Router (Sayfalar)
│   │   ├── layout.tsx             # Root layout + providers
│   │   ├── page.tsx               # Anasayfa
│   │   ├── globals.css            # Design system + tokens
│   │   │
│   │   ├── shop/
│   │   │   └── page.tsx           # Etsy ürünleri listesi
│   │   ├── horoscopes/
│   │   │   ├── page.tsx           # 12 burç genel bakış
│   │   │   └── [sign]/page.tsx    # Tekil burç sayfası
│   │   ├── tarot/
│   │   │   ├── page.tsx           # Tarot rehberi
│   │   │   └── [card]/page.tsx    # Tekil kart anlamı
│   │   ├── blog/
│   │   │   ├── page.tsx           # Blog listesi
│   │   │   └── [slug]/page.tsx    # Blog yazısı
│   │   ├── spiritual/
│   │   │   └── page.tsx           # Spiritüel bilgiler hub
│   │   ├── admin/                 # 🔐 Admin Panel (korumalı)
│   │   │   ├── layout.tsx         # Admin layout + auth guard
│   │   │   ├── page.tsx           # Dashboard
│   │   │   ├── products/page.tsx  # Ürün CRUD
│   │   │   ├── blog/page.tsx      # Blog yazısı CRUD
│   │   │   ├── horoscopes/page.tsx# Burç yorumu CRUD
│   │   │   └── tarot/page.tsx     # Tarot kartı CRUD
│   │   ├── about/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   └── sitemap.ts             # Dinamik sitemap
│   │
│   ├── domain/                    # İş Mantığı (Saf TypeScript — React YOK!)
│   │   ├── entities/
│   │   │   ├── Product.ts
│   │   │   ├── ZodiacSign.ts
│   │   │   ├── TarotCard.ts
│   │   │   ├── BlogPost.ts
│   │   │   └── Horoscope.ts
│   │   ├── repositories/
│   │   │   ├── IProductRepository.ts
│   │   │   ├── IHoroscopeRepository.ts
│   │   │   ├── ITarotRepository.ts
│   │   │   └── IBlogRepository.ts
│   │   └── usecases/
│   │       ├── GetProducts.ts
│   │       ├── GetHoroscope.ts
│   │       ├── GetTarotCards.ts
│   │       └── GetBlogPosts.ts
│   │
│   ├── data/                      # Veri Katmanı (Supabase)
│   │   ├── supabase/
│   │   │   ├── client.ts          # Supabase client (server/browser)
│   │   │   ├── middleware.ts      # Auth middleware
│   │   │   └── types.ts           # DB types (generated)
│   │   ├── repositories/
│   │   │   ├── ProductRepository.ts
│   │   │   ├── HoroscopeRepository.ts
│   │   │   ├── TarotRepository.ts
│   │   │   └── BlogRepository.ts
│   │   └── mappers/
│   │       └── index.ts
│   │
│   ├── presentation/              # UI Bileşenleri
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── MobileMenu.tsx
│   │   │   ├── shop/
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   └── ProductGrid.tsx
│   │   │   ├── horoscope/
│   │   │   │   ├── ZodiacWheel.tsx
│   │   │   │   ├── SignCard.tsx
│   │   │   │   └── HoroscopeReader.tsx
│   │   │   ├── tarot/
│   │   │   │   ├── TarotCardDisplay.tsx
│   │   │   │   └── TarotGrid.tsx
│   │   │   ├── blog/
│   │   │   │   ├── BlogCard.tsx
│   │   │   │   └── BlogList.tsx
│   │   │   ├── ads/
│   │   │   │   └── AdUnit.tsx
│   │   │   └── shared/
│   │   │       ├── Button.tsx
│   │   │       ├── Card.tsx
│   │   │       ├── Badge.tsx
│   │   │       ├── JsonLd.tsx
│   │   │       └── Newsletter.tsx
│   │   └── hooks/
│   │       ├── useHoroscope.ts
│   │       └── useProducts.ts
│   │
│   └── lib/                       # Yardımcı Araçlar
│       ├── constants.ts
│       ├── seo.ts
│       └── utils.ts
│
├── content/                       # MDX blog içerikleri
│   └── blog/
│       ├── tarot-baslangic-rehberi.mdx
│       └── burc-yorumu-mayis-2026.mdx
│
├── IMPLEMENTATION_PLAN.md         # Bu dosya
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 5. Tasarım Sistemi

### Renk Paleti (Light & Minimal)

```css
:root {
  /* Primary — Mystic Purple */
  --color-primary: #6B4EAA;
  --color-primary-light: #8B6FCE;
  --color-primary-dark: #4A3578;

  /* Accent — Warm Gold */
  --color-accent: #C9A96E;
  --color-accent-light: #E2CFA0;

  /* Neutrals */
  --color-bg: #FAFAF8;
  --color-surface: #FFFFFF;
  --color-text: #2D2A33;
  --color-text-secondary: #6B6777;
  --color-border: #E8E5ED;

  /* Typography */
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
}
```

### Tipografi

| Element | Font | Ağırlık | Boyut |
|---------|------|---------|-------|
| H1 | Playfair Display | 700 | 48px |
| H2 | Playfair Display | 600 | 36px |
| H3 | Playfair Display | 600 | 28px |
| Body | Inter | 400 | 16px |
| Caption | Inter | 400 | 14px |

### İlham Kaynakları
- **Co-Star** → Ultra-clean editorial estetik
- **astrology.com** → Zodiac grid, shop, tarot derinliği
- **tarot.com** → Readings, card meanings, planet tracker
- **horoscope.com** → Sign picker, günlük okumalar

---

## 6. Sayfalar & İçerik Yapısı

| Sayfa | URL | Tür | İçerik |
|-------|-----|-----|--------|
| Anasayfa | `/` | SSG | Hero + zodiac picker + shop highlight + blog preview |
| Mağaza | `/shop` | SSG | Etsy ürün kartları grid → dış link |
| Burçlar | `/horoscopes` | SSG | 12 burç kartı grid |
| Burç Detay | `/horoscopes/[sign]` | ISR | Günlük/haftalık/aylık yorum |
| Tarot Rehberi | `/tarot` | SSG | Tarot kartları grid |
| Kart Detay | `/tarot/[card]` | SSG | Kart anlamı + görsel |
| Blog | `/blog` | ISR | Makale listesi |
| Blog Yazısı | `/blog/[slug]` | SSG | MDX içerik |
| Spiritüel | `/spiritual` | SSG | Kristaller, çakralar, numeroloji |
| Hakkında | `/about` | SSG | Hakkımda |
| Gizlilik | `/privacy` | SSG | KVKK/GDPR |
| Şartlar | `/terms` | SSG | Kullanım şartları |

---

## 7. Gelir Modeli

```
┌──────────────────────────────────────────────────┐
│               Gelir Kanalları                    │
├──────────────┬────────────┬──────────────────────┤
│  Etsy Mağaza │  AdSense   │  Affiliate           │
│  (Direkt)    │  (Reklam)  │  (Amazon vb.)        │
│              │            │  Etsy HARİCİ!        │
│  "Satın Al"  │  Banner    │  Blog/rehber içi     │
│  → Etsy URL  │  Sidebar   │  ürün önerileri      │
│              │  In-content│  (kitap, deste, vb.) │
└──────────────┴────────────┴──────────────────────┘
```

---

## 8. Uygulama Fazları

### Faz 1: Temel (Gün 1-3)
- [x] Next.js 16 proje kurulumu + TypeScript strict
- [x] Supabase projesi oluşturma + DB şeması
- [x] Klasör yapısı (domain/data/presentation)
- [x] Design system (globals.css — tüm tokenlar)
- [x] Layout bileşenleri (Header, Footer, Navbar)
- [x] Domain entities & repository interfaces
- [x] Supabase client + repository implementasyonları

### Faz 2: Ana Sayfalar (Gün 4-6)
- [x] Anasayfa (Hero, zodiac picker, shop highlight, blog preview)
- [x] Mağaza sayfası (Etsy ürün kartları + dış link)
- [x] Burçlar sayfası + tekil burç sayfaları
- [x] Tarot rehberi + tekil kart sayfaları

### Faz 3: İçerik & Blog (Gün 7-8)
- [x] Blog sistemi (Supabase'den çekilen)
- [x] Blog listesi + tekil yazı sayfaları
- [x] Spiritüel bilgiler hub sayfası

### Faz 4: Admin Panel + Monetizasyon (Gün 9-11)
- [ ] Admin auth (Supabase Auth + RLS koruması) — kod/RLS hazır, ilk admin kullanıcısı oluşturulacak
- [x] Admin dashboard (özet istatistikler)
- [x] Ürün CRUD (Etsy linkleri yönetimi)
- [x] Blog yazısı CRUD (oluştur, düzenle, yayınla)
- [x] Burç yorumu CRUD (günlük/haftalık/aylık)
- [x] Tarot kartı CRUD
- [ ] Google AdSense entegrasyonu (next/script)
- [ ] AdUnit bileşeni (banner, sidebar, in-content)
- [x] ads.txt dosyası
- [ ] Affiliate link altyapısı (Amazon vb. — Etsy hariç)
- [ ] JSON-LD structured data (Product, Article, FAQ)

### Faz 5: Polish & Deploy (Gün 12-14)
- [x] SEO optimizasyonu (meta, OG, sitemap.ts, robots.txt)
- [ ] Responsive tasarım polishing
- [ ] Micro-animasyonlar & hover efektleri
- [ ] Hukuki sayfalar (Gizlilik, Şartlar, Çerez politikası) — Gizlilik/Şartlar hazır, çerez politikası eksik
- [ ] Netlify deployment
- [ ] Core Web Vitals optimizasyonu

---

## 9. Kritik Kurallar

1. **Clean Architecture**: Domain katmanı = saf TypeScript (React import YOK!)
2. **SEO First**: Her sayfa → meta tags, OG images, JSON-LD
3. **Performans**: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1
4. **Erişilebilirlik**: Semantik HTML, ARIA, klavye navigasyonu
5. **Hukuki**: KVKK çerez aydınlatması, affiliate açıklaması
6. **AdSense**: Önce 15+ kaliteli sayfa, sonra başvuru
7. **Sürüm Uyumu**: Tüm paketler karşılıklı uyumlu (yukarıdaki tablo referans)

---

## 10. Kurulum Komutları

```bash
# 1. Proje oluşturma
npx -y create-next-app@latest ./ --typescript --app --src-dir --no-tailwind --eslint --use-npm --yes --empty

# 2. Supabase
npm install @supabase/supabase-js @supabase/ssr

# 3. Font paketleri
npm install @fontsource/playfair-display @fontsource/inter

# 4. İkonlar
npm install lucide-react

# 5. Form & validation
npm install react-hook-form zod

# 6. SEO
npm install web-vitals
```

---

## 11. Supabase DB Şeması (Tablolar)

```sql
-- Ürünler (Etsy shop)
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  image_url TEXT,
  etsy_url TEXT NOT NULL,
  category TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Blog yazıları
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  category TEXT,
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Burç yorumları
CREATE TABLE horoscopes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sign TEXT NOT NULL,
  period TEXT NOT NULL,        -- 'daily' | 'weekly' | 'monthly'
  content TEXT NOT NULL,
  date DATE NOT NULL,
  love_rating INT,
  career_rating INT,
  health_rating INT,
  lucky_number INT,
  lucky_color TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tarot kartları
CREATE TABLE tarot_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  arcana TEXT NOT NULL,         -- 'major' | 'minor'
  suit TEXT,                    -- 'cups' | 'wands' | 'swords' | 'pentacles'
  card_number INT,
  image_url TEXT,
  upright_meaning TEXT,
  reversed_meaning TEXT,
  description TEXT,
  keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Burç bilgileri (statik)
CREATE TABLE zodiac_signs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  symbol TEXT,
  element TEXT,                 -- 'fire' | 'earth' | 'air' | 'water'
  modality TEXT,                -- 'cardinal' | 'fixed' | 'mutable'
  ruling_planet TEXT,
  date_range TEXT,
  description TEXT,
  traits TEXT[],
  image_url TEXT
);
```

### Admin Paneli Özellikleri

| Alan | CRUD | Detay |
|------|------|-------|
| **Ürünler** | ✅ Ekle/Düzenle/Sil/Yayınla | Etsy URL, fiyat, görsel, kategori, sıralama |
| **Blog** | ✅ Ekle/Düzenle/Sil/Yayınla | Rich text, kapak görseli, tag, SEO meta |
| **Burç Yorumları** | ✅ Ekle/Düzenle/Sil | Günlük/haftalık/aylık, rating, şanslı sayı |
| **Tarot Kartları** | ✅ Ekle/Düzenle/Sil | Anlam, anahtar kelimeler, görsel |
| **Dashboard** | 📊 Sadece görüntüle | Toplam içerik sayıları, son eklenenler |
