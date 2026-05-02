import { SupabaseClient } from '@supabase/supabase-js';
import { TarotCard } from '../../domain/entities/TarotCard';
import { ITarotRepository } from '../../domain/repositories/ITarotRepository';
import { toTarotCard } from '../mappers';
import { Database } from '../supabase/types';

type DB = SupabaseClient<Database>;

export class TarotRepository implements ITarotRepository {
  constructor(private supabase: DB) {}

  async getAll(): Promise<TarotCard[]> {
    const { data, error } = await this.supabase
      .from('tarot_cards')
      .select('*')
      .order('arcana', { ascending: true })
      .order('card_number', { ascending: true });
    if (error) throw error;
    return (data ?? []).map(toTarotCard);
  }

  async getBySlug(slug: string): Promise<TarotCard | null> {
    const { data, error } = await this.supabase
      .from('tarot_cards')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) return null;
    return toTarotCard(data);
  }

  async getByArcana(arcana: 'major' | 'minor'): Promise<TarotCard[]> {
    const { data, error } = await this.supabase
      .from('tarot_cards')
      .select('*')
      .eq('arcana', arcana)
      .order('card_number', { ascending: true });
    if (error) throw error;
    return (data ?? []).map(toTarotCard);
  }

  async create(input: Omit<TarotCard, 'id' | 'createdAt'>): Promise<TarotCard> {
    const { data, error } = await this.supabase
      .from('tarot_cards')
      .insert({
        name: input.name,
        slug: input.slug,
        arcana: input.arcana,
        suit: input.suit,
        card_number: input.cardNumber,
        image_url: input.imageUrl,
        upright_meaning: input.uprightMeaning,
        reversed_meaning: input.reversedMeaning,
        description: input.description,
        keywords: input.keywords,
      })
      .select()
      .single();
    if (error) throw error;
    return toTarotCard(data);
  }

  async update(id: string, input: Partial<TarotCard>): Promise<TarotCard> {
    const { data, error } = await this.supabase
      .from('tarot_cards')
      .update({
        ...(input.name !== undefined && { name: input.name }),
        ...(input.slug !== undefined && { slug: input.slug }),
        ...(input.arcana !== undefined && { arcana: input.arcana }),
        ...(input.suit !== undefined && { suit: input.suit }),
        ...(input.cardNumber !== undefined && { card_number: input.cardNumber }),
        ...(input.imageUrl !== undefined && { image_url: input.imageUrl }),
        ...(input.uprightMeaning !== undefined && { upright_meaning: input.uprightMeaning }),
        ...(input.reversedMeaning !== undefined && { reversed_meaning: input.reversedMeaning }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.keywords !== undefined && { keywords: input.keywords }),
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return toTarotCard(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from('tarot_cards').delete().eq('id', id);
    if (error) throw error;
  }
}
