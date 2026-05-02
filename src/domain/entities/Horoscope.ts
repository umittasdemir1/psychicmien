export type HoroscopePeriod = 'daily' | 'weekly' | 'monthly';

export interface Horoscope {
  id: string;
  sign: string;
  period: HoroscopePeriod;
  content: string;
  date: string;
  loveRating: number | null;
  careerRating: number | null;
  healthRating: number | null;
  luckyNumber: number | null;
  luckyColor: string | null;
  createdAt: string;
}
