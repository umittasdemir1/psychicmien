export const SITE_NAME = 'PsychicMien';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://psychicmien.netlify.app';
export const SITE_DESCRIPTION = 'Tarot okumları, burç yorumları, spiritüel rehberlik ve mistik mağaza.';

export const ZODIAC_SIGNS = [
  { slug: 'aries',       name: 'Koç',        symbol: '♈', dateRange: '21 Mar – 19 Nis' },
  { slug: 'taurus',      name: 'Boğa',       symbol: '♉', dateRange: '20 Nis – 20 May' },
  { slug: 'gemini',      name: 'İkizler',    symbol: '♊', dateRange: '21 May – 20 Haz' },
  { slug: 'cancer',      name: 'Yengeç',     symbol: '♋', dateRange: '21 Haz – 22 Tem' },
  { slug: 'leo',         name: 'Aslan',      symbol: '♌', dateRange: '23 Tem – 22 Ağu' },
  { slug: 'virgo',       name: 'Başak',      symbol: '♍', dateRange: '23 Ağu – 22 Eyl' },
  { slug: 'libra',       name: 'Terazi',     symbol: '♎', dateRange: '23 Eyl – 22 Eki' },
  { slug: 'scorpio',     name: 'Akrep',      symbol: '♏', dateRange: '23 Eki – 21 Kas' },
  { slug: 'sagittarius', name: 'Yay',        symbol: '♐', dateRange: '22 Kas – 21 Ara' },
  { slug: 'capricorn',   name: 'Oğlak',      symbol: '♑', dateRange: '22 Ara – 19 Oca' },
  { slug: 'aquarius',    name: 'Kova',       symbol: '♒', dateRange: '20 Oca – 18 Şub' },
  { slug: 'pisces',      name: 'Balık',      symbol: '♓', dateRange: '19 Şub – 20 Mar' },
] as const;

export const NAV_LINKS = [
  { href: '/horoscopes', label: 'Burçlar' },
  { href: '/tarot',      label: 'Tarot' },
  { href: '/blog',       label: 'Blog' },
  { href: '/spiritual',  label: 'Spiritüel' },
  { href: '/shop',       label: 'Mağaza' },
] as const;
