import { TarotCard } from '../entities/TarotCard';

export interface ITarotRepository {
  getAll(): Promise<TarotCard[]>;
  getBySlug(slug: string): Promise<TarotCard | null>;
  getByArcana(arcana: 'major' | 'minor'): Promise<TarotCard[]>;
  create(data: Omit<TarotCard, 'id' | 'createdAt'>): Promise<TarotCard>;
  update(id: string, data: Partial<TarotCard>): Promise<TarotCard>;
  delete(id: string): Promise<void>;
}
