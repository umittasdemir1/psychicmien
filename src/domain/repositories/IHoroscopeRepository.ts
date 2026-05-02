import { Horoscope, HoroscopePeriod } from '../entities/Horoscope';

export interface IHoroscopeRepository {
  getBySignAndPeriod(sign: string, period: HoroscopePeriod, date?: string): Promise<Horoscope | null>;
  getBySign(sign: string): Promise<Horoscope[]>;
  create(data: Omit<Horoscope, 'id' | 'createdAt'>): Promise<Horoscope>;
  update(id: string, data: Partial<Horoscope>): Promise<Horoscope>;
  delete(id: string): Promise<void>;
}
