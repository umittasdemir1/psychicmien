import 'server-only';
import { Locale } from './config';

const dictionaries = {
  tr: () => import('../dictionaries/tr.json').then(m => m.default),
  en: () => import('../dictionaries/en.json').then(m => m.default),
  es: () => import('../dictionaries/es.json').then(m => m.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
