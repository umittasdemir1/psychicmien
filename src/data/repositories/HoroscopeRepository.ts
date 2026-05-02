import { SupabaseClient } from '@supabase/supabase-js';
import { Horoscope, HoroscopePeriod } from '../../domain/entities/Horoscope';
import { IHoroscopeRepository } from '../../domain/repositories/IHoroscopeRepository';
import { toHoroscope } from '../mappers';
import { Database } from '../supabase/types';

type DB = SupabaseClient<Database>;

export class HoroscopeRepository implements IHoroscopeRepository {
  constructor(private supabase: DB) {}

  async getBySignAndPeriod(sign: string, period: HoroscopePeriod, date?: string): Promise<Horoscope | null> {
    let query = this.supabase
      .from('horoscopes')
      .select('*')
      .eq('sign', sign)
      .eq('period', period)
      .order('date', { ascending: false });

    if (date) query = query.eq('date', date);

    const { data, error } = await query.limit(1);
    if (error || !data?.length) return null;
    return toHoroscope(data[0]);
  }

  async getBySign(sign: string): Promise<Horoscope[]> {
    const { data, error } = await this.supabase
      .from('horoscopes')
      .select('*')
      .eq('sign', sign)
      .order('date', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(toHoroscope);
  }

  async create(input: Omit<Horoscope, 'id' | 'createdAt'>): Promise<Horoscope> {
    const { data, error } = await this.supabase
      .from('horoscopes')
      .insert({
        sign: input.sign,
        period: input.period,
        content: input.content,
        date: input.date,
        love_rating: input.loveRating,
        career_rating: input.careerRating,
        health_rating: input.healthRating,
        lucky_number: input.luckyNumber,
        lucky_color: input.luckyColor,
      })
      .select()
      .single();
    if (error) throw error;
    return toHoroscope(data);
  }

  async update(id: string, input: Partial<Horoscope>): Promise<Horoscope> {
    const { data, error } = await this.supabase
      .from('horoscopes')
      .update({
        ...(input.sign !== undefined && { sign: input.sign }),
        ...(input.period !== undefined && { period: input.period }),
        ...(input.content !== undefined && { content: input.content }),
        ...(input.date !== undefined && { date: input.date }),
        ...(input.loveRating !== undefined && { love_rating: input.loveRating }),
        ...(input.careerRating !== undefined && { career_rating: input.careerRating }),
        ...(input.healthRating !== undefined && { health_rating: input.healthRating }),
        ...(input.luckyNumber !== undefined && { lucky_number: input.luckyNumber }),
        ...(input.luckyColor !== undefined && { lucky_color: input.luckyColor }),
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return toHoroscope(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from('horoscopes').delete().eq('id', id);
    if (error) throw error;
  }
}
